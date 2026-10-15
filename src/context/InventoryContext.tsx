import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Category, InventoryData, MovementType, ProductInput } from '../interfaces/inventory';
import { createDemoInventory } from '../utils/seed';
import { validateInventoryData } from '../utils/backup';
import { createProduct, editProduct, removeProduct, createCategory, editCategory, removeCategory, recordMovement } from '../utils/inventoryOperations';

const STORAGE_KEY = 'stockpilot-inventory-v1';

function getStoredInventory(): InventoryData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDemoInventory();
    const data: unknown = JSON.parse(raw);
    if (validateInventoryData(data)) return data;
  } catch (error) { console.warn('Kayıtlı envanter okunamadı:', error); }
  return createDemoInventory();
}

interface InventoryContextValue extends InventoryData {
  addProduct: (input: ProductInput) => void;
  updateProduct: (id: string, input: ProductInput) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  addMovement: (productId: string, type: MovementType, quantity: number, note: string) => void;
  restoreInventory: (data: InventoryData) => void;
  resetDemoInventory: () => void;
  storageError: boolean;
}

export const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryData>(getStoredInventory);
  const [storageError, setStorageError] = useState(false);
  // Birden fazla hızlı işlem, eski render durumunu kullanıp değişiklik kaybetmesin.
  const current = useRef(inventory);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory)); setStorageError(false); }
    catch (error) { console.warn('Veriler kaydedilemedi:', error); setStorageError(true); }
  }, [inventory]);

  const commit = useCallback((operation: (state: InventoryData) => InventoryData) => {
    const next = operation(current.current); // Hata formdaki try/catch'e senkron iletilir.
    current.current = next;
    setInventory(next);
  }, []);

  const addProduct = useCallback((input: ProductInput) => commit(state => createProduct(state, input)), [commit]);
  const updateProduct = useCallback((id: string, input: ProductInput) => commit(state => editProduct(state, id, input)), [commit]);
  const deleteProduct = useCallback((id: string) => commit(state => removeProduct(state, id)), [commit]);
  const addCategory = useCallback((name: string, color: string) => commit(state => createCategory(state, name, color)), [commit]);
  const updateCategory = useCallback((id: string, name: string, color: string) => commit(state => editCategory(state, id, name, color)), [commit]);
  const deleteCategory = useCallback((id: string) => commit(state => removeCategory(state, id)), [commit]);
  const addMovement = useCallback((id: string, type: MovementType, quantity: number, note: string) => commit(state => recordMovement(state, id, type, quantity, note)), [commit]);
  const restoreInventory = useCallback((data: InventoryData) => {
    if (!validateInventoryData(data)) throw new Error('Geri yüklenecek envanter geçerli değil.');
    commit(() => data);
  }, [commit]);
  const resetDemoInventory = useCallback(() => commit(() => createDemoInventory()), [commit]);

  const value = useMemo<InventoryContextValue>(() => ({
    ...inventory, storageError, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, addMovement, restoreInventory, resetDemoInventory,
  }), [inventory, storageError, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, addMovement, restoreInventory, resetDemoInventory]);

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export const CATEGORY_COLORS: Category['color'][] = ['#6366f1', '#0ea5e9', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'];
