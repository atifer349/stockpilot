import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { AlertTriangle, CheckCircle2, DatabaseBackup, Download, FileJson, HardDrive, RotateCcw, ShieldCheck, Upload } from 'lucide-react';
import { PageIntro, SectionTitle } from '../components/AppLayout';
import { useInventory } from '../hooks/useInventory';
import type { InventoryData } from '../interfaces/inventory';
import { makeBackup, MAX_BACKUP_FILE_BYTES, readBackup } from '../utils/backup';

export function SettingsPage() {
  const { products, categories, movements, restoreInventory, resetDemoInventory } = useInventory();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [staged, setStaged] = useState<{ filename: string; data: InventoryData } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const downloadBackup = () => {
    try {
      const json = makeBackup({ products, categories, movements });
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stockpilot-yedek-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setError('');
      setSuccess('JSON yedek dosyası indirilmeye hazırlandı. Dosyayı güvenli bir yere kaydedin.');
    } catch (reason) {
      setSuccess('');
      setError(reason instanceof Error ? reason.message : 'Yedek dosyası oluşturulamadı.');
    }
  };

  const pickFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setStaged(null);
    setError('');
    setSuccess('');
    if (!file) return;
    try {
      if (file.size > MAX_BACKUP_FILE_BYTES) throw new Error('Dosya boyutu 2 MB sınırını aşıyor.');
      if (!file.name.toLowerCase().endsWith('.json')) throw new Error('Lütfen .json uzantılı bir StockPilot yedeği seçin.');
      const data = readBackup(await file.text());
      setStaged({ filename: file.name, data });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Yedek dosyası okunamadı.');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const restore = () => {
    if (!staged) return;
    if (!window.confirm(`"${staged.filename}" yedeğini yüklemek istediğinize emin misiniz?\n\nTarayıcıdaki mevcut ürün, kategori ve stok hareketleri bu dosyadakilerle DEĞİŞTİRİLECEK. Önce mevcut verilerin yedeğini almanız önerilir.`)) return;
    try {
      restoreInventory(staged.data);
      setStaged(null);
      setError('');
      setSuccess('Yedek geri yüklendi. Tüm sayfalardaki veriler güncellendi.');
    } catch (reason) {
      setSuccess('');
      setError(reason instanceof Error ? reason.message : 'Geri yükleme başarısız.');
    }
  };

  const resetDemo = () => {
    if (!window.confirm('UYARI: Mevcut envanterin tamamı örnek verilerle değiştirilecektir. Bu işlem geri alınamaz. Önce yedek aldınız mı?')) return;
    resetDemoInventory();
    setStaged(null);
    setError('');
    setSuccess('Örnek envanter yeniden oluşturuldu.');
  };

  return <>
    <PageIntro eyebrow="ENVANTER / AYARLAR" title="Veri yedekleme ve geri yükleme" description="Envanterinizi bilgisayarınıza kaydedin ve gerektiğinde aynı biçimde geri yükleyin." />
    <div className="mb-6 flex flex-wrap gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
      <AlertTriangle size={19} className="mt-0.5 shrink-0" />
      <p><strong>Bu uygulama eğitim amaçlıdır.</strong> Veriler hesabınıza veya sunucuya değil, yalnızca mevcut tarayıcının LocalStorage alanına kaydedilir. Tarayıcı verileri silinirse kayıtlar kaybolabilir. Düzenli JSON yedeği alın.</p>
    </div>
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="panel p-6">
        <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600"><DatabaseBackup size={22}/></div>
        <SectionTitle title="1. Envanteri dışa aktar" description="Ürünler, kategoriler ve tüm stok hareketlerini tek JSON dosyasında saklayın." />
        <div className="mb-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-50 p-3"><strong className="block text-lg text-slate-900">{products.length}</strong><span className="text-[11px] text-slate-500">Ürün</span></div>
          <div className="rounded-xl bg-slate-50 p-3"><strong className="block text-lg text-slate-900">{categories.length}</strong><span className="text-[11px] text-slate-500">Kategori</span></div>
          <div className="rounded-xl bg-slate-50 p-3"><strong className="block text-lg text-slate-900">{movements.length}</strong><span className="text-[11px] text-slate-500">Hareket</span></div>
        </div>
        <button className="btn-primary w-full" type="button" onClick={downloadBackup}><Download size={17}/> JSON Yedeğini İndir</button>
        <p className="mt-3 flex items-center gap-2 text-[11px] text-slate-500"><ShieldCheck size={15}/> İndirilen dosya uygulama tarafından hiçbir sunucuya gönderilmez.</p>
      </section>

      <section className="panel p-6">
        <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600"><Upload size={22}/></div>
        <SectionTitle title="2. Yedeği içe aktar" description="Önce dosya doğrulanır; mevcut verileriniz onay verene kadar korunur." />
        <label className="form-label" htmlFor="backup-file">StockPilot JSON yedeği (en fazla 2 MB)</label>
        <input ref={inputRef} id="backup-file" aria-label="Yedek dosyası seç" className="form-input" type="file" accept=".json,application/json" onChange={pickFile}/>
        {staged && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900">
          <p className="flex items-center gap-2 font-extrabold"><FileJson size={17}/> {staged.filename}</p>
          <p className="mt-2">Doğrulandı: {staged.data.products.length} ürün, {staged.data.categories.length} kategori, {staged.data.movements.length} hareket.</p>
          <p className="mt-1 font-semibold">Geri yükleme mevcut kayıtların yerini alır.</p>
        </div>}
        <button className="btn-primary mt-5 w-full" type="button" disabled={!staged} onClick={restore}><Upload size={17}/> Onayla ve Yedeği Yükle</button>
      </section>
    </div>

    {error && <div role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}
    {success && <div role="status" className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700"><CheckCircle2 size={18}/>{success}</div>}

    <section className="panel mt-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><HardDrive size={19} className="text-indigo-600"/> Tarayıcı verileri</h3><p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">LocalStorage gerçek bir veritabanı değildir. Veriler cihazlar arasında eşitlenmez. Örnek kayıtları yeniden başlatmak mevcut envanterinizi siler.</p></div>
        <button type="button" className="btn-secondary !border-rose-200 !text-rose-700 hover:!bg-rose-50" onClick={resetDemo}><RotateCcw size={16}/> Örnek Verilere Dön</button>
      </div>
    </section>
  </>;
}
