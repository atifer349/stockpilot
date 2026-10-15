import type { InventoryData } from '../interfaces/inventory';

/** Yeni tarayıcı oturumunda örnek kayıtlar yalnızca ilk kez oluşturulur. */
export function createDemoInventory(): InventoryData {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  return {
    categories: [
      { id: 'c1', name: 'Elektronik', color: '#6366f1' },
      { id: 'c2', name: 'Ofis Ürünleri', color: '#0ea5e9' },
      { id: 'c3', name: 'Ambalaj', color: '#f59e0b' },
      { id: 'c4', name: 'Aksesuar', color: '#10b981' },
    ],
    products: [
      { id: 'p1', name: 'Kablosuz Mouse M200', sku: 'ELK-001', categoryId: 'c1', purchasePrice: 230, salePrice: 359.9, stock: 84, minStock: 20, createdAt: yesterday, updatedAt: now },
      { id: 'p2', name: 'Mekanik Klavye K80', sku: 'ELK-002', categoryId: 'c1', purchasePrice: 870, salePrice: 1299, stock: 12, minStock: 15, createdAt: yesterday, updatedAt: now },
      { id: 'p3', name: 'A4 Fotokopi Kağıdı 500 Yaprak', sku: 'OFS-001', categoryId: 'c2', purchasePrice: 94, salePrice: 145, stock: 156, minStock: 25, createdAt: yesterday, updatedAt: now },
      { id: 'p4', name: 'Kraft Kargo Kutusu Orta', sku: 'AMB-001', categoryId: 'c3', purchasePrice: 14.5, salePrice: 25.9, stock: 320, minStock: 60, createdAt: yesterday, updatedAt: now },
      { id: 'p5', name: 'USB-C Çoklayıcı 6-in-1', sku: 'ELK-003', categoryId: 'c1', purchasePrice: 495, salePrice: 789, stock: 8, minStock: 10, createdAt: yesterday, updatedAt: now },
      { id: 'p6', name: 'Masaüstü Organizer Seti', sku: 'AKS-001', categoryId: 'c4', purchasePrice: 120, salePrice: 195, stock: 64, minStock: 15, createdAt: yesterday, updatedAt: now },
      { id: 'p7', name: 'Termal Etiket 100x150', sku: 'AMB-002', categoryId: 'c3', purchasePrice: 75, salePrice: 112, stock: 0, minStock: 20, createdAt: yesterday, updatedAt: now },
      { id: 'p8', name: 'A5 Çizgili Defter', sku: 'OFS-002', categoryId: 'c2', purchasePrice: 32, salePrice: 59.9, stock: 118, minStock: 30, createdAt: yesterday, updatedAt: now },
    ],
    movements: [
      { id: 'm1', productId: 'p1', productName: 'Kablosuz Mouse M200', type: 'in', quantity: 40, note: 'Tedarikçi teslimatı', createdAt: now },
      { id: 'm2', productId: 'p2', productName: 'Mekanik Klavye K80', type: 'out', quantity: 3, note: 'Örnek sevkiyat kaydı', createdAt: yesterday },
      { id: 'm3', productId: 'p4', productName: 'Kraft Kargo Kutusu Orta', type: 'in', quantity: 100, note: 'Depo girişi', createdAt: yesterday },
    ],
  };
}
