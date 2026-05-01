/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Automation from './pages/services/Automation';
import WebDev from './pages/services/WebDev';
import DesktopApps from './pages/services/DesktopApps';
import DataAnalysis from './pages/services/DataAnalysis';
import Consultancy from './pages/services/Consultancy';
import SaaS from './pages/services/SaaS';
import Maintenance from './pages/services/Maintenance';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicios/automatizacion" element={<Automation />} />
            <Route path="/servicios/desarrollo-web" element={<WebDev />} />
            <Route path="/servicios/apps-escritorio" element={<DesktopApps />} />
            <Route path="/servicios/analisis-datos" element={<DataAnalysis />} />
            <Route path="/servicios/consultoria" element={<Consultancy />} />
            <Route path="/servicios/saas" element={<SaaS />} />
            <Route path="/servicios/mantenimiento" element={<Maintenance />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
