# StockPilot — GitHub ve Netlify Teslim Rehberi

Bu rehber, Web Geliştirme; Javascript Proje Yönergesi'nde istenen **ekran görüntüsü**, **public GitHub repo linki** ve **canlı Netlify adresini** tamamlamak içindir.

## 1. Güncellenmiş projeyi VS Code'da aç

- Önceki sürümde **Yedekleme ve Ayarlar** sayfası yoktur. Mevcut ürün kayıtların önemliyse önce eski projeyi ve tarayıcı verilerini koru. Yeni sürümü aynı tarayıcı ve `http://localhost:5173` adresinde açtığında, önceki LocalStorage kayıtlarını okuyabilmelidir; ardından yeni Ayarlar sayfasından JSON yedeği indir.
- Yeni v1.2 klasörünü ayrı bir yere çıkart. İstiyorsan eski klasördeki kaynak dosyaları yeni sürümle güncelle.
- `npm install` ve `npm run dev` komutlarını çalıştır.
- `/settings` sayfasını açarak JSON yedeği indirip doğrula.
- `npm run typecheck`, `npm test`, `npm run build` komutlarıyla son kontrolleri yap.

## 2. Gerçek uygulama ekran görüntülerini al

1. Dashboard sayfasına gel, grafik ve istatistiklerin görünmesini sağla.
2. Windows'ta `Win + Shift + S` ile alan görüntüsü al.
3. Görüntüyü `docs/screenshots/dashboard.png` olarak kaydet.
4. Aynı işlemi ürünler, kategoriler, stok hareketleri ve yedekleme ekranlarında uygula.
5. README içindeki ekran görüntüsü satırındaki `<!--` ve `-->` işaretlerini kaldır.
6. Gerçek müşteri bilgileri, kimlik bilgileri, token'lar, gizli URL'ler veya özel veriler görünüyorsa görüntüleri paylaşmadan önce temizle.

**Önemli:** Bu dağıtım ZIP'i uygulamanın canlı ekran görüntüsünü içermez. Görseller çalışır uygulama açıldıktan sonra senin tarafından eklenmelidir.

## 3. Public GitHub deposu oluştur

GitHub'a giriş yapıp **New repository** ile `stockpilot` adlı **public** bir depo oluştur. İlk kurulumda GitHub üzerinde otomatik README oluşturmak yerine projedeki README'yi kullanabilirsin.

StockPilot klasöründeki terminalde şu komutları çalıştır:

```powershell
git init
git add .
git commit -m "feat: StockPilot inventory management v1.2"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/stockpilot.git
git push -u origin main
```

`KULLANICI_ADIN` bölümünü kendi GitHub kullanıcı adınla değiştir. Repo zaten varsa `git remote -v` ile bağlantıyı kontrol et; `remote origin already exists` hatası alırsan mevcut remote'u değiştirmeden önce hangi depoya bağlı olduğuna bak.

`.gitignore` sayesinde `node_modules/`, `dist/` ve `.env` gibi yerel dosyalar gönderilmez. **İndirilen JSON yedekleri veya gerçek ticari veriler GitHub'a eklenmemelidir.**

## 4. Netlify üzerinde canlıya al

1. [Netlify](https://app.netlify.com/) hesabına giriş yap.
2. **Add new project** → **Import an existing project** adımlarını izle.
3. GitHub'ı yetkilendirerek `stockpilot` deposunu seç.
4. Build komutu: `npm run build`.
5. Publish directory: `dist`.
6. **Deploy** seçeneğini çalıştır ve başarılı yayın sonrası sana verilen `https://...netlify.app` adresini aç.
7. `/products`, `/categories`, `/movements`, `/settings` adreslerini yeni sekmede doğrudan açıp sayfa yönlendirmelerini test et.

> Netlify üzerinde bu proje yalnızca frontend olarak çalışır. LocalStorage kullanıcıların kendi tarayıcılarına aittir; Netlify çok kullanıcılı ortak bir stok veritabanı sağlamaz.

## 5. Eğitmene teslim kontrolü

- [ ] `npm run build` başarılı
- [ ] `npm test` başarılı
- [ ] Ürün ve kategori ekleme/listeleme/düzenleme/silme çalışıyor
- [ ] En az 1 gerçek ekran görüntüsü GitHub deposunda var
- [ ] Public GitHub bağlantısı açılabiliyor
- [ ] Netlify canlı adresi açılabiliyor
- [ ] Teslim formuna her iki bağlantı eklendi
