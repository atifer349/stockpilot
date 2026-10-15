export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductInput = Pick<
  Product,
  'name' | 'sku' | 'categoryId' | 'purchasePrice' | 'salePrice' | 'stock' | 'minStock'
>;

export type MovementType = 'in' | 'out';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  note: string;
  createdAt: string;
}

export interface InventoryData {
  products: Product[];
  categories: Category[];
  movements: StockMovement[];
}
