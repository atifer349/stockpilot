import { useState } from 'react';
import type { FormEvent } from 'react';
import { FolderOpen, Pencil, Plus, Tags, Trash2, X } from 'lucide-react';
import { CATEGORY_COLORS } from '../context/InventoryContext';
import { PageIntro } from '../components/AppLayout';
import { useInventory } from '../hooks/useInventory';
import type { Category } from '../interfaces/inventory';

export function CategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useInventory();
  const [editing, setEditing] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [error, setError] = useState('');

  const openNew = () => { setEditing(null); setName(''); setColor(CATEGORY_COLORS[0]); setError(''); setModalOpen(true); };
  const openEdit = (category: Category) => { setEditing(category); setName(category.name); setColor(category.color); setError(''); setModalOpen(true); };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try { if (editing) updateCategory(editing.id, name, color); else addCategory(name, color); setModalOpen(false); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Kategori kaydedilemedi.'); }
  };
  const remove = (category: Category) => {
    const count = products.filter(p => p.categoryId === category.id).length;
    if (count > 0) { window.alert(`Bu kategoride ${count} ürün var. Silmek için önce ürünlerin kategorilerini değiştirin.`); return; }
    if (!window.confirm(`"${category.name}" kategorisini silmek istiyor musunuz?`)) return;
    try { deleteCategory(category.id); }
    catch (reason) { window.alert(reason instanceof Error ? reason.message : 'Kategori silinemedi.'); }
  };

  return <>
    <PageIntro eyebrow="ENVANTER / KATEGORİLER" title="Kategorilerinizi düzenleyin" description="Ürünlerinizi düzenli gruplara ayırarak stok kontrolünü kolaylaştırın." action={<button className="btn-primary" onClick={openNew}><Plus size={17}/> Yeni Kategori</button>} />
    <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-slate-500"><Tags size={16}/> Toplam {categories.length} kategori</div>
    {categories.length ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{categories.map(category => {
      const related = products.filter(p => p.categoryId === category.id);
      const units = related.reduce((sum, p) => sum + p.stock, 0);
      return <article key={category.id} className="panel p-6"><div className="mb-5 flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: category.color + '18', color: category.color }}><FolderOpen size={24}/></span><div className="flex gap-1"><button className="icon-button" title="Düzenle" aria-label={`${category.name} düzenle`} onClick={() => openEdit(category)}><Pencil size={16}/></button><button className="icon-button icon-button-danger" title="Sil" aria-label={`${category.name} sil`} onClick={() => remove(category)}><Trash2 size={16}/></button></div></div><h3 className="text-lg font-extrabold text-slate-900">{category.name}</h3><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm"><span className="text-slate-500">{related.length} ürün çeşidi</span><span className="font-bold text-slate-900">{units.toLocaleString('tr-TR')} adet</span></div></article>;
    })}</div> : <div className="panel p-12 text-center"><Tags size={30} className="mx-auto mb-3 text-slate-400"/><p className="text-sm font-semibold text-slate-600">Henüz kategori yok. Yeni kategori ekleyerek başlayın.</p></div>}
    {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-3 py-6" onMouseDown={event => { if (event.target === event.currentTarget) setModalOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="category-form-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 id="category-form-title" className="text-lg font-extrabold text-slate-900">{editing ? 'Kategori Düzenle' : 'Yeni Kategori'}</h2><button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Pencereyi kapat"><X size={21}/></button></div><form onSubmit={submit} className="space-y-5"><label className="form-label">Kategori Adı *<input className="form-input" autoFocus required maxLength={60} value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder="Örn. Elektronik"/></label><fieldset><legend className="form-label mb-3">Kategori Rengi</legend><div className="flex gap-3">{CATEGORY_COLORS.map(option => <button type="button" key={option} aria-label={`Renk: ${option}`} aria-pressed={color === option} onClick={() => setColor(option)} className={`h-9 w-9 rounded-xl ${color === option ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`} style={{ backgroundColor: option }}/>)}</div></fieldset>{error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</p>}<div className="flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>İptal</button><button type="submit" className="btn-primary">Kaydet</button></div></form></section></div>}
  </>;
}
