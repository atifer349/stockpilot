import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoInventory } from '../src/utils/seed.ts';
import { validateInventoryData } from '../src/utils/backup.ts';
import {
  createProduct, editProduct, removeProduct, createCategory, editCategory, removeCategory, recordMovement,
} from '../src/utils/inventoryOperations.ts';

const fixed = { id: 'product-new', now: '2026-10-15T10:00:00.000Z' };
const productInput = (data, changes = {}) => ({
  name: '  Deneme Ürünü  ', sku: ' test-001 ', categoryId: data.categories[0].id,
  purchasePrice: 100, salePrice: 140, stock: 10, minStock: 3, ...changes,
});

test('ürün ekleme alanları temizler; orijinal durumu değiştirmez', () => {
  const original = createDemoInventory();
  const next = createProduct(original, productInput(original), fixed);
  assert.equal(original.products.length, 8);
  assert.equal(next.products.length, 9);
  assert.equal(next.products[0].name, 'Deneme Ürünü');
  assert.equal(next.products[0].sku, 'TEST-001');
  assert.ok(validateInventoryData(next));
});

test('aynı SKU farklı büyük-küçük harflerle de reddedilir', () => {
  const data = createDemoInventory();
  assert.throws(() => createProduct(data, productInput(data, { sku: 'elk-001' })), /SKU/);
});

test('geçersiz kategori, negatif fiyat, küsuratlı stok ve taşan sayılar reddedilir', () => {
  const data = createDemoInventory();
  for (const invalid of [{ categoryId: 'x' }, { salePrice: -1 }, { purchasePrice: Infinity }, { stock: 1.2 }, { minStock: -2 }, { stock: Number.MAX_SAFE_INTEGER + 1 }]) {
    assert.throws(() => createProduct(data, productInput(data, invalid)));
  }
});

test('ürün güncelleme kimliği ve oluşturulma tarihini korur', () => {
  const data = createDemoInventory();
  const original = data.products[0];
  const edited = editProduct(data, original.id, { ...productInput(data), stock: original.stock }, fixed.now).products[0];
  assert.equal(edited.id, original.id);
  assert.equal(edited.createdAt, original.createdAt);
  assert.equal(edited.updatedAt, fixed.now);
  assert.equal(edited.stock, original.stock);
  assert.equal(edited.salePrice, 140);
  assert.equal(data.products[0].salePrice, original.salePrice);
});

test('ürün düzenleme formundan stok değiştirilemez', () => {
  const data = createDemoInventory();
  assert.throws(() => editProduct(data, data.products[0].id, productInput(data, { stock: 500 })), /Stok Hareketleri/);
});

test('ürün silme, geçmiş stok hareketlerini korur', () => {
  const data = createDemoInventory();
  const next = removeProduct(data, 'p1');
  assert.equal(next.products.find(p => p.id === 'p1'), undefined);
  assert.ok(next.movements.some(m => m.productId === 'p1'));
  assert.ok(validateInventoryData(next));
});

test('kategori ekleme, düzenleme ve silme', () => {
  const initial = createDemoInventory();
  const created = createCategory(initial, '  Yeni  ', '#6366f1', 'new-c');
  assert.equal(created.categories.at(-1).name, 'Yeni');
  const edited = editCategory(created, 'new-c', 'Güncel', '#10b981');
  assert.equal(edited.categories.at(-1).name, 'Güncel');
  const deleted = removeCategory(edited, 'new-c');
  assert.deepEqual(deleted.categories, initial.categories);
  assert.ok(validateInventoryData(deleted));
});

test('aynı isimli kategori ve bağlı kategori silme reddedilir', () => {
  const data = createDemoInventory();
  assert.throws(() => createCategory(data, 'elektronik', '#6366f1'), /zaten var/);
  assert.throws(() => removeCategory(data, 'c1'), /bağlı ürünler/);
  assert.throws(() => createCategory(data, 'Test', 'red'), /rengi/);
});

test('giriş-çıkış stok miktarını günceller, yeni hareket yazar', () => {
  const data = createDemoInventory();
  const entered = recordMovement(data, 'p1', 'in', 12, '  Giriş  ', fixed);
  assert.equal(entered.products[0].stock, 96);
  assert.equal(entered.movements[0].note, 'Giriş');
  const exited = recordMovement(entered, 'p1', 'out', 30, 'Çıkış', { id: 'movement-second', now: fixed.now });
  assert.equal(exited.products[0].stock, 66);
  assert.equal(exited.movements.length, data.movements.length + 2);
  assert.equal(data.products[0].stock, 84);
  assert.ok(validateInventoryData(exited));
});

test('stoktan fazla çıkış, kesirli miktar ve tanınmayan hareket türü reddedilir', () => {
  const data = createDemoInventory();
  assert.throws(() => recordMovement(data, 'p1', 'out', 85, ''), /Yetersiz stok/);
  assert.throws(() => recordMovement(data, 'p1', 'in', 1.5, ''), /tam sayı/);
  assert.throws(() => recordMovement(data, 'p1', 'invalid', 1, ''), /Geçersiz/);
  assert.throws(() => recordMovement(data, 'none', 'in', 1, ''), /ürün/);
});

test('stok eklemede güvenli tam sayı sınırı aşılamaz', () => {
  const data = createDemoInventory();
  const maxData = { ...data, products: data.products.map(p => p.id === 'p1' ? { ...p, stock: Number.MAX_SAFE_INTEGER } : p) };
  assert.throws(() => recordMovement(maxData, 'p1', 'in', 1, ''), /sayı sınırını/);
});

