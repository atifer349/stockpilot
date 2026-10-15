import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { InventoryProvider } from './context/InventoryContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </BrowserRouter>
  </StrictMode>,
);
