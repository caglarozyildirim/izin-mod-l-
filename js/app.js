/*
=================================================
TEZ MEDİKAL - İZİN YÖNETİM SİSTEMİ
Ana Uygulama Mantığı v2.0
=================================================
*/

// Global State Management
const App = {
  state: {
    currentUser: null,
    userRole: 'employee', // 'employee' | 'manager' | 'hr' | 'customerRelations'
    leaveBalance: {
      earned: 0,
      used: 0,
      remaining: 0
    },
    leaveRequests: [],
    pendingApprovals: []
  },

  // Initialize application
  init() {
    this.checkAuth();
    this.loadUserData();
    this.setupEventListeners();
    console.log('App initialized successfully');
  },

  // Check if user is authenticated
  checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');

    if (!token || !user) {
      // Redirect to login if not on login page
      if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        window.location.href = 'index.html';
      }
      return false;
    }

    this.state.currentUser = JSON.parse(user);
    this.state.userRole = this.state.currentUser.role || 'employee';

    // Role-based page access control
    this.checkPageAccess();
    return true;
  },

  // Check page access based on role
  checkPageAccess() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const role = this.state.userRole;

    const rolePages = {
      employee: ['dashboard.html', 'yeni-talep.html', 'izinlerim.html'],
      manager: ['dashboard.html', 'yeni-talep.html', 'izinlerim.html', 'onay-yonetimi.html', 'tum-izinler.html', 'raporlar.html'],
      hr: ['dashboard.html', 'yeni-talep.html', 'izinlerim.html', 'onay-yonetimi.html', 'tum-izinler.html', 'raporlar.html'],
      operation: ['dashboard.html', 'yeni-talep.html', 'izinlerim.html', 'onay-yonetimi.html', 'tum-izinler.html', 'raporlar.html'],
      customerRelations: ['dashboard.html', 'yeni-talep.html', 'izinlerim.html', 'onay-yonetimi.html', 'tum-izinler.html', 'raporlar.html', 'yerine-gorevlendirme.html']
    };

    // Allow all to access common pages
    const commonPages = ['index.html', 'profil.html', 'takvim.html'];

    if (commonPages.includes(page)) return;

    // Check if user has access to current page
    if (!rolePages[role] || !rolePages[role].includes(page)) {
      this.showNotification('Bu sayfaya erişim yetkiniz yok!', 'warning');
      setTimeout(() => window.location.href = 'dashboard.html', 1500);
    }
  },

  // Load user data
  loadUserData() {
    if (!this.state.currentUser) return;

    // Load from localStorage or API
    const savedData = localStorage.getItem(`userData_${this.state.currentUser.id}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      this.state.leaveBalance = data.leaveBalance || this.state.leaveBalance;
      this.state.leaveRequests = data.leaveRequests || [];
    } else {
      // İlk giriş - örnek veriler oluştur
      this.createSampleData();
    }
  },

  // Örnek veriler oluştur
  createSampleData() {
    if (!this.state.currentUser) return;

    console.log('Örnek veriler oluşturuluyor...');

    // İzin bakiyesi
    this.state.leaveBalance = {
      earned: 20,
      used: 5,
      remaining: 15
    };

    // Örnek izin talepleri - 2025 yılı için
    const sampleRequests = [
      {
        id: 'req_' + Date.now() + '_1',
        userId: this.state.currentUser.id,
        type: 'annual',
        startDate: '2025-01-15',
        endDate: '2025-01-19',
        days: '5 gün',
        description: 'Yıllık izin',
        status: 'approved',
        createdAt: '2025-01-10T10:00:00.000Z'
      },
      {
        id: 'req_' + Date.now() + '_2',
        userId: this.state.currentUser.id,
        type: 'annual',
        startDate: '2025-03-10',
        endDate: '2025-03-14',
        days: '5 gün',
        description: 'Yıllık izin',
        status: 'approved',
        createdAt: '2025-03-05T10:00:00.000Z'
      },
      {
        id: 'req_' + Date.now() + '_3',
        userId: this.state.currentUser.id,
        type: 'sickness',
        startDate: '2025-05-20',
        endDate: '2025-05-22',
        days: '3 gün',
        description: 'Hastalık izni',
        status: 'approved',
        createdAt: '2025-05-19T10:00:00.000Z'
      },
      {
        id: 'req_' + Date.now() + '_4',
        userId: this.state.currentUser.id,
        type: 'annual',
        startDate: '2025-07-01',
        endDate: '2025-07-10',
        days: '10 gün',
        description: 'Yaz tatili',
        status: 'approved',
        createdAt: '2025-06-25T10:00:00.000Z'
      },
      {
        id: 'req_' + Date.now() + '_5',
        userId: this.state.currentUser.id,
        type: 'excuse',
        startDate: '2025-09-05',
        endDate: '2025-09-05',
        days: '1 gün',
        description: 'Kişisel işler',
        status: 'approved',
        createdAt: '2025-09-01T10:00:00.000Z'
      },
      {
        id: 'req_' + Date.now() + '_6',
        userId: this.state.currentUser.id,
        type: 'annual',
        startDate: '2025-10-15',
        endDate: '2025-10-18',
        days: '4 gün',
        description: 'Yıllık izin',
        status: 'pending',
        createdAt: '2025-10-10T10:00:00.000Z'
      },
      {
        id: 'req_' + Date.now() + '_7',
        userId: this.state.currentUser.id,
        type: 'annual',
        startDate: '2025-11-20',
        endDate: '2025-11-22',
        days: '3 gün',
        description: 'Kısa izin',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];

    this.state.leaveRequests = sampleRequests;
    this.saveUserData();

    console.log('Örnek veriler oluşturuldu:', {
      leaveBalance: this.state.leaveBalance,
      requestCount: this.state.leaveRequests.length
    });
  },

  // Save user data
  saveUserData() {
    if (!this.state.currentUser) return;

    const data = {
      leaveBalance: this.state.leaveBalance,
      leaveRequests: this.state.leaveRequests
    };

    localStorage.setItem(`userData_${this.state.currentUser.id}`, JSON.stringify(data));
  },

  // Setup global event listeners
  setupEventListeners() {
    // Logout button
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="logout"]')) {
        this.logout();
      }
    });
  },

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  },

  // Show notification
  showNotification(message, type = 'info') {
    // Bildirim kutusu - üstte ortalanmış, overlay yok
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(-100px);
      min-width: 320px;
      max-width: 600px;
      padding: 16px 24px;
      word-wrap: break-word;
      white-space: normal;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.5;
      animation: slideDown 0.3s ease-out forwards;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease-out forwards';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  // Format date
  formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR');
  },

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  },

  // Calculate days between dates
  calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  },

  // Generate sample leave requests for demo
  generateSampleData() {
    console.log('🔄 Örnek veriler oluşturuluyor... (158 Talep)');

    // Önce demo kullanıcıları sisteme ekle (40 kullanıcı)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    const firstNames = ['Ahmet', 'Mehmet', 'Fatma', 'Ayşe', 'Ali', 'Zeynep', 'Mustafa', 'Emine', 'Can', 'Elif',
                        'Hasan', 'Hatice', 'İbrahim', 'Merve', 'Ömer', 'Esra', 'Yusuf', 'Seda', 'Mahmut', 'Gizem',
                        'Murat', 'Betül', 'Hüseyin', 'Canan', 'İsmail', 'Deniz', 'Abdullah', 'Burcu', 'Kadir', 'Pınar',
                        'Recep', 'Özlem', 'Ramazan', 'Şule', 'Osman', 'Yasemin', 'Emre', 'Aslı', 'Burak', 'Selin'];

    const lastNames = ['Yılmaz', 'Demir', 'Kaya', 'Aksoy', 'Özkan', 'Şahin', 'Arslan', 'Çelik', 'Aydın', 'Koç',
                       'Kurt', 'Yıldız', 'Öztürk', 'Keskin', 'Karaca', 'Acar', 'Polat', 'Yurt', 'Aslan', 'Güler',
                       'Erdoğan', 'Bozkurt', 'Tekin', 'Bulut', 'Doğan', 'Türk', 'Çetin', 'Taş', 'Ünal', 'Şen',
                       'Duman', 'Kara', 'Şimşek', 'Kılıç', 'Tunç', 'Demirci', 'Yaman', 'Çakır', 'Özer', 'Güneş'];

    const departments = ['Yönetim', 'IT Departmanı', 'Saha Operasyonları', 'Muhasebe', 'Satış', 'Üretim', 'Pazarlama',
                         'İnsan Kaynakları', 'Lojistik', 'Kalite Kontrol', 'Ar-Ge'];

    const demoUsers = [];
    for (let i = 0; i < 40; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[Math.floor(i / firstNames.length)];
      demoUsers.push({
        id: `emp${i + 1}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@tezmedical.com`,
        role: 'employee',
        department: departments[i % departments.length]
      });
    }

    // Demo kullanıcıları ekle (var olmayanları)
    demoUsers.forEach(demoUser => {
      if (!existingUsers.find(u => u.id === demoUser.id)) {
        existingUsers.push(demoUser);
      }
    });

    localStorage.setItem('users', JSON.stringify(existingUsers));
    console.log('✅ 40 demo kullanıcı sisteme eklendi');

    const leaveTypes = ['annual', 'excuse', 'sickness'];
    const workLocations = ['merkez', 'saha'];

    const sampleRequests = [
      // Bekleyen talepler (10 adet - Tümü IT Departmanı)
      {
        type: 'annual',
        startDate: '2025-12-15',
        endDate: '2025-12-20',
        days: '5 iş günü',
        description: 'Yılbaşı tatili için izin talebi',
        workLocation: 'merkez',
        needReplacement: false,
        userId: 'emp1',
        userName: demoUsers[0].name,
        userDepartment: 'IT Departmanı'
      },
      {
        type: 'annual',
        startDate: '2025-11-20',
        endDate: '2025-11-24',
        days: '5 iş günü',
        description: 'Aile ziyareti',
        workLocation: 'merkez',
        needReplacement: false,
        userId: 'emp2',
        userName: demoUsers[1].name,
        userDepartment: 'IT Departmanı'
      },
      {
        type: 'excuse',
        startDate: '2025-11-10',
        endDate: '2025-11-10',
        days: '4 saat',
        startTime: '14:00',
        endTime: '18:00',
        description: 'Doktor randevusu',
        workLocation: 'merkez',
        needReplacement: false,
        userId: 'emp3',
        userName: demoUsers[2].name,
        userDepartment: 'IT Departmanı'
      },
      {
        type: 'annual',
        startDate: '2025-11-25',
        endDate: '2025-11-29',
        days: '5 iş günü',
        description: 'Yıllık izin talebi',
        workLocation: 'merkez',
        needReplacement: false,
        userId: 'emp4',
        userName: demoUsers[3].name,
        userDepartment: 'IT Departmanı'
      },
      {
        type: 'sickness',
        startDate: '2025-11-08',
        endDate: '2025-11-10',
        days: '3 iş günü',
        description: 'Sağlık kontrolü',
        workLocation: 'merkez',
        needReplacement: false,
        userId: 'emp5',
        userName: demoUsers[4].name,
        userDepartment: 'IT Departmanı'
      },
      {
        type: 'annual',
        startDate: '2025-12-01',
        endDate: '2025-12-05',
        days: '5 iş günü',
        description: 'Kişisel işler',
        workLocation: 'merkez',
        needReplacement: false,
        userId: 'emp6',
        userName: demoUsers[5].name,
        userDepartment: 'IT Departmanı'
      },
      {
        type: 'excuse',
        startDate: '2025-11-12',
        endDate: '2025-11-12',
        days: '3 saat',
        startTime: '09:00',
        endTime: '12:00',
        description: 'Banka işlemi',
        workLocation: 'merkez',
        needReplacement: false,
        userId: 'emp7',
        userName: demoUsers[6].name,
        userDepartment: 'IT Departmanı'
      },
      {
        type: 'annual',
        startDate: '2025-11-18',
        endDate: '2025-11-22',
        days: '5 iş günü',
        description: 'Tatil planı',
        workLocation: 'merkez',
        needReplacement: false,
        userId: 'emp8',
        userName: demoUsers[7].name,
        userDepartment: 'IT Departmanı'
      },
      {
        type: 'education',
        startDate: '2025-12-08',
        endDate: '2025-12-12',
        days: '5 iş günü',
        description: 'Mesleki eğitim programı',
        workLocation: 'merkez',
        needReplacement: false,
        userId: 'emp9',
        userName: demoUsers[8].name,
        userDepartment: 'IT Departmanı'
      },
      {
        type: 'sickness',
        startDate: '2025-11-14',
        endDate: '2025-11-15',
        days: '2 iş günü',
        description: 'Sağlık raporu mevcut',
        workLocation: 'merkez',
        needReplacement: false,
        userId: 'emp10',
        userName: demoUsers[9].name,
        userDepartment: 'IT Departmanı'
      },

      // Reddedilen talepler (16 adet)
      {
        type: 'unpaid',
        startDate: '2025-11-15',
        endDate: '2025-11-25',
        days: '10 iş günü',
        description: 'Kişisel sebeplerle ücretsiz izin',
        workLocation: 'merkez',
        needReplacement: false,
        userId: 'emp9',
        userName: demoUsers[8].name,
        userDepartment: demoUsers[8].department,
        _forceStatus: 'manager_rejected',
        _rejectReason: 'Departmanda yeterli personel yok'
      }
    ];

    // Her talep için WorkflowEngine ile oluştur
    sampleRequests.forEach(reqData => {
      const request = WorkflowEngine.createRequest(reqData);

      // Özel status varsa zorla değiştir
      if (reqData._forceStatus) {
        request.status = reqData._forceStatus;

        // Workflow adımlarını güncelle
        if (reqData._forceStatus === 'manager_approved') {
          request.workflow.steps[0].status = 'approved';
          request.workflow.steps[0].approvedBy = 'Yönetici';
          request.workflow.steps[0].approvedAt = new Date().toISOString();
          if (request.workflow.steps[1]) {
            request.workflow.steps[1].status = 'pending';
            request.workflow.currentStep = request.workflow.steps[1].step;
          }
        } else if (reqData._forceStatus === 'customer_relations_pending') {
          // Yönetici onaylandı ve görevlendirme gerekiyor - Müşteri İlişkileri adımında
          request.workflow.steps[0].status = 'approved';
          request.workflow.steps[0].approvedBy = 'Yönetici';
          request.workflow.steps[0].approvedAt = new Date().toISOString();
          request.workflow.steps[0].requiresAssignment = true;

          // Müşteri İlişkileri adımını ekle
          if (request.workflow.steps[1] && request.workflow.steps[1].step !== 'customerRelations') {
            const customerRelationsStep = {
              step: 'customerRelations',
              role: 'customerRelations',
              label: 'Müşteri İlişkileri',
              status: 'pending',
              requiresAssignment: true
            };
            request.workflow.steps.splice(1, 0, customerRelationsStep);
          } else if (request.workflow.steps[1]) {
            request.workflow.steps[1].status = 'pending';
            request.workflow.steps[1].requiresAssignment = true;
          }

          request.workflow.currentStep = 'customerRelations';
          request.status = 'manager_approved';

          request.workflow.history.push({
            action: 'approved',
            step: 'manager',
            by: 'Yönetici',
            role: 'manager',
            timestamp: new Date().toISOString(),
            comment: 'Onaylandı - Yerine görevlendirme gerekli'
          });
        } else if (reqData._forceStatus === 'operation_approved') {
          request.workflow.steps[0].status = 'approved';
          request.workflow.steps[0].approvedBy = 'Mesul Müdür';
          request.workflow.steps[1].status = 'approved';
          request.workflow.steps[1].approvedBy = 'Operasyon';
          if (request.workflow.steps[2]) {
            request.workflow.steps[2].status = 'pending';
            request.workflow.currentStep = 'hr';
          }
        } else if (reqData._forceStatus === 'approved') {
          request.workflow.steps.forEach(step => {
            step.status = 'approved';
            step.approvedBy = step.label;
            step.approvedAt = new Date().toISOString();
          });
          request.workflow.currentStep = 'completed';
        } else if (reqData._forceStatus === 'manager_rejected') {
          request.workflow.steps[0].status = 'rejected';
          request.workflow.steps[0].rejectedBy = 'Yönetici';
          request.workflow.steps[0].rejectedAt = new Date().toISOString();
          request.workflow.currentStep = 'rejected';
          request.workflow.history.push({
            action: 'rejected',
            step: 'manager',
            by: 'Yönetici',
            role: 'manager',
            timestamp: new Date().toISOString(),
            comment: reqData._rejectReason || 'Reddedildi'
          });
        } else if (reqData._forceStatus === 'revised') {
          request.workflow.steps[0].status = 'revised';
          request.workflow.steps[0].revisedBy = 'Yönetici';
          request.workflow.steps[0].revisedAt = new Date().toISOString();
          request.revisionNote = reqData._reviseNote;
          request.workflow.history.push({
            action: 'revised',
            step: 'manager',
            by: 'Yönetici',
            role: 'manager',
            timestamp: new Date().toISOString(),
            comment: reqData._reviseNote || 'Revize gerekli'
          });
        }
      }

      WorkflowEngine.saveRequest(request);
    });

    // Otomatik onaylanmış talepler oluştur (132 adet)
    console.log('🔄 Onaylanmış talepler oluşturuluyor...');
    for (let i = 0; i < 132; i++) {
      const userIndex = (i + 10) % 40;
      const user = demoUsers[userIndex];
      const typeIndex = i % leaveTypes.length;
      const locationIndex = i % workLocations.length;

      // Rastgele tarih oluştur (geçmiş tarihler)
      const daysAgo = Math.floor(Math.random() * 180) + 30; // 30-210 gün önce
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (Math.floor(Math.random() * 5) + 1)); // 1-5 gün arası

      const reqData = {
        type: leaveTypes[typeIndex],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days: `${Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} iş günü`,
        description: 'Otomatik oluşturulmuş izin talebi',
        workLocation: workLocations[locationIndex],
        needReplacement: false,
        userId: user.id,
        userName: user.name,
        userDepartment: user.department,
        _forceStatus: 'approved'
      };

      const request = WorkflowEngine.createRequest(reqData);
      request.status = 'approved';
      request.workflow.steps.forEach(step => {
        step.status = 'approved';
        step.approvedBy = step.label;
        step.approvedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      });
      request.workflow.currentStep = 'completed';
      WorkflowEngine.saveRequest(request);
    }

    // Otomatik reddedilmiş talepler oluştur (15 adet daha - toplam 16 reddedilmiş)
    console.log('🔄 Reddedilmiş talepler oluşturuluyor...');
    for (let i = 0; i < 15; i++) {
      const userIndex = (i + 25) % 40;
      const user = demoUsers[userIndex];

      const daysAgo = Math.floor(Math.random() * 90) + 10; // 10-100 gün önce
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (Math.floor(Math.random() * 7) + 3)); // 3-10 gün arası

      const reqData = {
        type: leaveTypes[i % leaveTypes.length],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days: `${Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} iş günü`,
        description: 'Otomatik oluşturulmuş izin talebi',
        workLocation: workLocations[i % workLocations.length],
        needReplacement: false,
        userId: user.id,
        userName: user.name,
        userDepartment: user.department,
        _forceStatus: 'manager_rejected',
        _rejectReason: 'Uygun olmayan tarih aralığı'
      };

      const request = WorkflowEngine.createRequest(reqData);
      request.status = 'manager_rejected';
      request.workflow.steps[0].status = 'rejected';
      request.workflow.steps[0].rejectedBy = 'Yönetici';
      request.workflow.steps[0].rejectedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      request.workflow.currentStep = 'rejected';
      request.workflow.history.push({
        action: 'rejected',
        step: 'manager',
        by: 'Yönetici',
        role: 'manager',
        timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Uygun olmayan tarih aralığı'
      });
      WorkflowEngine.saveRequest(request);
    }

    console.log('✅ 158 adet örnek izin talebi oluşturuldu!');

    // Tüm demo kullanıcılar için izin bakiyelerini gerçek taleplere göre güncelle
    console.log('🔄 İzin bakiyeleri güncelleniyor...');
    demoUsers.forEach(user => {
      const userData = JSON.parse(localStorage.getItem(`userData_${user.id}`) || '{}');

      // Kullanıcının onaylanmış taleplerini al
      const allRequests = WorkflowEngine.getAllRequests();
      const userApprovedRequests = allRequests.filter(r =>
        r.userId === user.id && r.status === 'approved'
      );

      // Kullanılan toplam gün sayısını hesapla
      let totalUsedDays = 0;
      userApprovedRequests.forEach(req => {
        // "X iş günü" formatından sayıyı çıkar
        const daysMatch = req.days.match(/(\d+)/);
        if (daysMatch) {
          totalUsedDays += parseInt(daysMatch[1]);
        }
      });

      // İzin bakiyesini güncelle
      const earnedDays = 20; // Her çalışana 20 gün
      userData.leaveBalance = {
        earned: earnedDays,
        used: totalUsedDays,
        remaining: Math.max(0, earnedDays - totalUsedDays)
      };

      // Eğer leaveRequests yoksa boş array oluştur
      if (!userData.leaveRequests) {
        userData.leaveRequests = [];
      }

      localStorage.setItem(`userData_${user.id}`, JSON.stringify(userData));
    });

    console.log('✅ İzin bakiyeleri güncellendi!');
    console.log('📊 Durum Dağılımı:');
    console.log('   - Bekleyen: 10 talep');
    console.log('   - Onaylandı: 132 talep');
    console.log('   - Reddedildi: 16 talep');
  }
};

/*
=================================================
WORKFLOW ENGINE - İZİN ONAY SÜREÇLERİ
=================================================
*/

const WorkflowEngine = {

  // İzin tipine göre İK onayı gerekli mi?
  requiresHRApproval(leaveType) {
    // TÜM izin tipleri İK onayından geçmeli
    return true;
  },

  // İzin tipine göre belge yükleme gerekli mi?
  requiresDocumentUpload(leaveType) {
    const documentRequiredTypes = ['marriage', 'birth', 'death', 'sickness'];
    return documentRequiredTypes.includes(leaveType);
  },

  // Workflow durumları
  statuses: {
    PENDING: 'pending',                  // Onay bekliyor
    MANAGER_APPROVED: 'manager_approved', // Yönetici onayladı
    MANAGER_REJECTED: 'manager_rejected', // Yönetici reddetti
    CUSTOMER_RELATIONS_APPROVED: 'customer_relations_approved', // Müşteri İlişkileri onayladı
    CUSTOMER_RELATIONS_REJECTED: 'customer_relations_rejected', // Müşteri İlişkileri reddetti
    HR_APPROVED: 'approved',             // İK onayladı (Final)
    HR_REJECTED: 'rejected',             // İK reddetti (Final)
    REVISED: 'revised',                  // Revize edildi
    COMPLETED: 'completed'               // İzin kullanıldı
  },

  // Talep oluştur ve workflow başlat
  createRequest(requestData) {
    // requestData'da kullanıcı bilgisi varsa onu kullan, yoksa mevcut kullanıcıyı kullan
    const user = requestData.userId ? {
      id: requestData.userId,
      name: requestData.userName,
      department: requestData.userDepartment
    } : App.state.currentUser;

    if (!user) return null;

    // Workflow metadata
    const workflow = {
      currentStep: 'manager',
      steps: [],
      history: [],
      isFieldWorker: requestData.workLocation === 'saha',
      requiresHR: this.requiresHRApproval(requestData.type)
    };

    // Yeni talep objesi
    const request = {
      id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userDepartment: user.department,
      ...requestData,
      status: this.statuses.PENDING,
      createdAt: new Date().toISOString(),
      workflow: workflow
    };

    // İlk adımı belirle ve workflow başlat
    this.initializeWorkflow(request);

    return request;
  },

  // Workflow'u başlat
  initializeWorkflow(request) {
    const isFieldWorker = request.workflow.isFieldWorker;
    const requiresHR = request.workflow.requiresHR;

    // Talep sahibinin rolünü kontrol et
    const currentUserRole = request.userRole || 'employee';
    const isManagerRequest = (currentUserRole === 'manager');

    // Akış adımlarını belirle
    if (isFieldWorker) {
      // SAHA AKIŞI

      // Eğer talep Mesul Müdür veya Bölge Müdürü tarafından açılıyorsa, direkt Müşteri İlişkileri'ne gider
      if (isManagerRequest) {
        request.workflow.steps = [
          { step: 'customerRelations', role: 'customerRelations', label: 'Müşteri İlişkileri', status: 'pending', requiresAssignment: false, requiresCustomerNotification: false }
        ];
        request.workflow.currentStep = 'customerRelations';
      } else {
        // Normal saha çalışanı: Mesul Müdür → Müşteri İlişkileri
        request.workflow.steps = [
          { step: 'manager', role: 'manager', label: 'Mesul Müdür', status: 'pending', requiresAssignment: false, requiresCustomerNotification: false },
          { step: 'customerRelations', role: 'customerRelations', label: 'Müşteri İlişkileri', status: 'waiting', requiresAssignment: false, requiresCustomerNotification: false }
        ];
      }

      if (requiresHR) {
        request.workflow.steps.push(
          { step: 'hr', role: 'hr', label: 'İnsan Kaynakları', status: 'waiting', wetSignatureVerified: false, requiresDocument: this.requiresDocumentUpload(request.type) }
        );
      }
    } else {
      // GENEL MÜDÜRLÜK AKIŞI
      request.workflow.steps = [
        { step: 'manager', role: 'manager', label: 'Yönetici', status: 'pending' }
      ];

      if (requiresHR) {
        request.workflow.steps.push(
          { step: 'hr', role: 'hr', label: 'İnsan Kaynakları', status: 'waiting', wetSignatureVerified: false, requiresDocument: this.requiresDocumentUpload(request.type) }
        );
      }
    }

    // İlk bildirimi gönder
    NotificationEngine.sendRequestCreated(request);

    // Workflow history başlat
    request.workflow.history.push({
      action: 'created',
      by: request.userName,
      role: 'employee',
      timestamp: new Date().toISOString(),
      comment: 'İzin talebi oluşturuldu'
    });
  },

  // Onay işlemi
  approveRequest(requestId, approverId, approverRole, comment = '', wetSignatureVerified = false, requiresAssignment = false) {
    const request = this.getRequest(requestId);
    if (!request) return false;

    const currentStep = request.workflow.currentStep;

    // İK adımındaysa ve evrak gerekiyorsa kontrol et
    if (currentStep === 'hr') {
      const stepIndex = request.workflow.steps.findIndex(s => s.step === currentStep);
      if (stepIndex >= 0 && request.workflow.steps[stepIndex].requiresDocument) {
        if (!request.documents || request.documents.length === 0) {
          App.showNotification('Bu izin tipi için evrak yüklenmesi zorunludur!', 'error');
          return false;
        }
      }
    }

    // Mevcut adımı onayla
    const stepIndex = request.workflow.steps.findIndex(s => s.step === currentStep);
    if (stepIndex >= 0) {
      request.workflow.steps[stepIndex].status = 'approved';
      request.workflow.steps[stepIndex].approvedBy = approverId;
      request.workflow.steps[stepIndex].approvedAt = new Date().toISOString();

      // Evrak kontrolü yapıldıysa işaretle
      if (currentStep === 'hr' && request.workflow.steps[stepIndex].requiresDocument) {
        request.workflow.steps[stepIndex].documentVerified = true;
      }

      // İK adımındaysa ıslak imza kontrolü kaydet
      if (currentStep === 'hr' && wetSignatureVerified) {
        request.workflow.steps[stepIndex].wetSignatureVerified = true;
        request.workflow.steps[stepIndex].wetSignatureVerifiedAt = new Date().toISOString();
        request.workflow.steps[stepIndex].wetSignatureVerifiedBy = approverId;
      }

      // Yönetici adımında yerine görevlendirme gerekiyorsa
      if (currentStep === 'manager' && requiresAssignment) {
        request.workflow.steps[stepIndex].requiresAssignment = true;
      }
    }

    // History'ye ekle
    request.workflow.history.push({
      action: 'approved',
      step: currentStep,
      by: approverId,
      role: approverRole,
      timestamp: new Date().toISOString(),
      comment: comment || 'Onaylandı'
    });

    // Yönetici onayladı ve görevlendirme gerekiyorsa, müşteri ilişkileri adımı ekle
    if (currentStep === 'manager' && requiresAssignment) {
      // Müşteri ilişkileri adımı zaten var mı kontrol et
      const hasCustomerRelationsStep = request.workflow.steps.some(s => s.step === 'customerRelations');

      if (!hasCustomerRelationsStep) {
        // Müşteri ilişkileri adımını İK'dan önce ekle
        const customerRelationsStep = {
          step: 'customerRelations',
          role: 'customerRelations',
          label: 'Müşteri İlişkileri',
          status: 'pending',
          requiresAssignment: true
        };

        // Adımı manager'dan sonra, HR'dan önce ekle
        request.workflow.steps.splice(stepIndex + 1, 0, customerRelationsStep);

        console.log('✅ Müşteri İlişkileri adımı eklendi (yerine görevlendirme gerekiyor)');
      }
    }

    // Bir sonraki adıma geç
    if (stepIndex < request.workflow.steps.length - 1) {
      // Daha adım var
      request.workflow.steps[stepIndex + 1].status = 'pending';
      request.workflow.currentStep = request.workflow.steps[stepIndex + 1].step;
      request.status = this.getStatusByStep(request.workflow.currentStep, 'approved');

      // Bildirim gönder
      NotificationEngine.sendApprovalNotification(request, 'next_approver');
    } else {
      // Son adım - talep tamamen onaylandı
      request.status = this.statuses.HR_APPROVED;
      request.workflow.currentStep = 'completed';

      // Kullanıcıya bildirim
      NotificationEngine.sendApprovalNotification(request, 'requester', 'approved');
    }

    this.saveRequest(request);
    return true;
  },

  // Müşteri İlişkileri onay işlemi
  approveCustomerRelationsRequest(requestId, approverId, comment = '', assignmentApproved = null, sendCustomerNotification = false) {
    const request = this.getRequest(requestId);
    if (!request) return false;

    const currentStep = request.workflow.currentStep;

    if (currentStep !== 'customerRelations') {
      App.showNotification('Bu talep Müşteri İlişkileri adımında değil!', 'error');
      return false;
    }

    // Mevcut adımı onayla
    const stepIndex = request.workflow.steps.findIndex(s => s.step === currentStep);
    if (stepIndex >= 0) {
      request.workflow.steps[stepIndex].status = 'approved';
      request.workflow.steps[stepIndex].approvedBy = approverId;
      request.workflow.steps[stepIndex].approvedAt = new Date().toISOString();

      // Görevlendirme onay durumunu kaydet
      if (assignmentApproved !== null) {
        request.workflow.steps[stepIndex].assignmentApproved = assignmentApproved;
      }

      // Müşteri bilgilendirme durumunu kaydet
      if (sendCustomerNotification) {
        request.workflow.steps[stepIndex].customerNotificationSent = true;
        request.workflow.steps[stepIndex].customerNotificationSentAt = new Date().toISOString();
      }
    }

    // History'ye ekle
    let historyComment = comment || 'Onaylandı';
    if (assignmentApproved === true) {
      historyComment = (comment ? comment + ' - ' : '') + 'Görevlendirme onaylandı';
    }
    if (sendCustomerNotification) {
      historyComment += ' (Müşteri bilgilendirildi)';
    }

    request.workflow.history.push({
      action: 'approved',
      step: currentStep,
      by: approverId,
      role: 'customerRelations',
      timestamp: new Date().toISOString(),
      comment: historyComment
    });

    // Bir sonraki adıma geç
    if (stepIndex < request.workflow.steps.length - 1) {
      // Daha adım var (İK adımı)
      request.workflow.steps[stepIndex + 1].status = 'pending';
      request.workflow.currentStep = request.workflow.steps[stepIndex + 1].step;
      request.status = this.getStatusByStep(request.workflow.currentStep, 'approved');

      // Bildirim gönder
      NotificationEngine.sendApprovalNotification(request, 'next_approver');
    } else {
      // Son adım - talep tamamen onaylandı
      request.status = this.statuses.HR_APPROVED;
      request.workflow.currentStep = 'completed';

      // Kullanıcıya bildirim
      NotificationEngine.sendApprovalNotification(request, 'requester', 'approved');
    }

    this.saveRequest(request);
    return true;
  },

  // Müşteri İlişkileri reddetme işlemi
  rejectCustomerRelationsRequest(requestId, rejecterId, reason, assignmentApproved = false) {
    if (!reason || reason.trim() === '') {
      App.showNotification('Reddetme nedeni zorunludur!', 'error');
      return false;
    }

    const request = this.getRequest(requestId);
    if (!request) return false;

    const currentStep = request.workflow.currentStep;

    if (currentStep !== 'customerRelations') {
      App.showNotification('Bu talep Müşteri İlişkileri adımında değil!', 'error');
      return false;
    }

    // Mevcut adımı reddet
    const stepIndex = request.workflow.steps.findIndex(s => s.step === currentStep);
    if (stepIndex >= 0) {
      request.workflow.steps[stepIndex].status = 'rejected';
      request.workflow.steps[stepIndex].rejectedBy = rejecterId;
      request.workflow.steps[stepIndex].rejectedAt = new Date().toISOString();
      request.workflow.steps[stepIndex].assignmentApproved = assignmentApproved;
    }

    // History'ye ekle
    request.workflow.history.push({
      action: 'rejected',
      step: currentStep,
      by: rejecterId,
      role: 'customerRelations',
      timestamp: new Date().toISOString(),
      comment: 'Görevlendirme reddedildi - ' + reason
    });

    // Talebi reddet ve bitir
    request.status = this.statuses.CUSTOMER_RELATIONS_REJECTED;
    request.workflow.currentStep = 'rejected';

    // Kullanıcıya bildirim
    NotificationEngine.sendApprovalNotification(request, 'requester', 'rejected', reason);

    this.saveRequest(request);
    return true;
  },

  // Reddetme işlemi
  rejectRequest(requestId, rejecterId, rejecterRole, reason) {
    if (!reason || reason.trim() === '') {
      App.showNotification('Reddetme nedeni zorunludur!', 'error');
      return false;
    }

    const request = this.getRequest(requestId);
    if (!request) return false;

    const currentStep = request.workflow.currentStep;

    // Mevcut adımı reddet
    const stepIndex = request.workflow.steps.findIndex(s => s.step === currentStep);
    if (stepIndex >= 0) {
      request.workflow.steps[stepIndex].status = 'rejected';
      request.workflow.steps[stepIndex].rejectedBy = rejecterId;
      request.workflow.steps[stepIndex].rejectedAt = new Date().toISOString();
    }

    // History'ye ekle
    request.workflow.history.push({
      action: 'rejected',
      step: currentStep,
      by: rejecterId,
      role: rejecterRole,
      timestamp: new Date().toISOString(),
      comment: reason
    });

    // Talebi reddet ve bitir
    request.status = this.getStatusByStep(currentStep, 'rejected');
    request.workflow.currentStep = 'rejected';

    // Kullanıcıya bildirim
    NotificationEngine.sendApprovalNotification(request, 'requester', 'rejected', reason);

    this.saveRequest(request);
    return true;
  },

  // Revize işlemi
  reviseRequest(requestId, reviserId, reviserRole, revisionNote) {
    if (!revisionNote || revisionNote.trim() === '') {
      App.showNotification('Revize açıklaması zorunludur!', 'error');
      return false;
    }

    const request = this.getRequest(requestId);
    if (!request) return false;

    const currentStep = request.workflow.currentStep;

    // Mevcut adımı revize olarak işaretle
    const stepIndex = request.workflow.steps.findIndex(s => s.step === currentStep);
    if (stepIndex >= 0) {
      request.workflow.steps[stepIndex].status = 'revised';
      request.workflow.steps[stepIndex].revisedBy = reviserId;
      request.workflow.steps[stepIndex].revisedAt = new Date().toISOString();
    }

    // History'ye ekle
    request.workflow.history.push({
      action: 'revised',
      step: currentStep,
      by: reviserId,
      role: reviserRole,
      timestamp: new Date().toISOString(),
      comment: revisionNote
    });

    // Talebi revize durumuna al
    request.status = this.statuses.REVISED;
    request.revisionNote = revisionNote;
    request.revisedBy = reviserId;
    request.revisedAt = new Date().toISOString();

    // Kullanıcıya bildirim
    NotificationEngine.sendApprovalNotification(request, 'requester', 'revised', revisionNote);

    this.saveRequest(request);
    return true;
  },

  // Step'e göre status belirle
  getStatusByStep(step, action) {
    const statusMap = {
      'manager': {
        'approved': this.statuses.MANAGER_APPROVED,
        'rejected': this.statuses.MANAGER_REJECTED
      },
      'customerRelations': {
        'approved': this.statuses.CUSTOMER_RELATIONS_APPROVED,
        'rejected': this.statuses.CUSTOMER_RELATIONS_REJECTED
      },
      'hr': {
        'approved': this.statuses.HR_APPROVED,
        'rejected': this.statuses.HR_REJECTED
      }
    };

    return statusMap[step]?.[action] || this.statuses.PENDING;
  },

  // Talebi getir
  getRequest(requestId) {
    const allRequests = this.getAllRequests();
    return allRequests.find(r => r.id === requestId);
  },

  // Tüm talepleri getir
  getAllRequests() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const allRequests = [];

    console.log('📋 WorkflowEngine.getAllRequests() çağrıldı');
    console.log('   Kullanıcı sayısı:', users.length);

    users.forEach(user => {
      const userData = JSON.parse(localStorage.getItem(`userData_${user.id}`) || '{}');
      if (userData.leaveRequests && Array.isArray(userData.leaveRequests)) {
        console.log(`   ${user.id} (${user.name}): ${userData.leaveRequests.length} talep`);
        userData.leaveRequests.forEach(req => {
          allRequests.push({
            ...req,
            _ownerId: user.id // Internal tracking
          });
        });
      }
    });

    console.log('   Toplam talep sayısı:', allRequests.length);
    return allRequests;
  },

  // Talebi kaydet
  saveRequest(request) {
    const userId = request._ownerId || request.userId;
    const userData = JSON.parse(localStorage.getItem(`userData_${userId}`) || '{}');

    if (!userData.leaveRequests) {
      userData.leaveRequests = [];
    }

    const index = userData.leaveRequests.findIndex(r => r.id === request.id);
    if (index >= 0) {
      userData.leaveRequests[index] = request;
    } else {
      userData.leaveRequests.push(request);
    }

    localStorage.setItem(`userData_${userId}`, JSON.stringify(userData));
    console.log(`💾 saveRequest: ${userId} için ${request.id} kaydedildi (Toplam: ${userData.leaveRequests.length} talep)`);
  },

  // Rol için bekleyen talepleri getir
  getPendingRequestsForRole(role) {
    const allRequests = this.getAllRequests();

    const filtered = allRequests.filter(request => {
      if (!request.workflow) return false;

      const currentStepObj = request.workflow.steps.find(s => s.step === request.workflow.currentStep);
      if (!currentStepObj || currentStepObj.status !== 'pending') return false;

      // Müşteri İlişkileri rolü sadece customerRelations adımındaki talepleri görür
      if (role === 'customerRelations') {
        const isCustomerRelationsStep = currentStepObj.role === 'customerRelations';
        if (isCustomerRelationsStep) {
          console.log('🔵 Müşteri İlişkileri talebi:', {
            id: request.id,
            user: request.userName,
            currentStep: request.workflow.currentStep,
            requiresAssignment: currentStepObj.requiresAssignment,
            noServiceGap: request.noServiceGap
          });
        }
        return isCustomerRelationsStep;
      }

      // İnsan Kaynakları rolü tüm rollerin adımlarındaki talepleri görebilir
      if (role === 'hr') {
        return currentStepObj.role === 'hr' || currentStepObj.role === 'manager' || currentStepObj.role === 'customerRelations';
      }

      return currentStepObj.role === role;
    });

    console.log(`📊 ${role} rolü için ${filtered.length} talep filtrelendi`);
    return filtered;
  }
};

/*
=================================================
NOTIFICATION ENGINE - BİLDİRİM SİSTEMİ
=================================================
*/

const NotificationEngine = {

  // Simüle edilmiş e-posta gönderimi
  sendEmail(to, subject, body) {
    console.log('📧 E-POSTA GÖNDERİLDİ:');
    console.log('Kime:', to);
    console.log('Konu:', subject);
    console.log('İçerik:', body);
    console.log('---');

    // Production'da burası gerçek SMTP servisi olacak
    // Örnek: axios.post('/api/send-email', { to, subject, body })
  },

  // Talep oluşturulduğunda
  sendRequestCreated(request) {
    const isFieldWorker = request.workflow.isFieldWorker;

    // Yöneticiye bildirim
    const managerEmail = this.getManagerEmail(request.userId);
    this.sendEmail(
      managerEmail,
      'Yeni İzin Talebi',
      `${request.userName} (${request.userDepartment}) yeni bir izin talebi oluşturdu.\n\n` +
      `İzin Tipi: ${this.getLeaveTypeName(request.type)}\n` +
      `Tarih: ${request.startDate} - ${request.endDate}\n` +
      `Süre: ${request.days}\n\n` +
      `Lütfen sisteme giriş yaparak talebi değerlendirin.`
    );

    // Saha çalışanı ise proje liderine de bildirim
    if (isFieldWorker && request.projectLeader) {
      this.sendEmail(
        request.projectLeader + '@tezmedical.com',
        'Bilgilendirme: Saha Personeli İzin Talebi',
        `${request.userName} izin talebi oluşturdu.\n\n` +
        `Proje: ${request.projectLocation}\n` +
        `Tarih: ${request.startDate} - ${request.endDate}\n\n` +
        `Bu bilgilendirme amaçlıdır, aksiyon almanız gerekmemektedir.`
      );
    }
  },

  // Onay/Red/Revize sonrası bildirimler
  sendApprovalNotification(request, target, action, comment = '') {
    if (target === 'requester') {
      // Talep sahibine bildirim
      const userEmail = this.getUserEmail(request.userId);
      let subject = '';
      let body = '';

      switch(action) {
        case 'approved':
          subject = '✅ İzin Talebiniz Onaylandı';
          body = `İzin talebiniz onaylandı!\n\n` +
            `İzin Tipi: ${this.getLeaveTypeName(request.type)}\n` +
            `Tarih: ${request.startDate} - ${request.endDate}\n` +
            `Süre: ${request.days}\n\n` +
            `İyi tatiller dileriz!`;
          break;
        case 'rejected':
          subject = '❌ İzin Talebiniz Reddedildi';
          body = `İzin talebiniz reddedildi.\n\n` +
            `İzin Tipi: ${this.getLeaveTypeName(request.type)}\n` +
            `Tarih: ${request.startDate} - ${request.endDate}\n\n` +
            `Red Nedeni: ${comment}\n\n` +
            `Daha fazla bilgi için yöneticiniz ile görüşebilirsiniz.`;
          break;
        case 'revised':
          subject = '🔄 İzin Talebiniz Revize Edilmeli';
          body = `İzin talebiniz revize edilmesi için geri gönderildi.\n\n` +
            `İzin Tipi: ${this.getLeaveTypeName(request.type)}\n` +
            `Tarih: ${request.startDate} - ${request.endDate}\n\n` +
            `Revize Notu: ${comment}\n\n` +
            `Lütfen talebi güncelleyip tekrar gönderin.`;
          break;
      }

      this.sendEmail(userEmail, subject, body);
    } else if (target === 'next_approver') {
      // Sıradaki onaylayıcıya bildirim
      const nextStep = request.workflow.steps.find(s => s.status === 'pending');
      if (nextStep) {
        const approverEmail = this.getApproverEmail(nextStep.role, request);
        this.sendEmail(
          approverEmail,
          'Onayınız Beklenen İzin Talebi',
          `${request.userName} (${request.userDepartment}) tarafından oluşturulan izin talebi onayınızı bekliyor.\n\n` +
          `İzin Tipi: ${this.getLeaveTypeName(request.type)}\n` +
          `Tarih: ${request.startDate} - ${request.endDate}\n` +
          `Süre: ${request.days}\n\n` +
          `Lütfen sisteme giriş yaparak talebi değerlendirin.`
        );
      }
    }

    // Saha çalışanı ve müşteri bildirimi gerekiyorsa
    if (request.workflow.isFieldWorker && request.notifyMIL && action === 'approved') {
      const oneWeekAhead = new Date();
      oneWeekAhead.setDate(oneWeekAhead.getDate() + 7);
      const leaveDate = new Date(request.startDate);

      if (leaveDate > oneWeekAhead) {
        // 1 hafta önceden bildirilmiş, müşteriden onay gerekli
        this.sendEmail(
          'customerservice@tezmedical.com',
          'Müşteri Onayı Gerekli: Saha Personeli İzin Talebi',
          `${request.userName} (${request.projectLocation}) izin talebi müşteri onayı bekliyor.\n\n` +
          `Tarih: ${request.startDate} - ${request.endDate}\n\n` +
          `Lütfen müşteri ile görüşüp onay alın.`
        );
      } else {
        // Sadece bilgilendirme
        this.sendEmail(
          'customerservice@tezmedical.com',
          'Bilgilendirme: Saha Personeli İzin',
          `${request.userName} (${request.projectLocation}) izin kullanacak.\n\n` +
          `Tarih: ${request.startDate} - ${request.endDate}\n\n` +
          `Bu bilgilendirme amaçlıdır.`
        );
      }
    }
  },

  // Helper: İzin tipi adı
  getLeaveTypeName(type) {
    const types = {
      'annual': 'Yıllık İzin',
      'marriage': 'Evlilik İzni',
      'birth': 'Doğum İzni',
      'death': 'Ölüm İzni',
      'excuse': 'Mazeret İzni',
      'paternity': 'Babalık İzni',
      'unpaid': 'Ücretsiz İzin',
      'advance': 'Avans İzin',
      'education': 'Eğitim İzni',
      'sickness': 'Hastalık İzni',
      'adoption': 'Evlat Edinme İzni'
    };
    return types[type] || type;
  },

  // Helper: Kullanıcı email
  getUserEmail(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'unknown@tezmedical.com';
  },

  // Helper: Yönetici email
  getManagerEmail(userId) {
    // Production'da burası user.managerId ile yönetici bulacak
    return 'manager@tezmedical.com';
  },

  // Helper: Onaylayıcı email
  getApproverEmail(role, request) {
    const emails = {
      'manager': 'manager@tezmedical.com',
      'customerRelations': 'musteriiliskileri@tezmedical.com',
      'hr': 'ik@tezmedical.com'
    };
    return emails[role] || 'admin@tezmedical.com';
  }
};

/*
=================================================
DELEGATION ENGINE - VEKALET SİSTEMİ
=================================================
*/

const DelegationEngine = {

  // Vekalet oluştur
  createDelegation(fromUserId, toUserId, startDate, endDate, reason) {
    const delegation = {
      id: 'del_' + Date.now(),
      fromUserId,
      toUserId,
      startDate,
      endDate,
      reason,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Vekalet listesine ekle
    const delegations = JSON.parse(localStorage.getItem('delegations') || '[]');
    delegations.push(delegation);
    localStorage.setItem('delegations', JSON.stringify(delegations));

    console.log('✅ Vekalet oluşturuldu:', delegation);
    return delegation;
  },

  // Aktif vekalet var mı kontrol et
  getActiveDelegation(userId) {
    const delegations = JSON.parse(localStorage.getItem('delegations') || '[]');
    const now = new Date();

    return delegations.find(d => {
      if (!d.isActive || d.fromUserId !== userId) return false;

      const start = new Date(d.startDate);
      const end = new Date(d.endDate);

      return now >= start && now <= end;
    });
  },

  // Vekaleten onay yetkisi var mı
  hasApprovalAuthority(userId, originalApproverId) {
    const delegation = this.getActiveDelegation(originalApproverId);
    return delegation && delegation.toUserId === userId;
  },

  // Tüm vekaletleri getir
  getAllDelegations() {
    return JSON.parse(localStorage.getItem('delegations') || '[]');
  },

  // Vekaleti iptal et
  cancelDelegation(delegationId) {
    const delegations = JSON.parse(localStorage.getItem('delegations') || '[]');
    const index = delegations.findIndex(d => d.id === delegationId);

    if (index >= 0) {
      delegations[index].isActive = false;
      delegations[index].cancelledAt = new Date().toISOString();
      localStorage.setItem('delegations', JSON.stringify(delegations));
      return true;
    }

    return false;
  }
};

// Animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.7);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes scaleOut {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(0.7);
      opacity: 0;
    }
  }

  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    to {
      transform: translateX(-50%) translateY(-100px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}