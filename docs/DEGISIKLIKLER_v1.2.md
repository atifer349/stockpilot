# StockPilot v1.2 — Sürüm Notları

## Yapılan güncellemeler

- `src/utils/inventoryOperations.ts`: React'ten bağımsız, yan etkisiz CRUD ve stok hareketi kuralları. SKU tekrarı, fiyat/miktar doğrulama, bağlı kategori silinmesi ve aşırı stok çıkışı engellenir.
- `src/context/InventoryContext.tsx`: İş kuralları yeni modüle bağlandı. Arka arkaya yapılan senkron işlemlerin eski React durumunu kullanmasını önlemek için `ref` ile güncel durum tutulur. Eski LocalStorage anahtarı ve yedek formatı **değiştirilmedi**.
- `src/utils/productTable.ts`: Test edilebilir ürün arama, filtreleme, sıralama ve sayfalama işlevleri.
- `src/pages/ProductsPage.tsx`: Sıralama, sayfa boyutu ve önceki/sonraki sayfa kontrolleri. CSV aktarmadaki metin alanlarında basit formül-enjeksiyonuna karşı önlem.
- `src/pages/MovementsPage.tsx`: Dar ekranlarda yatay kaydırma yerine tek satırlı kayıt kartları; hareket geçmişine sayfalama.
- `src/App.tsx` ve `src/components/StockCategoryChart.tsx`: Sayfa ve grafik düzeyinde lazy loading, başlangıç JavaScript paketini bölme. Gerçek boyutlar ancak `npm run build` çıktısıyla teyit edilir.
- `src/components/AppLayout.tsx`: LocalStorage'a yazma başarısız olursa uyarı.
- `tests/inventory-operations.test.mjs` ve `tests/product-table.test.mjs`: 15 yeni test. Toplam 23 otomatik test.

## Sınırlar ve dikkat edilmesi gerekenler

1. Bu sürüm hâlâ eğitim/prototip uygulamasıdır. Veriler yalnızca mevcut tarayıcıdaki LocalStorage'da saklanır; veritabanı veya kullanıcı girişi yoktur.
2. `Recharts 2.x` bağımlılığı geriye dönük uyumu korumak için değiştirilmedi; npm'in *deprecated* uyarısı halen görülebilir. v3 geçişi ayrı sürümde test edilmelidir.
3. Bu ortamda bağımlılıkları indirmek mümkün olmadığından v1.2 üretim derlemesi ve tarayıcı testi koşulmadı. 23 Node testi geçti, 19 TS/TSX dosyasında sözdizimi hatası yok. Kendi bilgisayarınızda `npm install`, `npm run typecheck`, `npm test`, `npm run build`, `npm run dev` komutlarını çalıştırın.
4. Aynı bilgisayarda aynı URL/origin üzerinde çalışırken kayıtlar normal şartlarda devam eder. Yine de yeni sürüme geçmeden önce Ayarlar ekranından **JSON yedeği indirin**. `localhost:5173` yerine başka bir origin kullanırsanız LocalStorage ayrıdır; yedeği içe aktarın.

## GitHub ve Netlify

`README.md` ve `docs/screenshots` dahil olarak GitHub public deposuna gönderin. Netlify için Build = `npm run build`, Publish = `dist` (mevcut `netlify.toml`). Yayına geçmeden önce yerel testleri bitirin.
