import { useState } from 'react';
import type { ReactNode } from 'react';
import { useInventory } from '../hooks/useInventory';
import { NavLink, useLocation } from 'react-router';
import { Activity, ArrowLeftRight, Boxes, ChartNoAxesCombined, CircleHelp, LayoutDashboard, Menu, Package, Settings2, Tags, X } from 'lucide-react';

const navigation = [
  { to: '/', label: 'Genel Bakış', icon: LayoutDashboard, title: 'Genel Bakış', subtitle: 'İşletmenizin stok durumuna hızlıca göz atın.' },
  { to: '/products', label: 'Ürünler', icon: Package, title: 'Ürün Yönetimi', subtitle: 'Envanterinizdeki bütün ürünleri yönetin.' },
  { to: '/categories', label: 'Kategoriler', icon: Tags, title: 'Kategori Yönetimi', subtitle: 'Ürünlerinizi kategorilere ayırın.' },
  { to: '/movements', label: 'Stok Hareketleri', icon: ArrowLeftRight, title: 'Stok Hareketleri', subtitle: 'Depo giriş ve çıkışlarını takip edin.' },
  { to: '/settings', label: 'Yedekleme ve Ayarlar', icon: Settings2, title: 'Yedekleme ve Ayarlar', subtitle: 'Verilerinizi dışa aktarın veya geri yükleyin.' },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { storageError } = useInventory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const active = navigation.find(item => item.to === location.pathname) ?? navigation[0];

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800 lg:flex">
      {mobileMenuOpen && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" aria-label="Menüyü kapat" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col bg-[#111d35] text-white transition-transform duration-200 lg:static lg:min-h-screen lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 pb-7 pt-8">
          <NavLink to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-900/40"><Boxes size={23} strokeWidth={2.3} /></span>
            <span><span className="block text-[19px] font-extrabold tracking-tight">StockPilot</span><span className="block text-[10px] font-medium tracking-[0.17em] text-slate-400">INVENTORY SUITE</span></span>
          </NavLink>
          <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-1 text-slate-400 lg:hidden" aria-label="Menüyü kapat"><X size={20} /></button>
        </div>
        <div className="px-6 pb-3 text-[10px] font-semibold tracking-[0.19em] text-slate-500">YÖNETİM PANELİ</div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Ana menü">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition ${isActive ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Activity size={17} className="text-emerald-400" /> Yerel çalışma modu</div>
          <p className="text-[11px] leading-5 text-slate-400">Verileriniz bu tarayıcının LocalStorage alanında saklanır.</p>
        </div>
        <div className="flex items-center gap-3 border-t border-white/10 px-6 py-5 text-xs text-slate-400"><CircleHelp size={16} /> v1.2 · Eğitim Projesi</div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-[78px] items-center justify-between gap-3 border-b border-slate-200/70 bg-white/95 px-5 backdrop-blur md:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden" aria-label="Menüyü aç"><Menu size={22} /></button>
            <div><h1 className="text-lg font-bold tracking-tight text-slate-900 md:text-xl">{active.title}</h1><p className="hidden text-xs text-slate-500 sm:block">{active.subtitle}</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span role={storageError ? "alert" : "status"} className={`hidden items-center gap-2 rounded-full px-3 py-2 text-[11px] font-bold sm:flex ${storageError ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}><span className={`h-2 w-2 rounded-full ${storageError ? "bg-rose-500" : "bg-emerald-500"}`} /> {storageError ? "Kaydetme başarısız! Yedek alın" : "Tarayıcıya kaydedildi"}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">SP</div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1450px] px-5 py-7 md:px-9 md:py-9">{children}</main>
        <footer className="px-5 pb-7 text-center text-[11px] text-slate-400 md:px-9">StockPilot © {new Date().getFullYear()} · React + TypeScript · LocalStorage</footer>
      </div>
    </div>
  );
}

export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-indigo-600">{eyebrow}</span><h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 md:text-[28px]">{title}</h2><p className="mt-1.5 text-[13px] text-slate-500">{description}</p></div>{action}</div>;
}

export function SectionTitle({ title, description, right }: { title: string; description?: string; right?: ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-[15px] font-extrabold tracking-tight text-slate-900">{title}</h3>{description && <p className="mt-1 text-xs text-slate-500">{description}</p>}</div>{right}</div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="flex flex-col items-center justify-center px-4 py-16 text-center"><div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400"><ChartNoAxesCombined size={28}/></div><h3 className="font-semibold text-slate-800">{title}</h3><p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p></div>;
}
