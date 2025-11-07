# Tez Medikal İzin Yönetim Sistemi

Modern ve kapsamlı bir izin yönetim sistemi. Şirket içi izin taleplerinin dijital ortamda oluşturulması, onaylanması ve raporlanması için geliştirilmiştir.

## Özellikler

### Kullanıcı Rolleri
- **Çalışan**: İzin talep edebilir, geçmişini görüntüleyebilir
- **Yönetici**: İzin taleplerini onaylayabilir/reddedebilir
- **İnsan Kaynakları**: Tüm izinleri yönetebilir, raporlar oluşturabilir
- **Operasyon**: Saha çalışanlarının izinlerini yönetebilir

### İzin Tipleri
- Yıllık İzin, Evlilik İzni, Doğum İzni, Ölüm İzni, Mazeret İzni
- Babalık İzni, Ücretsiz İzin, Eğitim İzni, Hastalık İzni, Evlat Edinme İzni

### Onay Akışı
- **Merkez Çalışanları**: Yönetici → İK (bazı izin tipleri için)
- **Saha Çalışanları**: Mesul Müdür → Operasyon → İK (bazı izin tipleri için)

## Demo Kullanıcıları

- **Çalışan**: calisan@tezmedikal.com / 123456
- **Yönetici**: yonetici@tezmedikal.com / 123456
- **İnsan Kaynakları**: ik@tezmedikal.com / 123456
- **Operasyon**: operasyon@tezmedikal.com / 123456

## Teknolojiler

- Vanilla JavaScript, HTML5, CSS3
- Flatpickr (Date Picker)
- Material Icons
- LocalStorage (Backend entegrasyona hazır)

## Deployment

Bu proje Vercel'da otomatik deploy edilebilir. GitHub'a push yapın ve Vercel'da import edin.

## Lisans

Tez Medikal için geliştirilmiştir.
