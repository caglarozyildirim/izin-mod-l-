/**
 * Workflow Engine for Leave Management System
 * Handles leave request workflow states and transitions
 */

class WorkflowEngine {
    constructor() {
        this.workflows = new Map();
        this.emailQueue = [];
        this.initializeFromStorage();
    }

    // Workflow states
    static STATES = {
        CREATED: 'created',
        PENDING_MANAGER: 'pending_manager',
        MANAGER_APPROVED: 'manager_approved',
        MANAGER_REJECTED: 'manager_rejected',
        FORM_GENERATED: 'form_generated',
        FORM_UPLOADED: 'form_uploaded',
        PENDING_CONFIRMATION: 'pending_confirmation',
        CONFIRMED: 'confirmed',
        AUTO_CONFIRMED: 'auto_confirmed',
        COMPLETED: 'completed'
    };

    // Workflow transitions
    static TRANSITIONS = {
        'created': ['pending_manager'],
        'pending_manager': ['manager_approved', 'manager_rejected'],
        'manager_approved': ['form_generated'],
        'form_generated': ['form_uploaded'],
        'form_uploaded': ['pending_confirmation'],
        'pending_confirmation': ['confirmed', 'auto_confirmed'],
        'confirmed': ['completed'],
        'auto_confirmed': ['completed']
    };

    /**
     * Initialize workflows from localStorage
     */
    initializeFromStorage() {
        const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
        leaveRequests.forEach(request => {
            if (!request.workflowState) {
                // Migrate old requests to new workflow system
                this.migrateRequest(request);
            } else {
                this.workflows.set(request.id, {
                    requestId: request.id,
                    currentState: request.workflowState,
                    history: request.workflowHistory || [],
                    metadata: request.workflowMetadata || {}
                });
            }
        });
    }

    /**
     * Migrate old request format to new workflow system
     */
    migrateRequest(request) {
        let state = WorkflowEngine.STATES.CREATED;

        if (request.status === 'pending') {
            state = WorkflowEngine.STATES.PENDING_MANAGER;
        } else if (request.status === 'approved') {
            if (request.leaveConfirmed) {
                state = WorkflowEngine.STATES.COMPLETED;
            } else if (request.formUploaded) {
                state = WorkflowEngine.STATES.FORM_UPLOADED;
            } else {
                state = WorkflowEngine.STATES.MANAGER_APPROVED;
            }
        } else if (request.status === 'rejected') {
            state = WorkflowEngine.STATES.MANAGER_REJECTED;
        }

        const workflow = {
            requestId: request.id,
            currentState: state,
            history: [{
                state: state,
                timestamp: request.createdAt || new Date().toISOString(),
                actor: request.userId,
                note: 'Migrated from old system'
            }],
            metadata: {}
        };

        this.workflows.set(request.id, workflow);
        this.updateRequestWorkflow(request.id, workflow);
    }

    /**
     * Create a new workflow for a leave request
     */
    createWorkflow(requestId, userId) {
        const workflow = {
            requestId,
            currentState: WorkflowEngine.STATES.CREATED,
            history: [{
                state: WorkflowEngine.STATES.CREATED,
                timestamp: new Date().toISOString(),
                actor: userId,
                note: 'Leave request created'
            }],
            metadata: {
                createdBy: userId,
                createdAt: new Date().toISOString()
            }
        };

        this.workflows.set(requestId, workflow);
        this.updateRequestWorkflow(requestId, workflow);

        // Auto-transition to pending_manager
        this.transition(requestId, WorkflowEngine.STATES.PENDING_MANAGER, userId, 'Submitted for manager approval');

        return workflow;
    }

    /**
     * Transition workflow to a new state
     */
    transition(requestId, newState, actorId, note = '') {
        const workflow = this.workflows.get(requestId);
        if (!workflow) {
            console.error(`Workflow not found for request ${requestId}`);
            return false;
        }

        // Validate transition
        const allowedTransitions = WorkflowEngine.TRANSITIONS[workflow.currentState] || [];
        if (!allowedTransitions.includes(newState)) {
            console.error(`Invalid transition from ${workflow.currentState} to ${newState}`);
            return false;
        }

        // Record previous state
        const previousState = workflow.currentState;

        // Update state
        workflow.currentState = newState;
        workflow.history.push({
            state: newState,
            previousState,
            timestamp: new Date().toISOString(),
            actor: actorId,
            note
        });

        // Update workflow in map
        this.workflows.set(requestId, workflow);

        // Persist to localStorage
        this.updateRequestWorkflow(requestId, workflow);

        // Trigger state-specific actions
        this.handleStateActions(requestId, newState, actorId);

        return true;
    }

