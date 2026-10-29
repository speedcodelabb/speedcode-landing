import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "../../components/admin/RequireAuth";
import { adminRoutes } from "../../config/admin";
import { AuthProvider } from "../../hooks/useAuth";

const AdminLogin = lazy(() => import("./AdminLogin"));
const AdminLayout = lazy(() => import("./AdminLayout"));
const AdminContent = lazy(() => import("./AdminContent"));
const AdminPortfolio = lazy(() => import("./AdminPortfolio"));
const AdminContacts = lazy(() => import("./AdminContacts"));
const AdminVersions = lazy(() => import("./AdminVersions"));

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020614] text-sm text-slate-300">
      Cargando panel…
    </div>
  );
}

export default function AdminRouter() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="acceso" element={<AdminLogin />} />
          <Route element={<RequireAuth />}>
            <Route element={<AdminLayout />}>
              <Route
                index
                element={<Navigate to={adminRoutes.content} replace />}
              />
              <Route path="contenido" element={<AdminContent />} />
              <Route path="portafolio" element={<AdminPortfolio />} />
              <Route path="contactos" element={<AdminContacts />} />
              <Route path="versiones" element={<AdminVersions />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
