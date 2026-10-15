# StockPilot v1.2 — Güncel ekran görüntüleri

**Bu klasördeki eski v1.1 görsellerinin yerine v1.2 ekran görüntüleri konulmalıdır.**

## Yöntem A: Otomatik (önerilen)

Chrome veya Edge kurulu Windows bilgisayarında:

1. VS Code ile StockPilot **v1.2** klasörünü açın.
2. Bir terminalde `npm run dev` komutunu çalıştırın; örneğin `http://localhost:5174/` adresi gösterilsin.
3. **Başka bir VS Code terminalinde** aşağıdakini çalıştırın (portu kendi Vite çıktınıza göre değiştirin):

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\capture_screenshots.ps1 -BaseUrl http://localhost:5174
   ```

4. Script `docs/screenshots/` klasörüne şu **v1.2** PNG'lerini yazar: `dashboard.png`, `urunler.png`, `kategoriler.png`, `stok-hareketleri.png`, `yedekleme.png`.
5. **Mutlaka** PNG'leri açarak doğru sayfanın, menünün ve içeriğin göründüğünü kontrol edin. Eksik sayfa varsa aşağıdaki manuel yöntemi kullanın.

Script yerel uygulamaya temiz bir Chrome/Edge profiliyle bağlanır; normal profilinizdeki kişisel stok kayıtlarını almaz. Uygulamadaki örnek/demo kayıtlar görünür. **Görüntülerin `v1.2` olması için çalışan sunucunun v1.2 projesine ait olması gerekir.**

## Yöntem B: Elle, Chrome/Edge DevTools ile

1. Vite'ın gösterdiği yerel adresi ziyaret edin.
2. Beş sayfanın her biri için (`/`, `/products`, `/categories`, `/movements`, `/settings`) ilgili ekrana girin.
3. `F12` ile DevTools'u açın, `Ctrl+Shift+P` tuşlarına basın ve **Capture screenshot** veya **Capture full size screenshot** seçeneğini arayın.
4. Kaydedilen PNG'yi ilgili dosya adıyla **`docs/screenshots/`** klasörüne yerleştirin. Eski v1.1 dosyasını değiştirmeyi onaylayın.
5. Ürünler ekranında yeni **Sıralama / Sayfa başına** kontrollerini ve Stok Hareketleri ekranında **v1.2** sayfalamasını görünür kılın.
6. Görseli açıp tarayıcı sekmeleri/kişisel bilgiler/gizli anahtarlar bulunmadığını kontrol edin.

## Dosya eşlemesi

| Sayfa | URL yolu | PNG dosyası |
| --- | --- | --- |
| Genel Bakış | `/` | `dashboard.png` |
| Ürünler | `/products` | `urunler.png` |
| Kategoriler | `/categories` | `kategoriler.png` |
| Stok Hareketleri | `/movements` | `stok-hareketleri.png` |
| Yedekleme ve Ayarlar | `/settings` | `yedekleme.png` |

README'deki görsel bağlantıları bu dosyaları kullanır. Görseller oluşturulduğunda README'de ayrıca değişiklik yapılması gerekmez.

**GitHub'a göndermeden önce:** Eski görselleri yenilediğinizden, başlıkların/kartların görünür olduğundan ve gizli verilerin yer almadığından emin olun.
