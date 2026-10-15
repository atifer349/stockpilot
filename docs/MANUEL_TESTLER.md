# StockPilot — Manuel Test Senaryoları

Bu testleri **demo verilerle** yapın. Gerçek veri kullanıyorsanız önce JSON yedeği indirin.

| ID | İşlem | Beklenen sonuç |
|---|---|---|
| T01 | Ürün ekle | Ürün listede ve dashboard istatistiklerinde görünür |
| T02 | Aynı SKU ile ikinci ürün ekle | Aynı ürün kodu reddedilir |
| T03 | Ürün adını ve fiyatlarını güncelle | Kaydedilen bilgiler listede görünür |
| T04 | Bir ürünü sil | Ürün listeden kalkar; stok hareketi geçmişi korunur |
| T05 | Kategori ekle/düzenle/sil | İşlemler beklenen biçimde çalışır |
| T06 | Ürüne bağlı kategoriyi silmeye çalış | İlgili uyarı gösterilir; kategori silinmez |
| T07 | Stok girişi ve çıkışı yap | Stok miktarı güncellenir; hareket geçmişi oluşur |
| T08 | Eldeki stoktan daha fazla çıkış yap | Hata gösterilir ve stok negatif olmaz |
| T09 | Ürün adında arama ve kategori filtresi | Liste yalnızca eşleşen kayıtları gösterir |
| T10 | Sayfayı yenile | Kayıtlar tarayıcının LocalStorage alanından geri gelir |
| T11 | Ürün CSV indir | Dosya açılabilir ve Türkçe karakterleri içerir |
| T12 | Ayarlar → JSON yedeği indir | `stockpilot-yedek-YYYY-MM-DD.json` indirir |
| T13 | Bozuk JSON dosyası yükle | Hata verir; mevcut envanter değişmez |
| T14 | Geçerli JSON yükle, işlemi iptal et | Kayıtlar değişmez |
| T15 | Geçerli JSON yükle, onay ver | Ürün/kategori/hareket sayıları yedekle eşitlenir |
| T16 | Dashboard'u telefona yakın dar ekranda aç | Menü açılıp kapanır, kritik içerik görünür |
| T17 | Netlify URL'sinde doğrudan `/settings` aç | Sayfa 404 vermeden yüklenir |

> Netlify ve gerçek tarayıcı testleri geliştiricinin kendi ortamında doğrulanmalıdır; yalnızca dosyaların hazırlanmış olması gerçek tarayıcı testinin geçtiği anlamına gelmez.

## v1.2 Ek Testler

| ID | İşlem | Beklenen sonuç |
|---|---|---|
| T18 | 15+ ürün kaydı oluştur, sayfa başına 10 seç | İlk sayfada 10 ürün, ikinci sayfada kalanlar görünür |
| T19 | Ürünleri stok, fiyat ve ada göre sırala | Sıralama doğru değişir, kayıtlar silinmez |
| T20 | Birkaç filtre kullanıp sayfa değiştir | Yeni filtreleme ilk sayfaya döner |
| T21 | Telefon boyutunda stok hareket geçmişini aç | Kartlar ekrana sığar ve yatay kaydırma gerekmez |
| T22 | Ayarlar > JSON yedeği al, sürümü güncelle ve yeniden aç | Kayıtlar korunur; `stockpilot-inventory-v1` anahtarı değişmez |
| T23 | Ürün düzenleme ekranında stok miktarını incele | Stok yalnızca Stok Hareketleri ekranından değişir |
| T24 | GitHub/Netlify ana sayfayı ve doğrudan /products yolunu aç | Sayfa/grafik dinamik yüklenir, 404 oluşmaz |
| T25 | Tarayıcı depolamasını kapat/doldur (isteğe bağlı ileri test) | Kayıt başarısızlığı üst çubukta uyarı gösterir |

> Ekran testleri otomatik testlerden farklıdır; uygulamayı tarayıcıda ayrıca kontrol edin.
