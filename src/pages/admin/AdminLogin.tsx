import { type FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const { isAuthenticated, isDemoMode, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) setError(signInError);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020614] px-5 py-16 text-white">
      <div className="premium-card w-full max-w-sm rounded-[26px] border border-sky-300/14 bg-[#071126]/88 p-7 shadow-[0_34px_120px_rgba(0,0,0,0.42)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-300/12 text-sky-200">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">Speedcode Lab</p>
            <h1 className="font-heading text-lg font-black uppercase text-white">Panel de administración</h1>
          </div>
        </div>

        {isDemoMode && (
          <p className="mt-5 rounded-2xl border border-amber-300/25 bg-amber-400/10 px-4 py-3 text-xs font-semibold leading-5 text-amber-200">
            Modo demo local: Supabase todavía no está conectado. Cualquier email y contraseña te deja entrar, y los
            cambios que hagas no se guardan de forma permanente.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="text-xs font-semibold text-slate-300">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              placeholder="admin@speedcodelab.com"
              className="mt-2 h-12 w-full rounded-2xl border border-sky-300/14 bg-[#030918] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15"
            />
          </label>

          <label className="text-xs font-semibold text-slate-300">
            Contraseña
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              className="mt-2 h-12 w-full rounded-2xl border border-sky-300/14 bg-[#030918] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15"
            />
          </label>

          {error && <p className="text-xs font-semibold text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-300 text-sm font-black uppercase text-white transition hover:shadow-[0_16px_42px_rgba(14,165,233,0.28)] disabled:opacity-60"
          >
            {submitting ? 'Ingresando…' : 'Ingresar'}
            <LogIn className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
