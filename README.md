# 📦 StockPilot — Stok ve Envanter Yönetim Sistemi

**StockPilot**, React, TypeScript ve Tailwind CSS ile geliştirilen, tarayıcıda çalışan bir stok yönetimi eğitim projesidir. Kullanıcı ürünlerini ve kategorilerini yönetebilir, depo giriş-çıkışlarını kaydedebilir ve kritik stokları takip edebilir.

> **Eğitim projesidir.** Veriler yalnızca tarayıcının LocalStorage alanında saklanır. Merkezi bir sunucu/veritabanı veya kullanıcı hesabı yoktur. Gerçek ticari stoklar için kullanılmamalıdır.

## 🚀 Teknolojiler

- React 19 ve Vite 7
- TypeScript
- Tailwind CSS 4
- React Router 7
- Recharts
- Lucide React
- LocalStorage
- Netlify (statik dağıtım için yapılandırma)

## ✅ Özellikler

| Modül | İşlevler |
|---|---|
| Dashboard | Toplam ürün çeşidi, stok adedi, maliyet değeri, kritik stoklar, grafik, son hareketler |
| Ürünler | Ürün ekle/listele/düzenle/sil, SKU kontrolü, kategori ve stok durumu filtreleri, ad/fiyat/stok sıralama, sayfalama, CSV dışa aktarma |
| Kategoriler | Ekle/listele/düzenle/sil, renk seçimi, bağlı ürün varken silme koruması |
| Stok Hareketleri | Giriş/çıkış işlemleri, mobil uyumlu hareket geçmişi, sayfalama, yetersiz stok koruması |
| Yedekleme ve Ayarlar | JSON yedeği indir, dosyayı doğrula ve geri yükle, isteğe bağlı demo sıfırlama |

## 💻 Kurulum ve çalıştırma

Gereksinimler: **Node.js 22.12+ veya 24+** ve npm. VS Code terminalinde:

```powershell
npm install
npm run dev
```

