import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowDownRight, ArrowLeftRight, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight, Info, Plus } from 'lucide-react';
import { EmptyState, PageIntro, SectionTitle } from '../components/AppLayout';
import { useInventory } from '../hooks/useInventory';
import type { MovementType } from '../interfaces/inventory';
import { formatDate, formatNumber } from '../utils/format';
import { paginateItems } from '../utils/productTable';

export function MovementsPage() {
  const { products, movements, addMovement } = useInventory();
  const [productId, setProductId] = useState('');
  const [type, setType] = useState<MovementType>('in');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const selected = products.find(p => p.id === productId);
  const sorted = useMemo(() => [...movements].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [movements]);
  const pagination = useMemo(() => paginateItems(sorted, page, 10), [sorted, page]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      addMovement(productId, type, quantity, note);
      setError(''); setSuccess('Stok hareketi başarıyla kaydedildi.');
      setQuantity(1); setNote(''); setPage(1);
    } catch (reason) { setSuccess(''); setError(reason instanceof Error ? reason.message : 'Hareket kaydedilemedi.'); }
  };

  return <>
    <PageIntro eyebrow="ENVANTER / STOK HAREKETLERİ" title="Depo giriş ve çıkışları" description="Her stok değişikliğini kaydedin ve geçmiş işlemleri inceleyin." />
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[0.9fr_1.4fr]">
      <section className="panel p-5 sm:p-6">
        <SectionTitle title="Yeni Stok Hareketi" description="İşlem sonrası ürün stoğu otomatik güncellenir."/>
        <form onSubmit={submit} className="space-y-4">
          <label className="form-label">Ürün *<select className="form-input" value={productId} required onChange={e => { setProductId(e.target.value); setError(''); setSuccess(''); }}><option value="">Ürün seçin</option>{products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}</select></label>
          {selected && <p className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-xs font-bold text-indigo-700"><Info size={16}/> Mevcut stok: {selected.stock} adet</p>}
          <fieldset><legend className="form-label mb-2">Hareket Türü *</legend><div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setType('in'); setError(''); setSuccess(''); }} aria-pressed={type === 'in'} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold ${type === 'in' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500'}`}><ArrowDownRight size={17}/> Stok Girişi</button>
            <button type="button" onClick={() => { setType('out'); setError(''); setSuccess(''); }} aria-pressed={type === 'out'} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold ${type === 'out' ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-500'}`}><ArrowUpRight size={17}/> Stok Çıkışı</button>
          </div></fieldset>
          <label className="form-label">Miktar *<input className="form-input" type="number" min="1" step="1" required value={quantity} onChange={e => { setQuantity(Number(e.target.value)); setError(''); setSuccess(''); }} /></label>
          <label className="form-label">Açıklama (isteğe bağlı)<textarea className="form-input min-h-24 resize-y" maxLength={250} value={note} onChange={e => setNote(e.target.value)} placeholder="Örn. Tedarikçi sevkiyatı, satış çıkışı..." /></label>
          {error && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">{error}</div>}
          {success && <div role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700"><CheckCircle2 size={16}/>{success}</div>}
          <button className="btn-primary w-full" type="submit" disabled={products.length === 0}><Plus size={16}/> Hareketi Kaydet</button>
        </form>
      </section>
      <section className="panel overflow-hidden">
        <div className="p-5 pb-0 sm:p-6 sm:pb-0"><SectionTitle title="Hareket Geçmişi" description={`Toplam ${formatNumber(sorted.length)} işlem kaydı`}/></div>
        {pagination.items.length ? <ul className="divide-y divide-slate-100" aria-label="Stok hareketleri">
          {pagination.items.map(m => <li key={m.id} className="flex flex-col gap-2 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${m.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{m.type === 'in' ? <ArrowDownRight size={19}/> : <ArrowUpRight size={19}/>}</span><div><p className="break-words text-sm font-bold text-slate-800">{m.productName}</p><p className="mt-0.5 text-[11px] text-slate-500">{formatDate(m.createdAt)}</p></div></div><div className={`shrink-0 text-right text-sm font-extrabold ${m.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>{m.type === 'in' ? '+' : '−'}{formatNumber(m.quantity)} <span className="block text-[11px] font-medium">{m.type === 'in' ? 'Stok Girişi' : 'Stok Çıkışı'}</span></div></div>
            {m.note && <p className="pl-11 text-xs leading-5 text-slate-500">{m.note}</p>}
          </li>)}
        </ul> : <EmptyState title="Hareket kaydı bulunmuyor" description="Soldaki formu kullanarak ilk stok hareketinizi ekleyin." />}
        {pagination.totalPages > 1 && <nav className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500" aria-label="Stok hareketi sayfaları"><span>{pagination.page} / {pagination.totalPages} sayfa</span><div className="flex gap-2"><button className="icon-button" title="Önceki sayfa" aria-label="Önceki sayfa" disabled={pagination.page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft size={18}/></button><button className="icon-button" title="Sonraki sayfa" aria-label="Sonraki sayfa" disabled={pagination.page === pagination.totalPages} onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}><ChevronRight size={18}/></button></div></nav>}
        <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-400"><ArrowLeftRight size={15}/> Silinen ürünlerin hareket geçmişi korunur.</div>
      </section>
    </div>
  </>;
}
