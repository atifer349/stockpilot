import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatNumber } from '../utils/format';

export interface StockCategoryRow { name: string; adet: number }

export default function StockCategoryChart({ data }: { data: StockCategoryRow[] }) {
  return <div className="h-[310px] w-full" role="img" aria-label="Kategorilere göre stok adetleri grafiği">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -22, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#edf1f6" />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} interval={0} />
        <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value: unknown) => [formatNumber(Number(value) || 0), 'Stok Adedi'] as [string, string]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 12px 30px rgba(0,0,0,.07)' }}/>
        <Bar dataKey="adet" fill="#6366f1" radius={[7, 7, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  </div>;
}
