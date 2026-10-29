import { type FormEvent, useState } from "react";
import { Lock, LogIn } from "lucide-react";
import { Navigate } from "react-router-dom";
import { adminRoutes } from "../../config/admin";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLogin() {
  const {
    configured,
    error: authError,
    isAdmin,
    isAuthenticated,
    signIn,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  if (isAuthenticated && isAdmin)
    return <Navigate to={adminRoutes.content} replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await signIn(email, password);
    setSubmitting(false);
    setError(result.error);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020614] px-5 text-white">
      <section className="premium-card w-full max-w-sm rounded-[26px] border border-sky-300/14 bg-[#071126]/90 p-7">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-sky-300/12 p-3 text-sky-200">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-sky-300">
              Speedcode Lab
            </p>
            <h1 className="font-heading text-lg font-black uppercase">
              Acceso privado
            </h1>
          </div>
        </div>
        {!configured && (
          <p
            role="alert"
            className="mt-5 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-200"
          >
            El panel no está configurado en este entorno.
          </p>
        )}
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="text-xs font-semibold text-slate-300">
            Email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
            />
          </label>
          <label className="text-xs font-semibold text-slate-300">
            Contraseña
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
            />
          </label>
          {(error || authError) && (
            <p role="alert" className="text-sm text-red-300">
              {error || authError}
            </p>
          )}
          <button
            disabled={submitting || !configured}
            className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-300 text-sm font-black uppercase disabled:opacity-50"
          >
            {submitting ? "Verificando…" : "Ingresar"}
            <LogIn className="h-4 w-4" />
          </button>
        </form>
      </section>
    </main>
  );
}
