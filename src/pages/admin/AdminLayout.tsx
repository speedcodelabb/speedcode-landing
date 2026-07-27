import { Link, NavLink, Outlet } from 'react-router-dom';
import { ExternalLink, FileText, Images, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Contenido', icon: FileText, end: true },
  { to: '/admin/portafolio', label: 'Portafolio', icon: Images, end: false },
];

export default function AdminLayout() {
  const { isDemoMode, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#020614] text-white">
      {isDemoMode && (
        <div className="border-b border-amber-300/25 bg-amber-400/10 px-5 py-2.5 text-center text-xs font-semibold text-amber-200">
          Modo demo local — Supabase no está conectado. Los cambios se ven en esta sesión pero no se guardan.
        </div>
      )}

      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-8 md:flex-row md:px-8">
        <aside className="premium-card h-fit rounded-[24px] border border-sky-300/14 bg-[#071126]/80 p-4 md:w-56 md:shrink-0">
          <p className="px-2 text-xs font-black uppercase tracking-[0.2em] text-sky-300">Administración</p>
          <nav className="mt-4 grid gap-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition ${
                    isActive ? 'bg-sky-300/12 text-sky-200' : 'text-slate-300 hover:bg-sky-300/8 hover:text-sky-100'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/"
            className="mt-4 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-sky-300/8 hover:text-sky-100"
          >
            <ExternalLink className="h-4 w-4" />
            Ver sitio
          </Link>

          <button
            type="button"
            onClick={() => signOut()}
            className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-red-400/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
