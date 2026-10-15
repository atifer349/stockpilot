export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value);

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('tr-TR').format(value);

export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

export const isLowStock = (stock: number, minStock: number): boolean =>
  stock <= minStock;
