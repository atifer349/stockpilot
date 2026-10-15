import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoInventory } from '../src/utils/seed.ts';
import { filterAndSortProducts, paginateItems } from '../src/utils/productTable.ts';

const data = createDemoInventory();
const query = (changes = {}) => ({ search: '', categoryId: 'all', stockFilter: 'all', sort: 'name-asc', ...changes });

test('ürün arama SKU ve Türkçe ürün adlarında çalışır', () => {
  assert.equal(filterAndSortProducts(data.products, query({ search: 'ELK-002' })).length, 1);
  assert.equal(filterAndSortProducts(data.products, query({ search: '  kaĞıdı' })).length, 1);
});

test('kategori ve stok filtresi birlikte uygulanır', () => {
  const out = filterAndSortProducts(data.products, query({ stockFilter: 'out' }));
  assert.equal(out.length, 1);
  assert.equal(out[0].stock, 0);
  const critical = filterAndSortProducts(data.products, query({ categoryId: 'c1', stockFilter: 'critical' }));
  assert.equal(critical.length, 2);
  assert.ok(critical.every(p => p.categoryId === 'c1'));
});

test('fiyat ve stok sıralaması kaynak diziyi değiştirmez', () => {
  const copy = data.products.map(p => p.id);
  const price = filterAndSortProducts(data.products, query({ sort: 'price-desc' }));
  assert.ok(price[0].salePrice >= price[1].salePrice);
  const stock = filterAndSortProducts(data.products, query({ sort: 'stock-asc' }));
  assert.ok(stock[0].stock <= stock[1].stock);
  assert.deepEqual(data.products.map(p => p.id), copy);
});

test('sayfalama, boş liste ve geçersiz sayfaları doğru hesaplar', () => {
  const list = Array.from({length: 24}, (_, i) => i);
  assert.deepEqual(paginateItems(list, 2, 10).items, list.slice(10, 20));
  assert.equal(paginateItems(list, 5, 10).page, 3);
  assert.equal(paginateItems(list, 0, 10).page, 1);
  assert.equal(paginateItems([], 3, 10).from, 0);
  assert.equal(paginateItems([], 3, 10).totalPages, 1);
});
