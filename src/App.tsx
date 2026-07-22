/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminContent from './pages/admin/AdminContent';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import RequireAuth from './components/admin/RequireAuth';
import { SiteContentProvider } from './context/SiteContentContext';

export default function App() {
  return (
    <SiteContentProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<RequireAuth />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminContent />} />
                  <Route path="portafolio" element={<AdminPortfolio />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </SiteContentProvider>
  );
}
