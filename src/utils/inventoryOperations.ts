import type { InventoryData, MovementType, ProductInput } from '../interfaces/inventory';

/** Saf iş kuralları: React veya LocalStorage bağımlılığı olmadan test edilebilir. */
type RecordIdentity = { id?: string; now?: string };
const uniqueId = (value?: string) => value ?? crypto.randomUUID();
const timestamp = (value?: string) => value ?? new Date().toISOString();
const fold = (value: string) => value.trim().toLocaleLowerCase('tr-TR');

function cleanProduct(input: ProductInput): ProductInput {
  return { ...input, name: input.name.trim(), sku: input.sku.trim().toUpperCase() };
}

function assertProduct(input: ProductInput, data: InventoryData, excludeId?: string) {
  if (!input.name || !input.sku || input.name.length > 120 || input.sku.length > 40) {
    throw new Error('Ürün adı (en fazla 120 karakter) ve SKU (en fazla 40 karakter) zorunludur.');
  }
  if (!data.categories.some(c => c.id === input.categoryId)) throw new Error('Geçerli bir kategori seçmelisiniz.');
  if (data.products.some(p => fold(p.sku) === fold(input.sku) && p.id !== excludeId)) {
    throw new Error('Bu SKU başka bir üründe kullanılıyor.');
  }
  for (const price of [input.purchasePrice, input.salePrice]) {
    if (!Number.isFinite(price) || price < 0 || price > 1_000_000_000_000) {
      throw new Error('Fiyatlar geçerli ve negatif olmayan sayılar olmalıdır.');
    }
  }
  for (const number of [input.stock, input.minStock]) {
    if (!Number.isSafeInteger(number) || number < 0) throw new Error('Stok miktarları negatif olmayan tam sayılar olmalıdır.');
  }
}

export function createProduct(data: InventoryData, raw: ProductInput, identity: RecordIdentity = {}): InventoryData {
  if (data.products.length >= 20_000) throw new Error('Ürün sınırına ulaşıldı.');
  const input = cleanProduct(raw);
  assertProduct(input, data);
  const id = uniqueId(identity.id);
  if (data.products.some(p => p.id === id)) throw new Error('Ürün kimliği zaten kullanılıyor.');
  const now = timestamp(identity.now);
  return { ...data, products: [{ ...input, id, createdAt: now, updatedAt: now }, ...data.products] };
}

export function editProduct(data: InventoryData, id: string, raw: ProductInput, now?: string): InventoryData {
  const existing = data.products.find(p => p.id === id);
  if (!existing) throw new Error('Ürün bulunamadı.');
  const input = cleanProduct(raw);
  assertProduct(input, data, id);
  if (input.stock !== existing.stock) throw new Error('Mevcut stok yalnızca Stok Hareketleri ekranından değiştirilebilir.');
  return { ...data, products: data.products.map(p => p.id === id ? { ...p, ...input, updatedAt: timestamp(now) } : p) };
}

export function removeProduct(data: InventoryData, id: string): InventoryData {
  if (!data.products.some(p => p.id === id)) throw new Error('Ürün bulunamadı.');
  // Silinen ürünün geçmiş hareketleri muhafaza edilir.
  return { ...data, products: data.products.filter(p => p.id !== id) };
}

function assertCategory(data: InventoryData, name: string, color: string, excludeId?: string): string {
  const value = name.trim();
  if (!value || value.length > 60) throw new Error('Kategori adı 1–60 karakter olmalıdır.');
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error('Geçerli bir kategori rengi seçin.');
  if (data.categories.some(c => c.id !== excludeId && fold(c.name) === fold(value))) throw new Error('Bu kategori zaten var.');
  return value;
}

export function createCategory(data: InventoryData, name: string, color: string, id?: string): InventoryData {
  if (data.categories.length >= 1_000) throw new Error('Kategori sınırına ulaşıldı.');
  const value = assertCategory(data, name, color);
  const key = uniqueId(id);
  if (data.categories.some(c => c.id === key)) throw new Error('Kategori kimliği zaten kullanılıyor.');
  return { ...data, categories: [...data.categories, { id: key, name: value, color }] };
}

export function editCategory(data: InventoryData, id: string, name: string, color: string): InventoryData {
  if (!data.categories.some(c => c.id === id)) throw new Error('Kategori bulunamadı.');
  const value = assertCategory(data, name, color, id);
  return { ...data, categories: data.categories.map(c => c.id === id ? { ...c, name: value, color } : c) };
}

export function removeCategory(data: InventoryData, id: string): InventoryData {
  if (!data.categories.some(c => c.id === id)) throw new Error('Kategori bulunamadı.');
  if (data.products.some(p => p.categoryId === id)) {
    throw new Error('Bu kategoriye bağlı ürünler var. Önce ürünlerin kategorisini değiştirin.');
  }
  return { ...data, categories: data.categories.filter(c => c.id !== id) };
}

export function recordMovement(
  data: InventoryData, productId: string, type: MovementType, quantity: number,
  note: string, identity: RecordIdentity = {},
): InventoryData {
  const product = data.products.find(p => p.id === productId);
  if (!product) throw new Error('Geçerli bir ürün seçin.');
  if (type !== 'in' && type !== 'out') throw new Error('Geçersiz hareket türü.');
  if (!Number.isSafeInteger(quantity) || quantity <= 0) throw new Error('Miktar sıfırdan büyük güvenli bir tam sayı olmalıdır.');
  if (type === 'out' && quantity > product.stock) throw new Error('Yetersiz stok: çıkış miktarı mevcut stoğu aşamaz.');
  if (typeof note !== 'string' || note.trim().length > 250) throw new Error('Açıklama en fazla 250 karakter olabilir.');
  const nextStock = type === 'in' ? product.stock + quantity : product.stock - quantity;
  if (!Number.isSafeInteger(nextStock)) throw new Error('Stok miktarı güvenli sayı sınırını aşamaz.');
  if (data.movements.length >= 50_000) throw new Error('Stok hareketi sınırına ulaşıldı.');
  const id = uniqueId(identity.id);
  if (data.movements.some(m => m.id === id)) throw new Error('Hareket kimliği zaten kullanılıyor.');
  const now = timestamp(identity.now);
  return {
    ...data,
    products: data.products.map(p => p.id === productId ? { ...p, stock: nextStock, updatedAt: now } : p),
    movements: [{ id, productId, productName: product.name, type, quantity, note: note.trim(), createdAt: now }, ...data.movements],
  };
}
