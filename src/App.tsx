import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ADMIN_BASE_PATH } from "./config/admin";
import { SiteContentProvider } from "./context/SiteContentContext";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";

const AdminRouter = lazy(() => import("./pages/admin/AdminRouter"));

export default function App() {
  return (
    <SiteContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path={`${ADMIN_BASE_PATH}/*`}
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center bg-[#020614] text-slate-300">
                    Cargando panel…
                  </div>
                }
              >
                <AdminRouter />
              </Suspense>
            }
          />
          <Route
            path="/admin/*"
            element={
              <div className="flex min-h-screen items-center justify-center bg-[#020614] text-white">
                <h1 className="text-2xl font-black">404</h1>
              </div>
            }
          />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SiteContentProvider>
  );
}
