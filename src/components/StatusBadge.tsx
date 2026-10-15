import { isLowStock } from '../utils/format';

export function StatusBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock === 0) return <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700">Stok Tükendi</span>;
  if (isLowStock(stock, minStock)) return <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">Kritik Stok</span>;
  return <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Stokta</span>;
}
