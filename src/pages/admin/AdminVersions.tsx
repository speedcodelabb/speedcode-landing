import { History, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminDraft } from "../../context/AdminDraftContext";
import { fetchVersions, restoreVersion } from "../../lib/adminApi";
import type { ContentVersion } from "../../lib/siteContent";

export default function AdminVersions() {
  const { reload } = useAdminDraft();
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function load() {
    setLoading(true);
    setError(null);
    try {
      setVersions(await fetchVersions());
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo cargar el historial.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function restore(version: number) {
    if (
      !window.confirm(
        `¿Copiar la versión ${version} al borrador? Esto no la publicará.`,
      )
    )
      return;
    setBusy(version);
    setError(null);
    setMessage(null);
    try {
      await restoreVersion(version);
      await reload();
      setMessage(
        `Versión ${version} restaurada al borrador. Revisala y publicala cuando estés listo.`,
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo restaurar la versión.",
      );
    } finally {
      setBusy(null);
    }
  }
  return (
    <div className="grid gap-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase">
            Versiones
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Se conservan los últimos 20 snapshots publicados.
          </p>
        </div>
        <button className="admin-secondary-button" onClick={() => void load()}>
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </header>
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="admin-success">
          {message}
        </p>
      )}
      {loading ? (
        <p className="admin-state">Cargando versiones…</p>
      ) : (
        <div className="grid gap-3">
          {versions.map((item) => (
            <article
              key={item.version}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sky-300/14 bg-[#071126]/80 p-5"
            >
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-sky-300" />
                <div>
                  <h2 className="font-black">Versión {item.version}</h2>
                  <p className="text-xs text-slate-400">
                    {new Intl.DateTimeFormat("es-PY", {
                      dateStyle: "long",
                      timeStyle: "short",
                    }).format(new Date(item.publishedAt))}
                  </p>
                </div>
              </div>
              <button
                disabled={busy === item.version}
                className="admin-secondary-button"
                onClick={() => void restore(item.version)}
              >
                {busy === item.version
                  ? "Restaurando…"
                  : "Restaurar al borrador"}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
