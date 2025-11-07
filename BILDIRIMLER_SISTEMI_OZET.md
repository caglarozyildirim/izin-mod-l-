# TEZ MEDİKAL - İZİN YÖNETİM SİSTEMİ
## BİLDİRİMLER SİSTEMİ ÖZETİ

**Versiyon:** 1.0
**Tarih:** 06 Kasım 2025
**Durum:** Sistem Tasarım Dokümanı

---

## 📋 İÇİNDEKİLER

1. [Genel Bakış](#genel-bakış)
2. [Bildirim Türleri](#bildirim-türleri)
3. [Bildirim Tetikleyicileri](#bildirim-tetikleyicileri)
4. [Bildirim Kanalları](#bildirim-kanalları)
5. [Rol Bazlı Bildirimler](#rol-bazlı-bildirimler)
6. [Bildirim Şablonları](#bildirim-şablonları)
7. [Teknik Altyapı](#teknik-altyapı)
8. [Kullanıcı Tercihleri](#kullanıcı-tercihleri)

---

## 🎯 GENEL BAKIŞ

TEZ MEDİKAL İzin Yönetim Sistemi'nde bildirimler, kullanıcıları izin talebi süreçlerinin her aşamasında bilgilendiren kritik bir bileşendir. Sistem, çok kanallı bildirim stratejisi ile gerçek zamanlı iletişim sağlar.

### Bildirim Sistemi Amaçları

- ✅ **Şeffaflık:** Çalışanlar izin taleplerinin durumunu anlık takip edebilir
- ⚡ **Hız:** Yöneticiler bekleyen onaylardan hemen haberdar olur
- 🔔 **Hatırlatma:** Kritik işlemler için otomatik hatırlatıcılar
- 📊 **Raporlama:** Yöneticilere departman izin durumu özeti
- 🤝 **İşbirliği:** Operasyon ekibi yerine görevlendirme bildirimleri

---

## 📬 BİLDİRİM TÜRLERİ

### 1. İzin Talebi Bildirimleri

#### 1.1 Talep Oluşturuldu
- **Tetikleyici:** Personel yeni izin talebi oluşturduğunda
- **Alıcılar:**
  - Personel (onay)
  - Direkt yönetici
  - İnsan Kaynakları departmanı
  - Operasyon ekibi (saha çalışanları için)
- **Kanal:** E-posta, SMS (tercihe bağlı), In-App
- **Öncelik:** Normal

**Örnek Mesaj (Personel):**
```
Sayın Ahmet Yılmaz,

İzin talebiniz başarıyla oluşturuldu ve onay sürecine alındı.

İzin Türü: Yıllık İzin
Tarih: 10.12.2025 - 15.12.2025
Süre: 6 gün
Talep No: REQ_20251106001

Talebinizin durumunu sisteminizden takip edebilirsiniz.

Tez Medikal İzin Yönetim Sistemi
```

#### 1.2 Talep Onaylandı
- **Tetikleyici:** Yönetici/İK talebi onayladığında
- **Alıcılar:**
  - Personel
  - İK (izin bakiyesi güncellemesi için)
  - Operasyon (yerine görevlendirme gerekiyorsa)
- **Kanal:** E-posta, SMS, Push, In-App
- **Öncelik:** Yüksek

**Örnek Mesaj:**
```
Sayın Ahmet Yılmaz,

İzin talebiniz ONAYLANDI! ✅

İzin Türü: Yıllık İzin
Tarih: 10.12.2025 - 15.12.2025
Onaylayan: Mehmet Demir (İnsan Kaynakları)
Onay Tarihi: 06.11.2025 14:30

Yeni İzin Bakiyeniz: 9 gün

İyi tatiller dileriz!

Tez Medikal İzin Yönetim Sistemi
```

#### 1.3 Talep Reddedildi
- **Tetikleyici:** Yönetici/İK talebi reddettiğinde
- **Alıcılar:** Personel
- **Kanal:** E-posta, SMS, In-App
- **Öncelik:** Yüksek

**Örnek Mesaj:**
```
Sayın Ahmet Yılmaz,

İzin talebiniz reddedildi.

İzin Türü: Yıllık İzin
Talep Tarihi: 10.12.2025 - 15.12.2025
Red Nedeni: İlgili tarihlerde departman içinde yüksek iş yoğunluğu
beklenmektedir. Alternatif tarih önerisi: 20.12.2025

Farklı tarihler için yeni talep oluşturabilirsiniz.

Tez Medikal İzin Yönetim Sistemi
```

#### 1.4 Revizyon Talebi
- **Tetikleyici:** Yönetici/İK revizyona gönderse
- **Alıcılar:** Personel
- **Kanal:** E-posta, In-App
- **Öncelik:** Orta

**Örnek Mesaj:**
```
Sayın Ahmet Yılmaz,

İzin talebiniz için revizyon talep edildi.

Revizyon Nedeni: Lütfen saha lokasyon bilgisini detaylandırınız

İzin Detayları:
- Tarih: 10.12.2025 - 15.12.2025
- Tür: Yıllık İzin

Lütfen talebinizi güncelleyerek tekrar gönderin.

Tez Medikal İzin Yönetim Sistemi
```

### 2. Onay Süreci Bildirimleri

#### 2.1 Onay Bekleyen Talepler
- **Tetikleyici:** Yöneticinin onayına düşen talep
- **Alıcılar:** İlgili yönetici/İK personeli
- **Kanal:** E-posta, In-App
- **Öncelik:** Normal
- **Frekans:** Anlık + Günlük özet

**Örnek Mesaj:**
```
Sayın Mehmet Demir,

Yeni izin talebi onayınızı bekliyor.

Personel: Ahmet Yılmaz (Sicil: 12345)
Departman: Üretim
İzin Türü: Yıllık İzin
Tarih: 10.12.2025 - 15.12.2025 (6 gün)
Talep Tarihi: 06.11.2025

Toplam Bekleyen: 3 talep

[Onayla] [Reddet] [Detay]

Tez Medikal İzin Yönetim Sistemi
```

#### 2.2 Onay Hatırlatıcısı
- **Tetikleyici:** 48 saat onay bekleyen talepler
- **Alıcılar:** İlgili yönetici
- **Kanal:** E-posta
- **Öncelik:** Orta
- **Frekans:** Günlük (sadece 1 hatırlatma)

### 3. Operasyon Bildirimleri

#### 3.1 Yerine Görevlendirme Gerekli
- **Tetikleyici:** Saha çalışanının izni onaylandığında
- **Alıcılar:** Operasyon ekibi
- **Kanal:** E-posta, SMS, In-App
- **Öncelik:** Yüksek

**Örnek Mesaj:**
```
Operasyon Ekibi,

Saha çalışanı izin onayı - Yerine görevlendirme gerekli!

Personel: Ahmet Yılmaz
Proje: İstanbul Fabrika A
Proje Sorumlusu: Ali Demir
İzin Dönemi: 10.12.2025 - 15.12.2025
Lokasyon: İstanbul - Anadolu Yakası

Müşteri Bildirimİ: MİL'e bildirim gönderilmeli

Lütfen yerine görevlendirme işlemini tamamlayın.

[Yerine Görevlendir]

Tez Medikal İzin Yönetim Sistemi
```

#### 3.2 Yerine Görevlendirme Tamamlandı
- **Tetikleyici:** Operasyon ekibi ataması tamamladığında
- **Alıcılar:**
  - İzin alan personel
  - Proje sorumlusu
  - İK
- **Kanal:** E-posta, SMS
- **Öncelik:** Normal

#### 3.3 MİL Bilgilendirme
- **Tetikleyici:** "MİL bilgilendirilsin" işaretlenmiş izin onaylandığında
- **Alıcılar:** Müşteri İlişkileri departmanı
- **Kanal:** E-posta
- **Öncelik:** Yüksek

**Örnek Mesaj:**
```
Müşteri İlişkileri Departmanı,

Saha personeli izin bilgilendirmesi:

Personel: Ahmet Yılmaz
Müşteri/Proje: ABC Hastanesi - Medikal Cihaz Bakımı
İzin Dönemi: 10.12.2025 - 15.12.2025
Yerine Görevlendirilen: Hasan Kaya

Müşteriyi bilgilendirmeniz gerekmektedir.

Tez Medikal İzin Yönetim Sistemi
```

### 4. İzin Kullanımı Bildirimleri

#### 4.1 İzin Başlangıç Hatırlatması
- **Tetikleyici:** İzin başlangıcından 1 gün önce
- **Alıcılar:** İzin alan personel, yönetici
- **Kanal:** E-posta, SMS
- **Öncelik:** Normal

**Örnek Mesaj:**
```
Sayın Ahmet Yılmaz,

İzniniz yarın başlıyor!

İzin Dönemi: 10.12.2025 - 15.12.2025
İş Başı Tarihi: 16.12.2025

İyi tatiller dileriz!

Tez Medikal İzin Yönetim Sistemi
```

#### 4.2 İzin Kullanım Onayı
- **Tetikleyici:** İzin döneminden sonra personel "İzni Kullandım" işaretlediğinde
- **Alıcılar:** İK (bakiye güncellemesi için)
- **Kanal:** In-App, E-posta
- **Öncelik:** Düşük

#### 4.3 İzin Kullanım Hatırlatması
- **Tetikleyici:** İzin dönüşü 3 gün sonra hala kullanım onayı verilmediyse
- **Alıcılar:** İzin alan personel
- **Kanal:** E-posta, In-App
- **Öncelik:** Normal

### 5. Sistem Bildirimleri

#### 5.1 İzin Bakiyesi Güncellemesi
- **Tetikleyici:** Yeni yıl/hak ediş dönemi
- **Alıcılar:** Tüm personel
- **Kanal:** E-posta, In-App
- **Öncelik:** Normal
- **Frekans:** Yıllık

#### 5.2 İzin Bakiyesi Uyarısı
- **Tetikleyici:** Kalan izin 5 günün altına düştüğünde
- **Alıcılar:** İlgili personel
- **Kanal:** In-App
- **Öncelik:** Düşük

#### 5.3 Kullanılmayan İzin Uyarısı
- **Tetikleyici:** Yıl sonu yaklaşırken kullanılmayan izin varsa
- **Alıcılar:** İlgili personel, yönetici
- **Kanal:** E-posta
- **Öncelik:** Orta
- **Frekans:** Ekim-Kasım-Aralık aylarında aylık

**Örnek Mesaj:**
```
Sayın Ahmet Yılmaz,

İzin Kullanım Uyarısı

Mevcut yıl izin bakiyeniz: 12 gün
Yıl sonu: 31.12.2025 (56 gün kaldı)

Kullanılmayan izinlerinizi kaybetmemek için lütfen planlamanızı yapın.

Tez Medikal İzin Yönetim Sistemi
```

### 6. Raporlama Bildirimleri

#### 6.1 Haftalık İzin Raporu (Yöneticiler)
- **Tetikleyici:** Her pazartesi sabah 09:00
- **Alıcılar:** Departman yöneticileri
- **Kanal:** E-posta
- **Öncelik:** Düşük

**Örnek İçerik:**
```
Haftalık İzin Raporu - Üretim Departmanı
07.11.2025 - 13.11.2025

📊 Özet:
- İzinde olan personel: 3
- Bekleyen talepler: 2
- Bu hafta başlayan izinler: 1
- Bu hafta biten izinler: 2

👥 İzindeki Personeller:
- Ahmet Yılmaz (10.11 - 15.11)
- Mehmet Kaya (07.11 - 09.11)
- Ayşe Demir (11.11 - 12.11)

⏳ Bekleyen Talepler:
- Hasan Çelik - Yıllık İzin (01.12 - 05.12)
- Fatma Öz - Mazeret İzni (08.11)

[Detaylı Rapor]

Tez Medikal İzin Yönetim Sistemi
```

#### 6.2 Aylık İzin İstatistiği (İK)
- **Tetikleyici:** Her ayın ilk iş günü
- **Alıcılar:** İK departmanı, üst yönetim
- **Kanal:** E-posta (PDF eki)
- **Öncelik:** Normal

---

## 🔔 BİLDİRİM TETİKLEYİCİLERİ

### Otomatik Tetikleyiciler

| Olay | Tetiklenme Zamanı | İlgili Bildirim |
|------|-------------------|-----------------|
| Yeni talep oluşturuldu | Anlık | Talep Oluşturuldu |
| Talep onaylandı | Anlık | Talep Onaylandı |
| Talep reddedildi | Anlık | Talep Reddedildi |
| Revizyon istendi | Anlık | Revizyon Talebi |
| Onay bekliyor | 48 saat sonra | Onay Hatırlatıcısı |
| İzin başlangıcı | 1 gün önce | İzin Başlangıç Hatırlatması |
| İzin bitişi | İzin dönüşü +3 gün | İzin Kullanım Hatırlatması |
| Yıl dönümü | 1 Ocak 09:00 | İzin Bakiyesi Güncellemesi |
| İzin bakiyesi düşük | Bakiye ≤5 gün | İzin Bakiyesi Uyarısı |
| Kullanılmayan izin | Ekim/Kasım/Aralık | Kullanılmayan İzin Uyarısı |
| Haftalık rapor | Her pazartesi 09:00 | Haftalık İzin Raporu |
| Aylık rapor | Ayın ilk iş günü | Aylık İzin İstatistiği |

### Manuel Tetikleyiciler

- Yönetici/İK onay/red aksiyonu
- Operasyon ekibi yerine görevlendirme
- Personel izin kullanım onayı

---

## 📡 BİLDİRİM KANALLARI

### 1. E-posta Bildirimleri

**Avantajlar:**
- Detaylı bilgi paylaşımı
- PDF/Excel ek dosya desteği
- Kalıcı kayıt
- Resmi iletişim kanalı

**Kullanım Alanları:**
- Tüm önemli bildirimler
- Raporlar ve istatistikler
- Detaylı onay/red açıklamaları

**Teknik Gereksinimler:**
```javascript
// SMTP Configuration
{
  host: 'smtp.tezmedical.com',
  port: 587,
  secure: false,
  auth: {
    user: 'noreply@tezmedical.com',
    pass: '***'
  },
  from: 'Tez Medikal İzin Sistemi <noreply@tezmedical.com>'
}
```

### 2. SMS Bildirimleri

**Avantajlar:**
- Anlık erişim
- Yüksek görüntülenme oranı
- İnternet bağlantısı gerektirmez

**Kullanım Alanları:**
- Kritik onay/red bildirimleri
- Acil operasyon bildirimleri
- İzin başlangıç hatırlatmaları

**Karakter Limiti:** 160 karakter (GSM) / 70 karakter (Unicode)

**Örnek SMS:**
```
TEZ MEDIKAL: Izin talebiniz ONAYLANDI.
10-15 Aralik, 6 gun.
Yeni bakiye: 9 gun.
Detay: izin.tezmedical.com
```

**Teknik Gereksinimler:**
- SMS Gateway API entegrasyonu
- Türkçe karakter desteği
- Toplu gönderim yönetimi

### 3. In-App (Uygulama İçi) Bildirimler

**Avantajlar:**
- Gerçek zamanlı
- Etkileşimli (butonsuz aksiyon)
- Bildirim geçmişi
- Okundu/okunmadı takibi

**Kullanım Alanları:**
- Tüm sistem bildirimleri
- Bekleyen işlemler
- Hızlı aksiyonlar

**Bildirim Türleri:**
- 🔔 Badge (sayı göstergesi)
- 📢 Toast (geçici mesaj)
- 💬 Notification Center (kalıcı liste)

**Teknik Gereksinimler:**
```javascript
// Notification Model
{
  id: 'notif_123',
  userId: 'user_123',
  type: 'leave_approved',
  title: 'İzin Talebiniz Onaylandı',
  message: 'Yıllık izin talebiniz onaylandı...',
  icon: 'check-circle',
  color: 'success',
  actionUrl: '/izinlerim/REQ_001',
  read: false,
  createdAt: '2025-11-06T14:30:00Z'
}
```

### 4. Push Bildirimleri (Web/Mobile)

**Avantajlar:**
- Uygulama kapalıyken erişim
- Sistem tepsisi entegrasyonu
- Mobil cihaz desteği

**Kullanım Alanları:**
- Kritik bildirimler
- Onay gerektiren işlemler
- Acil hatırlatmalar

**Teknik Gereksinimler:**
- Web Push API (Service Worker)
- Firebase Cloud Messaging (Mobile)
- Kullanıcı izin yönetimi

---

## 👥 ROL BAZLI BİLDİRİMLER

### Personel (Employee)

**Aldığı Bildirimler:**
- ✅ Kendi talep durumu değişiklikleri
- ✅ İzin başlangıç/bitiş hatırlatmaları
- ✅ İzin bakiyesi güncellemeleri
- ✅ Kullanılmayan izin uyarıları
- ✅ Revizyon talepleri
- ✅ Yerine görevlendirme bilgileri (saha)

**Bildirim Ayarları:**
- E-posta: Zorunlu (devre dışı bırakılamaz)
- SMS: Tercihe bağlı
- In-App: Zorunlu
- Push: Tercihe bağlı

### Yönetici / İnsan Kaynakları (Manager/HR)

**Aldığı Bildirimler:**
- ✅ Bekleyen onay talepleri
- ✅ Onay hatırlatıcıları
- ✅ Departman izin durumu raporları
- ✅ Haftalık/aylık istatistikler
- ✅ İzin bakiyesi güncellemeleri (tüm personel)
- ✅ Kritik sistem uyarıları

**Bildirim Ayarları:**
- E-posta: Zorunlu
- SMS: Kritik bildirimler için önerilen
- In-App: Zorunlu
- Push: Tercihe bağlı
- Haftalık özet: Tercihe bağlı

### Operasyon Ekibi (Operation)

**Aldığı Bildirimler:**
- ✅ Yerine görevlendirme talepleri
- ✅ Saha personeli izin onayları
- ✅ Proje/lokasyon bazlı bildirimler
- ✅ MİL bilgilendirme gereklilikleri
- ✅ Atama tamamlanma bildirimleri

**Bildirim Ayarları:**
- E-posta: Zorunlu
- SMS: Yüksek öncelikli için zorunlu
- In-App: Zorunlu
- Push: Önerilen

---

## 📝 BİLDİRİM ŞABLONLARI

### E-posta Şablon Yapısı

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .header { background: linear-gradient(135deg, #4B9F8E 0%, #3a8070 100%);
              color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .card { background: white; padding: 20px; border-radius: 8px;
            margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .button { background: #4B9F8E; color: white; padding: 12px 24px;
              text-decoration: none; border-radius: 6px; display: inline-block; }
    .footer { text-align: center; padding: 20px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="header">
    <h1>TEZ MEDİKAL</h1>
    <p>İzin Yönetim Sistemi</p>
  </div>

  <div class="content">
    <div class="card">
      <h2>{{title}}</h2>
      <p>{{greeting}},</p>
      <p>{{message}}</p>

      <table style="width: 100%; margin: 20px 0;">
        {{details}}
      </table>

      {{#if actionButton}}
      <p style="text-align: center; margin-top: 30px;">
        <a href="{{actionUrl}}" class="button">{{actionText}}</a>
      </p>
      {{/if}}
    </div>
  </div>

  <div class="footer">
    <p>Bu e-posta otomatik olarak gönderilmiştir.</p>
    <p>&copy; 2025 Tez Medikal A.Ş. Tüm hakları saklıdır.</p>
  </div>
</body>
</html>
```

### SMS Şablon Yapısı

```
TEZ MEDIKAL: {{messageType}}
{{shortMessage}}
{{#if actionRequired}}
Islem: {{actionUrl}}
{{/if}}
```

**Şablon Değişkenleri:**
```javascript
{
  messageType: 'IZIN ONAYI',
  shortMessage: '10-15 Aralik, 6 gun izin onaylandi.',
  actionRequired: false,
  actionUrl: 'izin.tezmedical.com/R001'
}
```

---

## 🛠️ TEKNİK ALTYAPI

### Bildirim Servisi Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                    İZİN YÖNETİM SİSTEMİ                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│               NOTIFICATION SERVICE (API)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Event       │  │  Template    │  │  Preference  │      │
│  │  Listener    │  │  Engine      │  │  Manager     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│   E-mail     │ │   SMS    │ │  In-App  │ │  Push        │
│   Gateway    │ │  Gateway │ │  Socket  │ │  Notif       │
└──────────────┘ └──────────┘ └──────────┘ └──────────────┘
```

### Bildirim Queue Sistemi

**Amaç:** Yüksek hacimli bildirimleri sıralı ve güvenilir şekilde işlemek

**Teknoloji:** Redis Queue / RabbitMQ / AWS SQS

**Öncelik Seviyeleri:**
- **Critical (1):** Anında işlenecek (onay/red bildirimleri)
- **High (2):** 5 dakika içinde (yerine görevlendirme)
- **Normal (3):** 15 dakika içinde (hatırlatmalar)
- **Low (4):** 1 saat içinde (raporlar)

**Queue Yapısı:**
```javascript
{
  notificationId: 'notif_20251106_001',
  priority: 1,
  type: 'email',
  template: 'leave_approved',
  recipient: {
    userId: 'user_123',
    email: 'ahmet.yilmaz@tezmedical.com',
    name: 'Ahmet Yılmaz'
  },
  data: {
    leaveType: 'Yıllık İzin',
    startDate: '10.12.2025',
    endDate: '15.12.2025',
    approver: 'Mehmet Demir'
  },
  retry: {
    attempts: 0,
    maxAttempts: 3,
    backoff: 'exponential'
  },
  createdAt: '2025-11-06T14:30:00Z',
  scheduledFor: '2025-11-06T14:30:00Z'
}
```

### Hata Yönetimi

**Retry Stratejisi:**
1. İlk deneme başarısız → 1 dakika sonra tekrar
2. İkinci deneme başarısız → 5 dakika sonra tekrar
3. Üçüncü deneme başarısız → Manuel müdahale için kaydet

**Logging:**
```javascript
{
  timestamp: '2025-11-06T14:30:00Z',
  level: 'error',
  service: 'notification',
  type: 'email',
  recipient: 'ahmet.yilmaz@tezmedical.com',
  error: 'SMTP connection timeout',
  retryCount: 2,
  notificationId: 'notif_20251106_001'
}
```

### API Endpoints

```
POST   /api/notifications/send
POST   /api/notifications/schedule
GET    /api/notifications/:userId
PUT    /api/notifications/:id/mark-read
GET    /api/notifications/:userId/preferences
PUT    /api/notifications/:userId/preferences
DELETE /api/notifications/:id
```

**Örnek İstek:**
```javascript
POST /api/notifications/send
{
  "userId": "user_123",
  "type": "leave_approved",
  "channels": ["email", "sms", "inapp"],
  "data": {
    "leaveId": "REQ_001",
    "employeeName": "Ahmet Yılmaz",
    "leaveType": "annual",
    "startDate": "2025-12-10",
    "endDate": "2025-12-15"
  },
  "priority": "high"
}
```

**Başarılı Yanıt:**
```javascript
{
  "success": true,
  "notificationId": "notif_20251106_001",
  "status": {
    "email": "sent",
    "sms": "sent",
    "inapp": "delivered"
  },
  "timestamp": "2025-11-06T14:30:00Z"
}
```

---

## ⚙️ KULLANICI TERCİHLERİ

### Tercih Yönetimi

Kullanıcılar profil.html sayfasından bildirim tercihlerini yönetebilir:

```javascript
{
  userId: 'user_123',
  preferences: {
    email: {
      enabled: true,
      types: {
        leaveApproved: true,
        leaveRejected: true,
        leaveReminder: true,
        weeklyReport: false  // Sadece yöneticiler için
      }
    },
    sms: {
      enabled: false,
      types: {
        leaveApproved: true,
        leaveRejected: true,
        criticalOnly: true
      }
    },
    inapp: {
      enabled: true,  // Devre dışı bırakılamaz
      playSound: true,
      showBadge: true
    },
    push: {
      enabled: true,
      types: {
        leaveApproved: true,
        pendingApprovals: true
      }
    },
    language: 'tr',
    timezone: 'Europe/Istanbul',
    workingHours: {
      enabled: true,
      start: '09:00',
      end: '18:00'
    }
  },
  updatedAt: '2025-11-06T14:30:00Z'
}
```

### Çalışma Saatleri Dışı Bildiriler

**Kural:** Kritik olmayan bildirimler çalışma saatleri dışında gönderilmez.

**Kritik Bildirimler (Her zaman gönderilir):**
- İzin onayı
- İzin reddi
- Acil operasyon bildirimleri

**Kritik Olmayan Bildirimler (Ertelenir):**
- Raporlar
- Hatırlatmalar
- İstatistikler

**Erteleme Mantığı:**
```javascript
function shouldDelayNotification(notification, userPreferences) {
  if (notification.priority === 'critical') return false;

  if (!userPreferences.workingHours.enabled) return false;

  const now = new Date();
  const hour = now.getHours();
  const start = parseInt(userPreferences.workingHours.start);
  const end = parseInt(userPreferences.workingHours.end);

  return hour < start || hour >= end;
}
```

---

## 📊 PERFORMANS VE İZLEME

### Metrikler

**İzlenecek KPI'lar:**
- ✅ Bildirim gönderim oranı (success rate)
- ✅ Ortalama teslim süresi
- ✅ Açılma/tıklama oranları
- ✅ Hata oranı ve türleri
- ✅ Queue uzunluğu
- ✅ Kullanıcı tercih değişiklikleri

**Dashboard:**
```
┌─────────────────────────────────────────────────────────────┐
│          BİLDİRİMLER SİSTEMİ - CANLI İZLEME                 │
├─────────────────────────────────────────────────────────────┤
│  📧 E-mail          📱 SMS          🔔 In-App      📲 Push   │
│  ✅ 1,234 (98%)     ✅ 456 (96%)    ✅ 2,345      ✅ 1,890  │
│  ❌ 26 (2%)         ❌ 19 (4%)       Queue: 12     Queue: 5  │
│                                                               │
│  Son 24 Saat: 3,945 bildirim                                │
│  Ortalama Süre: 2.3 saniye                                  │
└─────────────────────────────────────────────────────────────┘
```

### Log Örnekleri

**Başarılı Gönderim:**
```
[2025-11-06 14:30:15] INFO: Email notification sent
  notificationId: notif_20251106_001
  recipient: ahmet.yilmaz@tezmedical.com
  type: leave_approved
  deliveryTime: 2.3s
```

**Hata Logu:**
```
[2025-11-06 14:30:15] ERROR: SMS notification failed
  notificationId: notif_20251106_002
  recipient: +905321112233
  error: Gateway timeout
  retryAttempt: 1/3
  nextRetry: 2025-11-06 14:31:15
```

---

## 🔐 GÜVENLİK VE UYUMLULUK

### Veri Gizliliği

- ✅ Hassas bilgiler (TC No, maaş vb.) bildirimlere dahil edilmez
- ✅ E-posta/SMS içerikleri şifrelenir (TLS/SSL)
- ✅ Bildirim geçmişi kullanıcıya özeldir
- ✅ KVKK uyumlu veri saklama süreleri

### İzin ve Onay

- ✅ SMS/Push için açık kullanıcı onayı gereklidir
- ✅ E-posta bildirimleri iş sözleşmesi kapsamında zorunludur
- ✅ Kullanıcılar diledikleri zaman tercihleri değiştirebilir
- ✅ Toplu bildirim gönderimi için yönetici yetkisi gerekir

---

## 🚀 GELECEK GELİŞTİRMELER

### Faz 2 Özellikler

1. **Akıllı Bildirim Zamanlaması**
   - Makine öğrenmesi ile kullanıcı davranışı analizi
   - En uygun gönderim zamanı tahmini

2. **Çoklu Dil Desteği**
   - İngilizce şablonlar
   - Kullanıcı dil tercihi yönetimi

3. **Mobil Uygulama Entegrasyonu**
   - iOS/Android push notification
   - Deep linking desteği

4. **Chatbot Entegrasyonu**
   - WhatsApp Business API
   - Telegram Bot

5. **Gelişmiş Raporlama**
   - Bildirim etkinlik raporları
   - A/B testing için şablon karşılaştırma

6. **Sesli Bildirimler**
   - IVR sistemi entegrasyonu
   - Kritik durumlar için otomatik arama

---

## 📞 DESTEK VE İLETİŞİM

**Teknik Destek:**
- E-posta: support@tezmedical.com
- Telefon: 0850 XXX XX XX
- Destek Saatleri: 09:00 - 18:00 (Hafta içi)

**Sistem Yöneticisi:**
- İK Departmanı
- E-posta: ik@tezmedical.com

**Acil Durum:**
- 7/24 Operasyon Hattı: 0850 YYY YY YY

---

## 📄 SÜRÜM GEÇMİŞİ

| Versiyon | Tarih | Değişiklikler |
|----------|-------|---------------|
| 1.0 | 06.11.2025 | İlk versiyon - Tüm bildirim türleri tanımlandı |
| 1.1 | TBD | Mobil push notification desteği |
| 2.0 | TBD | Akıllı bildirim zamanlaması |

---

**Döküman Sahibi:** Tez Medikal İK Departmanı
**Son Güncelleme:** 06 Kasım 2025
**Durum:** ✅ Onaylandı