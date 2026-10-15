import test from 'node:test';
import assert from 'node:assert/strict';
import { makeBackup, readBackup, validateInventoryData } from '../src/utils/backup.ts';
import { createDemoInventory } from '../src/utils/seed.ts';

const backupOf = (data, overrides = {}) => JSON.stringify({ app: 'StockPilot', version: 1, exportedAt: new Date().toISOString(), data, ...overrides });

test('örnek veriler doğrulamadan geçer', () => {
  const inventory = createDemoInventory();
  assert.equal(validateInventoryData(inventory), true);
  assert.equal(inventory.products.length, 8);
});

test('JSON yedeği ürün, kategori, stok geçmişini koruyarak geri yüklenir', () => {
  const original = createDemoInventory();
  const restored = readBackup(makeBackup(original));
  assert.deepEqual(restored, original);
});

test('bozuk JSON ve alakasız dosya mevcut verilerin yerine geçemez', () => {
  assert.throws(() => readBackup('{ invalid '), /JSON/);
  assert.throws(() => readBackup(JSON.stringify({ app: 'AnotherApp', version: 1, data: {} })), /StockPilot/);
});

test('desteklenmeyen format sürümü reddedilir', () => {
  assert.throws(() => readBackup(backupOf(createDemoInventory(), { version: 5 })), /sürümü/);
});

test('negatif stok ve bozuk ürün reddedilir', () => {
  const inventory = createDemoInventory();
  inventory.products[0].stock = -2;
  assert.equal(validateInventoryData(inventory), false);
  assert.throws(() => readBackup(backupOf(inventory)), /geçersiz/);
});

test('eşleşmeyen kategori ve çift SKU reddedilir', () => {
  const inventory = createDemoInventory();
  inventory.products[0].categoryId = 'olmayan-kategori';
  assert.equal(validateInventoryData(inventory), false);
  inventory.products[0].categoryId = 'c1';
  inventory.products[1].sku = inventory.products[0].sku.toLowerCase();
  assert.equal(validateInventoryData(inventory), false);
});

test('silinmiş ürünün hareket geçmişine izin verilir ama bozuk hareket reddedilir', () => {
  const inventory = createDemoInventory();
  inventory.products = inventory.products.filter(p => p.id !== 'p1');
  assert.equal(validateInventoryData(inventory), true);
  inventory.movements[0].type = 'bogus';
  assert.equal(validateInventoryData(inventory), false);
});

test('içe aktarma dosyası 2 MB sınırına takılır', () => {
  assert.throws(() => readBackup(' '.repeat(2 * 1024 * 1024 + 1)), /2 MB/);
});
