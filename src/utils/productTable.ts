import type { Product } from '../interfaces/inventory';

export type SortMode = 'name-asc' | 'name-desc' | 'stock-asc' | 'stock-desc' | 'price-asc' | 'price-desc';
export type StockFilter = 'all' | 'available' | 'critical' | 'out';

export interface ProductQuery {
  search: string;
  categoryId: string;
  stockFilter: StockFilter;
  sort: SortMode;
}

/** Listeyi dönüştürür, kaynak products dizisini değiştirmez. */
export function filterAndSortProducts(products: Product[], query: ProductQuery): Product[] {
  const term = query.search.trim().toLocaleLowerCase('tr-TR');
  const result = products.filter(p => {
    if (term && !p.name.toLocaleLowerCase('tr-TR').includes(term) && !p.sku.toLocaleLowerCase('tr-TR').includes(term)) return false;
    if (query.categoryId !== 'all' && p.categoryId !== query.categoryId) return false;
    if (query.stockFilter === 'critical' && p.stock > p.minStock) return false;
    if (query.stockFilter === 'available' && p.stock <= p.minStock) return false;
    if (query.stockFilter === 'out' && p.stock !== 0) return false;
    return true;
  });
  const [key, order] = query.sort.split('-');
  const direction = order === 'desc' ? -1 : 1;
  result.sort((a, b) => {
    let compared = 0;
    if (key === 'stock') compared = a.stock - b.stock;
    else if (key === 'price') compared = a.salePrice - b.salePrice;
    else compared = a.name.localeCompare(b.name, 'tr-TR');
    return compared === 0 ? a.sku.localeCompare(b.sku, 'tr-TR') : compared * direction;
  });
  return result;
}

export function paginateItems<T>(items: T[], requestedPage: number, pageSize: number) {
  const safeSize = Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : 10;
  const totalPages = Math.max(1, Math.ceil(items.length / safeSize));
  const page = Math.min(Math.max(Number.isSafeInteger(requestedPage) ? requestedPage : 1, 1), totalPages);
  const start = (page - 1) * safeSize;
  return { page, totalPages, total: items.length, from: items.length ? start + 1 : 0,
    to: Math.min(start + safeSize, items.length), items: items.slice(start, start + safeSize) };
}
