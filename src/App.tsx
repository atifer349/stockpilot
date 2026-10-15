import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { AppLayout } from './components/AppLayout';

const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const ProductsPage = lazy(() => import('./pages/ProductsPage').then(module => ({ default: module.ProductsPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(module => ({ default: module.CategoriesPage })));
const MovementsPage = lazy(() => import('./pages/MovementsPage').then(module => ({ default: module.MovementsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));

export default function App() {
  return <AppLayout><Suspense fallback={<div role="status" className="panel p-10 text-center text-sm font-semibold text-slate-500">Sayfa yükleniyor...</div>}><Routes>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/categories" element={<CategoriesPage />} />
    <Route path="/movements" element={<MovementsPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense></AppLayout>;
}
