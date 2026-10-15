import type { Category, InventoryData, Product, StockMovement } from '../interfaces/inventory';

/** Dosya formatı sürümü, LocalStorage anahtarından bağımsız tutulur. */
export const BACKUP_VERSION = 1;
export const MAX_BACKUP_FILE_BYTES = 2 * 1024 * 1024;

interface BackupFile {
  app: 'StockPilot';
  version: 1;
  exportedAt: string;
  data: InventoryData;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown, max = 250): value is string =>
  typeof value === 'string' && value.length > 0 && value.length <= max;
const isOptionalText = (value: unknown, max = 250): value is string =>
  typeof value === 'string' && value.length <= max;
const isDate = (value: unknown): value is string =>
  isText(value, 64) && Number.isFinite(Date.parse(value));
const isMoney = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1_000_000_000_000;
const isQuantity = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

function isCategory(value: unknown): value is Category {
  return isRecord(value) &&
    isText(value.id, 80) &&
    isText(value.name, 60) &&
    typeof value.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(value.color);
}

function isProduct(value: unknown): value is Product {
  return isRecord(value) &&
    isText(value.id, 80) && isText(value.name, 120) && isText(value.sku, 40) &&
    isText(value.categoryId, 80) &&
    isMoney(value.purchasePrice) && isMoney(value.salePrice) &&
    isQuantity(value.stock) && isQuantity(value.minStock) &&
    isDate(value.createdAt) && isDate(value.updatedAt);
}

function isMovement(value: unknown): value is StockMovement {
  return isRecord(value) &&
    isText(value.id, 80) && isText(value.productId, 80) && isText(value.productName, 120) &&
    (value.type === 'in' || value.type === 'out') &&
    isQuantity(value.quantity) && value.quantity > 0 &&
    isOptionalText(value.note, 250) && isDate(value.createdAt);
}

function allUnique(values: string[]): boolean { return new Set(values).size === values.length; }

/** İçe aktarılan veriye yalnızca üst düzey dizi kontrolü yapmak yeterli değildir. */
export function validateInventoryData(value: unknown): value is InventoryData {
  if (!isRecord(value) || !Array.isArray(value.categories) || !Array.isArray(value.products) || !Array.isArray(value.movements)) return false;
  if (value.categories.length > 1_000 || value.products.length > 20_000 || value.movements.length > 50_000) return false;
  if (!value.categories.every(isCategory) || !value.products.every(isProduct) || !value.movements.every(isMovement)) return false;
  const categories: Category[] = value.categories;
  const products: Product[] = value.products;
  const movements: StockMovement[] = value.movements;
  const categoryIds = new Set(categories.map(category => category.id));
  return allUnique(categories.map(c => c.id)) &&
    allUnique(categories.map(c => c.name.trim().toLocaleLowerCase('tr-TR'))) &&
    allUnique(products.map(p => p.id)) &&
    allUnique(products.map(p => p.sku.trim().toLocaleLowerCase('tr-TR'))) &&
    allUnique(movements.map(m => m.id)) &&
    products.every(p => categoryIds.has(p.categoryId));
}

export function makeBackup(inventory: InventoryData): string {
  if (!validateInventoryData(inventory)) throw new Error('Envanter tutarsız: güvenli yedek oluşturulamadı.');
  const backup: BackupFile = {
    app: 'StockPilot', version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(), data: inventory,
  };
  return JSON.stringify(backup, null, 2);
}

export function readBackup(text: string): InventoryData {
  if (new Blob([text]).size > MAX_BACKUP_FILE_BYTES) throw new Error('Yedek dosyası 2 MB sınırını geçiyor.');
  let parsed: unknown;
  try { parsed = JSON.parse(text); }
  catch { throw new Error('Dosya geçerli JSON biçiminde değil.'); }
  if (!isRecord(parsed) || parsed.app !== 'StockPilot') throw new Error('Bu dosya StockPilot yedeği değil.');
  if (parsed.version !== BACKUP_VERSION) throw new Error('Bu yedek sürümü desteklenmiyor.');
  if (!isDate(parsed.exportedAt) || !validateInventoryData(parsed.data)) {
    throw new Error('Yedek içeriği eksik veya geçersiz. Mevcut veriler korunmuştur.');
  }
  return parsed.data;
}
