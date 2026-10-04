# ToolX Hızlı Araçlar – Geliştirici Kılavuzu

Bu kılavuz, **toolx.com.tr** Hızlı Araçlar modülünü yerel ortamda çalıştırmak, test etmek ve yeni araçlar eklemek isteyen geliştiriciler için hazırlanmıştır.

---

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkları Yükleme
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```
Uygulama `http://localhost:3000` adresinde çalışacaktır.

### 3. Testleri Çalıştırma
```bash
npm test
```

### 4. Statik Üretim (Build)
```bash
npm run build
```
Çıktı `dist/` klasörüne yazılır ve doğrudan Cloudflare Pages'a yüklenebilir.

---

## 🛠️ Yeni Bir Hızlı Araç Ekleme Adımları

Hızlı Araçlar modülüne yeni bir son kullanıcı aracı eklemek için Clean Architecture kurallarını takip edin:

1. **Domain Katmanı**:
   - `src/domain/<kategori>/` altında saf bir TypeScript dosyası oluşturun.
   - Matematiksel/mantıksal formülü saf fonksiyon olarak yazın.
   - `tests/unit/` altında bu fonksiyon için birim test ekleyin.

2. **Presentation Katmanı**:
   - `src/presentation/components/tools/YeniAracTool.tsx` bileşenini oluşturun.
   - `ToolCard` kapsayıcısını kullanarak başlık, açıklama ve kategori ikonunu tanımlayın.

3. **Registry Kaydı**:
   - `src/application/registry/toolsRegistry.ts` dosyasına aracın kimliğini (`id`), adını, kısa açıklamasını ve arama anahtar kelimelerini (`keywords`) ekleyin.
   - `src/App.tsx` dosyasındaki `TOOL_COMPONENTS_MAP` sözlüğüne bileşeni bağlayın.
