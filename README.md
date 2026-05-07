# Analytics Tracker

Hafif, gizlilik odaklı bir web analytics tracker scripti. Kullanıcı etkileşimlerini toplayıp [Analytics Backend](https://github.com/burakaltinbicak/analytics-backend)'e gönderir.

## Özellikler

- 📊 Sayfa görüntüleme (pageview) takibi
- 🖱️ Tıklama haritası (click tracking)
- 📜 Scroll derinliği takibi
- 📝 Form etkileşimi takibi
- ⏱️ Sayfada geçirilen süre
- 🔒 GDPR uyumlu (PII toplanmaz, DNT desteği)
- ⚡ Buffer/queue sistemi ile toplu gönderim
- 🔄 SPA desteği (Next.js, React, Vue)
- 🔁 Otomatik retry mekanizması

## Kurulum

```bash
npm install
```

## Build

```bash
npm run build
```

Build çıktısı `dist/tracker.js` olarak oluşur. Bu dosyayı backend projesinin `public/` klasörüne kopyala:

```bash
copy dist/tracker.js ../analytics-backend/public/tracker.js
```

## Kullanım

Dashboard'dan site ekledikten sonra üretilen script tag'ini sitenin `<head>` kısmına yapıştır:

```html
<script
  async
  src="https://analytics-backend-kss2.onrender.com/tracker.js"
  data-website-id="WEBSITE_ID"
  data-api-url="https://analytics-backend-kss2.onrender.com"
></script>
```

## Teknik Detaylar

- **Buffer sistemi:** Eventler anında gönderilmez, 5 saniyede bir veya 50 event dolunca toplu gönderilir
- **Retry:** Başarısız istekler 3 kez tekrar denenir
- **Beacon API:** Sayfa kapanırken `navigator.sendBeacon` kullanılır, veri kaybolmaz
- **Cleanup:** SPA geçişlerinde event listener'lar temizlenir, memory leak olmaz

## Bağlantılı Projeler

- [Analytics Backend](https://github.com/burakaltinbicak/analytics-backend) — API ve veri depolama
- [Analytics Dashboard](https://github.com/burakaltinbicak/analytics-dashboard) — Verileri görselleştiren arayüz