import { useState } from 'react';
import { PackagePlus, X } from 'lucide-react';
import type { FormEvent } from 'react';
import type { Product, ProductInput } from '../interfaces/inventory';
import { useInventory } from '../hooks/useInventory';

interface Props { product?: Product; onClose: () => void }

function formFrom(product?: Product): ProductInput {
  return product ? {
    name: product.name, sku: product.sku, categoryId: product.categoryId,
    purchasePrice: product.purchasePrice, salePrice: product.salePrice,
    stock: product.stock, minStock: product.minStock,
  } : {
    name: '', sku: '', categoryId: '', purchasePrice: 0, salePrice: 0, stock: 0, minStock: 5,
  };
}

export function ProductForm({ product, onClose }: Props) {
  const { addProduct, updateProduct, categories } = useInventory();
  const [form, setForm] = useState<ProductInput>(() => formFrom(product));
  const [error, setError] = useState('');

  const setField = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setError('');
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (product) updateProduct(product.id, form);
      else addProduct(form);
      onClose();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'İşlem tamamlanamadı.'); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/55 px-3 py-8 backdrop-blur-[2px]" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="product-form-title" className="w-full max-w-[650px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><PackagePlus size={21}/></span><div><h2 id="product-form-title" className="text-lg font-extrabold text-slate-900">{product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2><p className="mt-0.5 text-xs text-slate-500">Envanter bilgilerini doldurun.</p></div></div><button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Pencereyi kapat" onClick={onClose}><X size={21}/></button></div>
        <form onSubmit={submit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="form-label sm:col-span-2">Ürün Adı *<input className="form-input" autoFocus maxLength={120} required value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Örn. Kablosuz Mouse" /></label>
            <label className="form-label">SKU / Ürün Kodu *<input className="form-input" required maxLength={40} value={form.sku} onChange={e => setField('sku', e.target.value)} placeholder="Örn. ELK-001" /></label>
            <label className="form-label">Kategori *<select className="form-input" value={form.categoryId} required onChange={e => setField('categoryId', e.target.value)}><option value="">Kategori seçin</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label className="form-label">Alış Fiyatı (₺) *<input className="form-input" type="number" min="0" step="0.01" required value={form.purchasePrice} onChange={e => setField('purchasePrice', Number(e.target.value))} /></label>
            <label className="form-label">Satış Fiyatı (₺) *<input className="form-input" type="number" min="0" step="0.01" required value={form.salePrice} onChange={e => setField('salePrice', Number(e.target.value))} /></label>
            <label className="form-label">{product ? 'Mevcut Stok (hareket ekranından değiştirilir)' : 'Başlangıç Stok Miktarı *'}<input className={`form-input ${product ? 'bg-slate-100 text-slate-500' : ''}`} type="number" min="0" step="1" required disabled={Boolean(product)} value={form.stock} onChange={e => setField('stock', Number(e.target.value))} /></label>
            <label className="form-label">Minimum Stok Seviyesi *<input className="form-input" type="number" min="0" step="1" required value={form.minStock} onChange={e => setField('minStock', Number(e.target.value))} /></label>
          </div>
          {error && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}
          {categories.length === 0 && <p className="text-xs text-amber-700">Önce Kategoriler sayfasından kategori eklemelisiniz.</p>}
          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" className="btn-secondary" onClick={onClose}>Vazgeç</button><button type="submit" className="btn-primary">{product ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}</button></div>
        </form>
      </section>
    </div>
  );
}
