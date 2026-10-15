import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Package, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { EmptyState, PageIntro } from '../components/AppLayout';
import { ProductForm } from '../components/ProductForm';
import { StatusBadge } from '../components/StatusBadge';
import { useInventory } from '../hooks/useInventory';
import type { Product } from '../interfaces/inventory';
import { formatCurrency, formatNumber } from '../utils/format';
import { filterAndSortProducts, paginateItems } from '../utils/productTable';
import type { SortMode, StockFilter } from '../utils/productTable';

/** Bir e-tablo CSV dosyasında formül olarak yorumlanabilecek kullanıcı metinlerini etkisizleştirir. */
function toCsvCell(value: string | number): string {
  const raw = String(value);
  const safe = typeof value === 'string' && /^[\s]*[=+@\-\t\r\n]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function ProductsPage() {
  const { products, categories, deleteProduct } = useInventory();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [sort, setSort] = useState<SortMode>('name-asc');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const filtered = useMemo(() => filterAndSortProducts(products, { search, categoryId, stockFilter, sort }),
    [products, search, categoryId, stockFilter, sort]);
  const pagination = useMemo(() => paginateItems(filtered, page, pageSize), [filtered, page, pageSize]);

  const remove = (product: Product) => {
    if (window.confirm(`"${product.name}" adlı ürünü silmek istiyor musunuz?\nStok hareket geçmişi korunacaktır.`)) {
      try { deleteProduct(product.id); }
      catch (reason) { window.alert(reason instanceof Error ? reason.message : 'Ürün silinemedi.'); }
    }
  };

  const exportCsv = () => {
    const rows = [
      ['SKU', 'Ürün Adı', 'Kategori', 'Alış Fiyatı', 'Satış Fiyatı', 'Stok', 'Minimum Stok'],
      ...filtered.map(p => [p.sku, p.name, categories.find(c => c.id === p.categoryId)?.name ?? '-', p.purchasePrice, p.salePrice, p.stock, p.minStock]),
    ];
    const content = '\uFEFF' + rows.map(row => row.map(toCsvCell).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'stockpilot-urunler.csv'; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <>
    <PageIntro eyebrow="ENVANTER / ÜRÜNLER" title="Ürünlerinizi kolayca yönetin" description={`${formatNumber(products.length)} ürün kayıtlı · Arama, filtreleme ve tam CRUD desteği.`} action={<div className="flex flex-wrap gap-2"><button className="btn-secondary" onClick={exportCsv}><Download size={16}/> CSV İndir</button><button className="btn-primary" onClick={() => { setEditingProduct(undefined); setModalOpen(true); }}><Plus size={17}/> Yeni Ürün Ekle</button></div>} />
    <section className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 lg:flex-row lg:items-center">
        <div className="relative flex-1"><Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/><input className="form-input !mt-0 !pl-10" placeholder="Ürün adı veya SKU ile ara..." aria-label="Ürün ara" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/></div>
        <div className="flex flex-col gap-3 sm:flex-row"><div className="relative"><SlidersHorizontal size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><select className="form-input !mt-0 min-w-[160px] !pl-9" aria-label="Kategoriye göre filtrele" value={categoryId} onChange={e => { setCategoryId(e.target.value); setPage(1); }}><option value="all">Tüm Kategoriler</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><select className="form-input !mt-0 min-w-[150px]" aria-label="Stok durumuna göre filtrele" value={stockFilter} onChange={e => { setStockFilter(e.target.value as StockFilter); setPage(1); }}><option value="all">Tüm Stoklar</option><option value="available">Yeterli Stok</option><option value="critical">Kritik / Tükenen</option><option value="out">Stok Tükenen</option></select></div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-slate-500"><span><strong className="text-slate-700">{filtered.length}</strong> eşleşen ürün · {pagination.from}–{pagination.to} gösteriliyor</span><div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2">Sıralama <select aria-label="Ürünleri sırala" className="form-input !mt-0 !w-auto !py-1.5 text-xs" value={sort} onChange={e => { setSort(e.target.value as SortMode); setPage(1); }}><option value="name-asc">İsim A–Z</option><option value="name-desc">İsim Z–A</option><option value="stock-asc">Stok (artan)</option><option value="stock-desc">Stok (azalan)</option><option value="price-asc">Satış fiyatı (artan)</option><option value="price-desc">Satış fiyatı (azalan)</option></select></label><label className="flex items-center gap-2">Sayfa başına <select aria-label="Sayfa başına ürün" className="form-input !mt-0 !w-auto !py-1.5 text-xs" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select></label></div></div>
      <div className="overflow-x-auto"><table className="table-base"><thead><tr><th>Ürün</th><th>Kategori</th><th>Alış Fiyatı</th><th>Satış Fiyatı</th><th>Stok</th><th>Durum</th><th className="text-right">İşlemler</th></tr></thead><tbody>{pagination.items.map(product => { const category = categories.find(c => c.id === product.categoryId); return <tr key={product.id}><td><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500"><Package size={19}/></span><div className="min-w-[160px]"><p className="font-bold text-slate-800">{product.name}</p><p className="mt-1 text-[11px] text-slate-400">{product.sku}</p></div></div></td><td><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: category?.color ?? '#94a3b8' }}/>{category?.name ?? 'Bilinmiyor'}</span></td><td>{formatCurrency(product.purchasePrice)}</td><td className="font-bold text-slate-800">{formatCurrency(product.salePrice)}</td><td className="font-extrabold text-slate-800">{formatNumber(product.stock)}</td><td><StatusBadge stock={product.stock} minStock={product.minStock}/></td><td><div className="flex justify-end gap-1"><button className="icon-button" title="Düzenle" aria-label={`${product.name} düzenle`} onClick={() => { setEditingProduct(product); setModalOpen(true); }}><Pencil size={16}/></button><button className="icon-button icon-button-danger" title="Sil" aria-label={`${product.name} sil`} onClick={() => remove(product)}><Trash2 size={16}/></button></div></td></tr>; })}</tbody></table>{filtered.length === 0 && <EmptyState title="Ürün bulunamadı" description="Arama filtrelerinizi değiştirebilir veya yeni bir ürün ekleyebilirsiniz." />}</div>
      {pagination.totalPages > 1 && <nav aria-label="Ürün sayfaları" className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500"><span>Sayfa {pagination.page} / {pagination.totalPages}</span><div className="flex gap-2"><button type="button" className="btn-secondary !px-3 !py-2" disabled={pagination.page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft size={15}/> Önceki</button><button type="button" className="btn-secondary !px-3 !py-2" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}>Sonraki <ChevronRight size={15}/></button></div></nav>}
    </section>
    {modalOpen && <ProductForm key={editingProduct?.id ?? 'new'} product={editingProduct} onClose={() => setModalOpen(false)} />}
  </>;
}
