import { Link } from 'react-router';
import { lazy, Suspense } from 'react';
const StockCategoryChart = lazy(() => import('../components/StockCategoryChart'));
import { AlertTriangle, ArrowDownRight, ArrowLeftRight, ArrowRight, ArrowUpRight, Boxes, PackageCheck, ShoppingBag, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';
import { PageIntro, SectionTitle } from '../components/AppLayout';
import { StatusBadge } from '../components/StatusBadge';
import { useInventory } from '../hooks/useInventory';
import { formatCurrency, formatDate, formatNumber, isLowStock } from '../utils/format';

function MetricCard({ title, value, detail, icon, tint }: { title: string; value: string; detail: string; icon: ReactNode; tint: string }) {
  return <div className="panel flex min-h-[155px] flex-col justify-between p-5"><div className="flex items-center justify-between gap-3"><span className="text-[12px] font-semibold text-slate-500">{title}</span><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>{icon}</span></div><div><div className="mt-3 text-[25px] font-extrabold tracking-tight text-slate-900">{value}</div><div className="mt-1 text-[11px] text-slate-400">{detail}</div></div></div>;
}

export function DashboardPage() {
  const { products, categories, movements } = useInventory();
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const stockCost = products.reduce((sum, p) => sum + p.stock * p.purchasePrice, 0);
  const lowProducts = products.filter(p => isLowStock(p.stock, p.minStock));
  const chart = categories.map(category => ({
    name: category.name,
    adet: products.filter(p => p.categoryId === category.id).reduce((sum, p) => sum + p.stock, 0),
  }));
  const recentMovements = [...movements].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return <>
    <PageIntro eyebrow="STOK KONTROL MERKEZİ" title="İşletmenize genel bakış" description="Envanterinizin güncel durumunu tek bir ekrandan takip edin." action={<Link to="/products" className="btn-primary"><ShoppingBag size={16}/> Ürünleri Yönet <ArrowRight size={15}/></Link>} />
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard title="Toplam Ürün Çeşidi" value={formatNumber(products.length)} detail="Sisteme kayıtlı benzersiz ürün" icon={<Boxes size={21}/>} tint="bg-indigo-50 text-indigo-600" />
      <MetricCard title="Toplam Stok Adedi" value={formatNumber(totalUnits)} detail="Depodaki toplam birim" icon={<PackageCheck size={21}/>} tint="bg-sky-50 text-sky-600" />
      <MetricCard title="Stok Maliyet Değeri" value={formatCurrency(stockCost)} detail="Miktar × alış fiyatı" icon={<Wallet size={21}/>} tint="bg-emerald-50 text-emerald-600" />
      <MetricCard title="Kritik Stoktaki Ürün" value={formatNumber(lowProducts.length)} detail="Minimum seviyeye eşit veya altında" icon={<AlertTriangle size={21}/>} tint="bg-amber-50 text-amber-600" />
    </div>
    <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
      <section className="panel p-5 sm:p-6">
        <SectionTitle title="Kategorilere Göre Stok Dağılımı" description="Her kategoride bulunan toplam ürün adedi" />
        {chart.length ? <Suspense fallback={<div role="status" className="flex h-[310px] items-center justify-center text-sm text-slate-400">Grafik yükleniyor...</div>}><StockCategoryChart data={chart}/></Suspense> : <div className="flex h-[310px] items-center justify-center text-sm text-slate-400">Grafik için önce kategori oluşturun.</div>}
      </section>
      <section className="panel p-5 sm:p-6">
        <SectionTitle title="Kritik Stok Uyarıları" description="Öncelikli olarak kontrol edilmesi gerekenler" right={<Link to="/products" className="text-xs font-bold text-indigo-600 hover:underline">Tüm ürünler <ArrowRight size={13} className="inline"/></Link>} />
        <div className="space-y-4">{lowProducts.length ? lowProducts.slice(0, 5).map(p => <div key={p.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"><div className="min-w-0"><p className="truncate text-xs font-bold text-slate-800">{p.name}</p><p className="mt-1 text-[11px] text-slate-400">{p.sku} · Min: {p.minStock}</p></div><div className="text-right"><span className="block text-sm font-extrabold text-slate-800">{p.stock} adet</span><span className="mt-1 inline-block"><StatusBadge stock={p.stock} minStock={p.minStock}/></span></div></div>) : <div className="rounded-xl bg-emerald-50 p-5 text-sm text-emerald-700">Harika! Şu anda kritik stokta ürün bulunmuyor.</div>}</div>
      </section>
    </div>
    <section className="panel overflow-hidden"><div className="p-5 pb-0 sm:p-6 sm:pb-0"><SectionTitle title="Son Stok Hareketleri" description="En son gerçekleştirilen depo işlemleri" right={<Link to="/movements" className="text-xs font-bold text-indigo-600 hover:underline">Tüm hareketler <ArrowRight size={13} className="inline"/></Link>}/></div><div className="overflow-x-auto"><table className="table-base"><thead><tr><th>Ürün</th><th>İşlem Türü</th><th>Miktar</th><th>Tarih</th></tr></thead><tbody>{recentMovements.map(m => <tr key={m.id}><td className="font-semibold">{m.productName}</td><td><span className={`inline-flex items-center gap-1.5 font-bold ${m.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>{m.type === 'in' ? <ArrowDownRight size={15}/> : <ArrowUpRight size={15}/>} {m.type === 'in' ? 'Stok Girişi' : 'Stok Çıkışı'}</span></td><td className="font-bold">{m.type === 'in' ? '+' : '-'}{m.quantity}</td><td className="text-slate-500">{formatDate(m.createdAt)}</td></tr>)}{recentMovements.length === 0 && <tr><td colSpan={4} className="py-12 text-center text-slate-400"><ArrowLeftRight size={20} className="mx-auto mb-2"/> Henüz stok hareketi yok.</td></tr>}</tbody></table></div></section>
  </>;
}
