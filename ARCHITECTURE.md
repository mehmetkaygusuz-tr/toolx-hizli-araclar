# ToolX Hızlı Araçlar Modülü – Clean Architecture & Sistem Mimarisi

Bu dokümantasyon, **toolx.com.tr** için geliştirilen Hızlı Araçlar modülünün katmanlı mimarisini (Clean Architecture), tasarım prensiplerini ve Cloudflare Pages entegrasyonunu detaylandırmaktadır.

---

## 1. Mimari Katmanlar (Clean Architecture)

Proje, yazılım mühendisliği prensiplerine uygun olarak 3 temel katmana ayrılmıştır:

```
src/
├── domain/                  # 1. Saf İş & Matematik Mantığı (Pure Logic)
│   ├── math/                # KDV, indirim, yüzde, BMI, hesap bölüştürücü
│   ├── text/                # Kelime/karakter sayacı, Türkçe harf düzenleyici, temizleyici
│   ├── datetime/            # Tarih farkı, yaş & burç hesaplayıcı
│   ├── units/               # Uzunluk, kütle, sıcaklık, veri saklama dönüştürücüler
│   └── practical/           # Şifre üretici & entropi, rastgele seçici
│
├── application/             # 2. Uygulama & Durum Yönetimi (State & Registry)
│   ├── hooks/               # useLocalStorage, useClipboard, useSound
│   └── registry/            # Araç kataloğu, arama indeksleri, kategori tanımları
│
└── presentation/            # 3. Sunum Katmanı (UI & React Bileşenleri)
    ├── components/
    │   ├── common/          # CopyButton, ToolCard gibi tekrar kullanılabilir arayüz öğeleri
    │   ├── layout/          # Header, HeroSection, CategoryBar, Footer
    │   └── tools/           # 20+ modüler, bağımsız araç bileşeni
    └── ...
```

### Katman Kuralları:
1. **Domain Katmanı**: Hiçbir React, DOM veya harici kütüphane bağımlılığı içermez. Saf TypeScript fonksiyonlarıdır. Bu sayede %100 birim test (unit test) kapsamına alınabilir ve sunucu/istemci fark etmeksizin her yerde çalışabilir.
2. **Application Katmanı**: Araçların kayıt defterini (`toolsRegistry`), yerel depolama ve ses/haptik geri bildirim mantığını yönetir.
3. **Presentation Katmanı**: Domain mantığını kullanıcıya aktaran, Tailwind CSS ve React 19 ile hazırlanmış modern arayüz bileşenlerini içerir.

---

## 2. Sıfır Sunucu Gecikmesi & %100 Gizlilik İlkesi

- Tüm araçlar istemci taraflı (client-side) çalışır.
- Kullanıcının yüklediği fotoğraflar, girdiği fatura tutarları veya yazdığı kişisel notlar asla bir uzak sunucuya aktarılmaz.
- Tarayıcı içi `HTML5 Canvas`, `Blob`, `Web Audio API` ve `crypto.getRandomValues` standartları kullanılır.

---

## 3. Cloudflare Pages & DNS Yapılandırması

Site statik çıktı (`npm run build` -> `dist/`) olarak üretilir ve Cloudflare edge sunucularında ultra hızlı yayınlanır:
- `public/_headers`: Güvenlik başlıkları (Content-Security-Policy, X-Frame-Options, Cache-Control).
- `public/_routes.json`: SPA yönlendirmeleri ve statik asset önbellekleme kuralları.
- `public/robots.txt` ve `public/sitemap.xml`: toolx.com.tr arama motoru optimizasyonu (SEO).
- `public/manifest.json`: Mobil ve masaüstü PWA (Progressive Web App) desteği.

---

## 4. Test Stratejisi

Tüm matematiksel ve metinsel hesaplamalar `Vitest` birim test paketi ile doğrulanmaktadır:
```bash
# Testleri çalıştırmak için:
npm test
```
Test kapsamı:
- Türkçe `i` ve `ı` büyük/küçük harf dönüşüm kuralları.
- %1, %10, %20 KDV ve tevkifat kesirleri (2/10, 5/10 vb.).
- Vücut Kitle İndeksi (BMI) sınır değerleri ve DSÖ aralıkları.
- Kar marjı, fiyat artışı ve yüzde değişim formülleri.
- Birim çevrim hassasiyeti (inç, cm, kg, pound, Celsius, Fahrenheit).
- Şifre entropi hesaplaması ve PIN uzunluk doğrulama.