    /**
     * Handle actions for specific states
     */
    handleStateActions(requestId, state, actorId) {
        const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
        const request = leaveRequests.find(r => r.id === requestId);

        if (!request) return;

        switch (state) {
            case WorkflowEngine.STATES.MANAGER_APPROVED:
                // Send email notification with form creation link
                this.queueEmail({
                    type: 'manager_approval',
                    to: request.userId,
                    requestId,
                    template: 'email-template-1',
                    subject: 'İzin Talebiniz Onaylandı - Form Oluşturun',
                    data: {
                        employeeName: this.getUserName(request.userId),
                        leaveType: request.type,
                        startDate: request.startDate,
                        endDate: request.endDate,
                        returnToWorkDate: request.returnToWorkDate,
                        totalDays: request.days,
                        formCreateLink: `form-upload.html?id=${requestId}`
                    }
                });
                break;

            case WorkflowEngine.STATES.FORM_UPLOADED:
                // Check if leave has ended
                const today = new Date();
                const endDate = new Date(request.endDate);

                if (endDate < today) {
                    // Leave has ended, send confirmation request
                    this.transition(requestId, WorkflowEngine.STATES.PENDING_CONFIRMATION, 'system', 'Leave period ended');
                }
                break;

            case WorkflowEngine.STATES.PENDING_CONFIRMATION:
                // Send leave usage confirmation email
                const token = btoa(requestId + request.userId);
                this.queueEmail({
                    type: 'leave_confirmation',
                    to: request.userId,
                    requestId,
                    template: 'email-template-2',
                    subject: 'İzninizi Kullandığınızı Onaylayın',
                    data: {
                        employeeName: this.getUserName(request.userId),
                        leaveType: request.type,
                        startDate: request.startDate,
                        endDate: request.endDate,
                        totalDays: request.days,
                        confirmationLink: `izin-onay.html?id=${requestId}&token=${token}`
                    }
                });

                // Set auto-confirmation timer (24 hours)
                this.setAutoConfirmation(requestId, 24 * 60 * 60 * 1000);
                break;

            case WorkflowEngine.STATES.CONFIRMED:
            case WorkflowEngine.STATES.AUTO_CONFIRMED:
                // Mark as completed
                this.transition(requestId, WorkflowEngine.STATES.COMPLETED, actorId,
                    state === WorkflowEngine.STATES.AUTO_CONFIRMED ? 'Auto-confirmed after 24 hours' : 'Manually confirmed');
                break;

            case WorkflowEngine.STATES.COMPLETED:
                // Send completion notification
                this.queueEmail({
                    type: 'completion',
                    to: request.userId,
                    requestId,
                    template: 'email-template-4',
                    subject: 'İzin Kaydınız Tamamlandı',
                    data: {
                        employeeName: this.getUserName(request.userId),
                        leaveType: request.type,
                        startDate: request.startDate,
                        endDate: request.endDate,
                        totalDays: request.days,
                        confirmationDate: new Date().toISOString()
                    }
                });
                break;
        }

        // Process email queue
        this.processEmailQueue();
    }

    /**
     * Set auto-confirmation timer
     */
    setAutoConfirmation(requestId, delayMs) {
        const workflow = this.workflows.get(requestId);
        if (!workflow) return;

        // Store auto-confirmation time in metadata
        workflow.metadata.autoConfirmTime = new Date(Date.now() + delayMs).toISOString();
        this.workflows.set(requestId, workflow);
        this.updateRequestWorkflow(requestId, workflow);

        // In a real application, this would be handled by a backend scheduler
        // For demo purposes, we'll simulate it with setTimeout
        setTimeout(() => {
            const currentWorkflow = this.workflows.get(requestId);
            if (currentWorkflow && currentWorkflow.currentState === WorkflowEngine.STATES.PENDING_CONFIRMATION) {
                this.transition(requestId, WorkflowEngine.STATES.AUTO_CONFIRMED, 'system', 'Auto-confirmed after 24 hours');
            }
        }, delayMs);
    }

    /**
     * Queue an email notification
     */
    queueEmail(email) {
        email.timestamp = new Date().toISOString();
        email.status = 'queued';
        this.emailQueue.push(email);

        // Store in localStorage for persistence
        localStorage.setItem('emailQueue', JSON.stringify(this.emailQueue));
    }

