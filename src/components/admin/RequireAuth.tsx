import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function RequireAuth() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020614] text-sm font-semibold text-slate-400">
        Cargando…
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/gestion-speedcode/acceso" replace />;
  }

  return <Outlet />;
}
