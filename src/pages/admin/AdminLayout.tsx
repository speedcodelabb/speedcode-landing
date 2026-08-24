import {
  Archive,
  ExternalLink,
  FileText,
  History,
  Images,
  LogOut,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { adminRoutes } from "../../config/admin";
import { AdminDraftProvider } from "../../context/AdminDraftContext";
import { useAuth } from "../../hooks/useAuth";

const links = [
  [adminRoutes.content, "Contenido", FileText],
  [adminRoutes.portfolio, "Portafolio", Images],
  [adminRoutes.contacts, "Contactos", Archive],
  [adminRoutes.versions, "Versiones", History],
] as const;

export default function AdminLayout() {
  const { signOut } = useAuth();
  return (
    <div className="min-h-screen bg-[#020614] text-white">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-5 py-8 md:flex-row">
        <aside className="premium-card h-fit rounded-[24px] border border-sky-300/14 bg-[#071126]/80 p-4 md:sticky md:top-6 md:w-56">
          <p className="px-2 text-xs font-black uppercase tracking-[.2em] text-sky-300">
            Administración
          </p>
          <nav className="mt-4 grid gap-1">
            {links.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold ${isActive ? "bg-sky-300/12 text-sky-200" : "text-slate-300 hover:bg-sky-300/8"}`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/"
            target="_blank"
            className="mt-4 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-400"
          >
            <ExternalLink className="h-4 w-4" />
            Ver sitio
          </Link>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-400 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </aside>
        <main className="min-w-0 flex-1">
          <AdminDraftProvider>
            <Outlet />
          </AdminDraftProvider>
        </main>
      </div>
    </div>
  );
}