    /**
     * Process email queue (simulate email sending)
     */
    processEmailQueue() {
        const pendingEmails = this.emailQueue.filter(e => e.status === 'queued');

        pendingEmails.forEach(email => {
            // In a real application, this would call an email API
            console.log('📧 Sending email:', email);

            // Mark as sent
            email.status = 'sent';
            email.sentAt = new Date().toISOString();
        });

        // Update storage
        localStorage.setItem('emailQueue', JSON.stringify(this.emailQueue));

        // Store email notifications for UI display
        this.storeNotifications(pendingEmails);
    }

    /**
     * Store notifications for UI display
     */
    storeNotifications(emails) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');

        emails.forEach(email => {
            notifications.push({
                id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                type: email.type,
                userId: email.to,
                requestId: email.requestId,
                subject: email.subject,
                timestamp: email.timestamp,
                read: false,
                data: email.data
            });
        });

        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    /**
     * Update request workflow in localStorage
     */
    updateRequestWorkflow(requestId, workflow) {
        const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
        const requestIndex = leaveRequests.findIndex(r => r.id === requestId);

        if (requestIndex !== -1) {
            leaveRequests[requestIndex].workflowState = workflow.currentState;
            leaveRequests[requestIndex].workflowHistory = workflow.history;
            leaveRequests[requestIndex].workflowMetadata = workflow.metadata;
            localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
        }
    }

    /**
     * Get user name by ID
     */
    getUserName(userId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === userId);
        return user ? user.name : 'Bilinmeyen Kullanıcı';
    }

    /**
     * Get workflow for a request
     */
    getWorkflow(requestId) {
        return this.workflows.get(requestId);
    }

    /**
     * Get workflow history for a request
     */
    getHistory(requestId) {
        const workflow = this.workflows.get(requestId);
        return workflow ? workflow.history : [];
    }

    /**
     * Check if auto-confirmation is due
     */
    checkAutoConfirmations() {
        const now = new Date();

        this.workflows.forEach((workflow, requestId) => {
            if (workflow.currentState === WorkflowEngine.STATES.PENDING_CONFIRMATION) {
                const autoConfirmTime = workflow.metadata.autoConfirmTime;
                if (autoConfirmTime && new Date(autoConfirmTime) <= now) {
                    this.transition(requestId, WorkflowEngine.STATES.AUTO_CONFIRMED, 'system', 'Auto-confirmed after timeout');
                }
            }
        });
    }

    /**
     * Check for leave periods that have ended
     */
    checkLeaveEndDates() {
        const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        leaveRequests.forEach(request => {
            const workflow = this.workflows.get(request.id);
            if (!workflow) return;

            // Check if leave has ended and form is uploaded but not yet confirmed
            if (workflow.currentState === WorkflowEngine.STATES.FORM_UPLOADED) {
                const endDate = new Date(request.endDate);
                endDate.setHours(0, 0, 0, 0);

                // Add 1 day buffer after leave ends
                const confirmationDate = new Date(endDate);
                confirmationDate.setDate(confirmationDate.getDate() + 1);

                if (today >= confirmationDate) {
                    this.transition(request.id, WorkflowEngine.STATES.PENDING_CONFIRMATION, 'system', 'Leave period ended');
                }
            }
        });
    }

    /**
     * Get pending actions for a user
     */
    getPendingActions(userId) {
        const actions = [];
        const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');

        leaveRequests.forEach(request => {
            if (request.userId !== userId) return;

            const workflow = this.workflows.get(request.id);
            if (!workflow) return;

            switch (workflow.currentState) {
                case WorkflowEngine.STATES.MANAGER_APPROVED:
                    if (!request.formUploaded) {
                        actions.push({
                            requestId: request.id,
                            action: 'upload_form',
                            description: 'İmzalı formu yükle',
                            link: `form-upload.html?id=${request.id}`,
                            priority: 'high'
                        });
                    }
                    break;

                case WorkflowEngine.STATES.PENDING_CONFIRMATION:
                    actions.push({
                        requestId: request.id,
                        action: 'confirm_leave',
                        description: 'İzin kullanımını onayla',
                        link: `izin-onay.html?id=${request.id}&token=${btoa(request.id + userId)}`,
                        priority: 'high',
                        deadline: workflow.metadata.autoConfirmTime
                    });
                    break;
            }
        });

        return actions;
    }
}

// Initialize global workflow engine
window.workflowEngine = new WorkflowEngine();

// Run periodic checks every hour
setInterval(() => {
    window.workflowEngine.checkAutoConfirmations();
    window.workflowEngine.checkLeaveEndDates();
}, 60 * 60 * 1000); // 1 hour

// Run checks on page load
window.addEventListener('DOMContentLoaded', () => {
    window.workflowEngine.checkAutoConfirmations();
    window.workflowEngine.checkLeaveEndDates();
});
