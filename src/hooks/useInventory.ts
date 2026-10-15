import { useContext } from 'react';
import { InventoryContext } from '../context/InventoryContext';

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory, InventoryProvider içerisinde kullanılmalıdır.');
  return context;
}
