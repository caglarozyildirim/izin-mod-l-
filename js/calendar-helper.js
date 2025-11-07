// Tez Medikal İzin Yönetimi - Takvim Yardımcı Fonksiyonları
// 2025-2026 Türkiye Resmi Tatilleri

const publicHolidays2025_2026 = [
    // 2025 Tatilleri
    '2025-01-01', // Yılbaşı
    '2025-03-30', // Ramazan Bayramı 1. Gün
    '2025-03-31', // Ramazan Bayramı 2. Gün
    '2025-04-01', // Ramazan Bayramı 3. Gün
    '2025-04-23', // Ulusal Egemenlik ve Çocuk Bayramı
    '2025-05-01', // Emek ve Dayanışma Günü
    '2025-05-19', // Atatürk'ü Anma, Gençlik ve Spor Bayramı
    '2025-06-07', // Kurban Bayramı 1. Gün
    '2025-06-08', // Kurban Bayramı 2. Gün
    '2025-06-09', // Kurban Bayramı 3. Gün
    '2025-06-10', // Kurban Bayramı 4. Gün
    '2025-08-30', // Zafer Bayramı
    '2025-10-28', // Cumhuriyet Bayramı Arifesi
    '2025-10-29', // Cumhuriyet Bayramı

    // 2026 Tatilleri
    '2026-01-01', // Yılbaşı
    '2026-03-20', // Ramazan Bayramı 1. Gün
    '2026-03-21', // Ramazan Bayramı 2. Gün
    '2026-03-22', // Ramazan Bayramı 3. Gün
    '2026-04-23', // Ulusal Egemenlik ve Çocuk Bayramı
    '2026-05-01', // Emek ve Dayanışma Günü
    '2026-05-19', // Atatürk'ü Anma, Gençlik ve Spor Bayramı
    '2026-05-27', // Kurban Bayramı 1. Gün
    '2026-05-28', // Kurban Bayramı 2. Gün
    '2026-05-29', // Kurban Bayramı 3. Gün
    '2026-05-30', // Kurban Bayramı 4. Gün
    '2026-08-30', // Zafer Bayramı
    '2026-10-28', // Cumhuriyet Bayramı Arifesi
    '2026-10-29'  // Cumhuriyet Bayramı
];

// Tarih string'i resmi tatil mi kontrol et
function isPublicHoliday(dateStr) {
    return publicHolidays2025_2026.includes(dateStr);
}

// Tarih hafta sonu mu kontrol et (Cumartesi=6, Pazar=0)
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

// İş günü mü kontrol et
function isWorkingDay(date) {
    const dateStr = formatDateToYYYYMMDD(date);
    return !isWeekend(date) && !isPublicHoliday(dateStr);
}

// Tarih formatla: YYYY-MM-DD
function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// İki tarih arası iş günü sayısını hesapla (başlangıç ve bitiş dahil)
function calculateWorkingDays(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        if (isWorkingDay(current)) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }

    return count;
}

// Flatpickr için özel onDayCreate fonksiyonu
function onDayCreateHandler(dObj, dStr, fp, dayElem) {
    const date = dayElem.dateObj;
    const dateStr = formatDateToYYYYMMDD(date);

    // Resmi tatilleri kırmızı yap
    if (isPublicHoliday(dateStr)) {
        dayElem.style.color = '#dc2626';
        dayElem.style.fontWeight = 'bold';
        dayElem.style.background = '#fee2e2';
        dayElem.title = 'Resmi Tatil';
    }

    // Hafta sonlarını gri yap
    if (isWeekend(date)) {
        dayElem.style.color = '#9ca3af';
        dayElem.style.background = '#f3f4f6';
    }
}

// Flatpickr için ortak config
function getFlatpickrConfig(options = {}) {
    return {
        locale: 'tr',
        dateFormat: 'd.m.Y',
        altInput: true,
        altFormat: 'd.m.Y',
        allowInput: true,
        onDayCreate: onDayCreateHandler,
        ...options
    };
}

// Flatpickr için range config
function getFlatpickrRangeConfig(options = {}) {
    return {
        ...getFlatpickrConfig(),
        mode: 'range',
        ...options
    };
}