Terminalin gösterdiği adresi açın (genellikle **http://localhost:5173**).

Üretim derlemesi ve test komutları:

```powershell
npm run typecheck
npm test
npm run build
npm run preview
```

> `npm test` için Node.js 22+ sürümünde yer alan deneysel TypeScript type stripping özelliği kullanılır. Normal geliştirme ortamında `npm run dev` komutu yeterlidir.

## 📁 Klasör yapısı

```text
stockpilot/
├── .github/workflows/ci.yml       # GitHub Actions kontrolü
├── docs/                          # Ekran görüntüsü ve teslim rehberi
├── public/logo.svg
├── src/
│   ├── components/                 # Ortak arayüz bileşenleri
│   ├── context/                    # InventoryProvider, veri ve güncelleme yönetimi
│   ├── hooks/                      # useInventory hook'u
│   ├── interfaces/                 # TypeScript veri modelleri
│   ├── pages/                      # Dashboard, ürün, kategori, hareket, ayarlar
│   ├── utils/                      # Saf CRUD iş kuralları, filtreler, yedek ve demo veriler
│   ├── App.tsx                     # Sayfa rotaları
│   └── main.tsx                    # Uygulama giriş noktası
├── tests/                          # Otomatik yedek, CRUD, stok ve sayfalama testleri
├── netlify.toml                    # Netlify ve SPA yönlendirme ayarları
├── package.json
└── index.html
```

## 🔐 Veri saklama ve yedekleme

1. Yeni kurulumda **örnek ürün ve kategoriler** ilk defa oluşturulur.
2. Yapılan değişiklikler LocalStorage'da `stockpilot-inventory-v1` anahtarı altında saklanır.
3. Sol menüden **Yedekleme ve Ayarlar** → **JSON Yedeğini İndir** işlemini kullanabilirsiniz.
4. JSON dosyasını güvenli bir yerde saklayın. Geri yükleme için aynı sayfadan dosyayı seçin, özetini kontrol edin ve onaylayın.
5. Geri yükleme, **mevcut** ürün, kategori ve stok hareketlerinin **yerine** dosyadaki kayıtları getirir.

**Önemli:** Tarayıcı verilerini temizlemek kayıtları silebilir. LocalStorage cihazlar arasında senkronize olmaz. Gerçek stok bilgileriniz için bu sürümü kullanmayın. Yedekleme yaparken kişisel veya gizli bilgileri GitHub'a koymayın.

## 🧪 Test

`npm test`, JSON yedek formatını, ürün ve kategori CRUD kurallarını, stok giriş/çıkışını, filtreleme, sıralama ve sayfalamayı kontrol eden **23 testi** çalıştırır. Ayrıca ekranları manuel kontrol etmek için `docs/MANUEL_TESTLER.md` belgesini izleyin.

## 📸 Ekran görüntüleri

Ekran görüntüleri önceki çalışan **v1.1 sürümünden** alınmıştır; v1.2 tasarımındaki değişiklikleri göstermek için özellikle Ürünler ve Stok Hareketleri ekranlarını yenileyin:

- `docs/screenshots/dashboard.png`
- `docs/screenshots/urunler.png`
- `docs/screenshots/kategoriler.png`
- `docs/screenshots/stok-hareketleri.png`
- `docs/screenshots/yedekleme.png`

GitHub'da aşağıdaki gerçek uygulama ekran görüntüleri gösterilir:

### Dashboard

![StockPilot Dashboard](docs/screenshots/dashboard.png)

### Ürün Yönetimi

![StockPilot Ürün Yönetimi](docs/screenshots/urunler.png)

### Kategori Yönetimi

![StockPilot Kategori Yönetimi](docs/screenshots/kategoriler.png)

### Stok Hareketleri

![StockPilot Stok Hareketleri](docs/screenshots/stok-hareketleri.png)

### Yedekleme ve Ayarlar

![StockPilot Yedekleme](docs/screenshots/yedekleme.png)

Ekran görüntüsü ve teslim adımları: **[GitHub ve Netlify Rehberi](docs/TESLIM_REHBERI.md)**.

## 🌐 Netlify ile yayımlama

`netlify.toml` dosyası otomatik yapılandırmayı içerir:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

GitHub'a yükledikten sonra Netlify → **Add new project / Import an existing project** → GitHub deposunu seçin. Build komutu `npm run build`, publish dizini `dist` olmalıdır. Çalışan bağlantıyı teslim formuna ekleyin.

## 🎓 Proje yönergesi uygunluğu

- [x] Modern JavaScript kütüphanesi: React
- [x] CSS teknolojisi: Tailwind CSS
- [x] `components`, `pages`, `interfaces` klasörleri
- [x] Ekleme / listeleme / güncelleme / silme (CRUD)
- [x] LocalStorage ile veri saklama
- [x] **v1.1 uygulama ekran görüntüleri depoya eklendi (v1.2 görüntüleri güncellenebilir)**
- [ ] **GitHub public repo oluşturulacak ve proje gönderilecek**
- [ ] **Netlify canlı bağlantısı oluşturulup teslim edilecek**

## 📌 Sürüm notu

**v1.2** — CRUD iş kuralları React Context'ten ayrılarak saf fonksiyonlara taşındı; test sayısı **8'den 23'e** çıktı. Ürün listesine sıralama/sayfalama, stok hareketlerine mobil uyumlu kart görünümü, kayıt hatası bildirimi ve sayfa/grafik bazlı lazy loading eklendi. Aynı LocalStorage anahtarı (`stockpilot-inventory-v1`) kullanılır.

**v1.1** — JSON yedekleme/geri yükleme, dosya bütünlüğü denetimi, ayarlar sayfası, otomatik testler ve teslim dokümantasyonu eklendi.

**Not:** v1.2 otomatik testleri geçti. Bu paketin hazırlandığı ortamda npm bağımlılıkları indirilemediği için v1.2 üretim derlemesi ve gerçek tarayıcı testi **henüz doğrulanmadı**. GitHub'a göndermeden önce `npm run typecheck`, `npm test` ve `npm run build` komutlarını kendi bilgisayarınızda çalıştırın.
