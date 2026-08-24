import { Archive, Mail, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  deleteLead,
  fetchContactLeads,
  retryLeadNotification,
  updateLeadStatus,
  type ContactLead,
  type LeadStatus,
} from "../../lib/adminApi";

const filters: Array<{ value: LeadStatus | "all"; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "new", label: "Nuevos" },
  { value: "read", label: "Leídos" },
  { value: "archived", label: "Archivados" },
];

export default function AdminContacts() {
  const [filter, setFilter] = useState<LeadStatus | "all">("new");
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLeads(await fetchContactLeads(filter === "all" ? undefined : filter));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudieron cargar los contactos.",
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);
  useEffect(() => {
    void load();
  }, [load]);
  async function action(id: string, operation: () => Promise<void>) {
    setBusy(id);
    setError(null);
    try {
      await operation();
      await load();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "La operación falló.",
      );
    } finally {
      setBusy(null);
    }
  }
  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase">
            Contactos
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Leads recibidos desde la web y estado de sus alertas.
          </p>
        </div>
        <button className="admin-secondary-button" onClick={() => void load()}>
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </header>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            className={
              filter === item.value
                ? "admin-primary-button"
                : "admin-secondary-button"
            }
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="admin-state">Cargando contactos…</p>
      ) : leads.length === 0 ? (
        <p className="admin-state">No hay contactos en esta categoría.</p>
      ) : (
        <div className="grid gap-4">
          {leads.map((lead) => (
            <article
              key={lead.id}
              className="premium-card rounded-[24px] border border-sky-300/14 bg-[#071126]/80 p-5"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="font-black">{lead.name}</h2>
                  <a
                    className="text-sm text-sky-300"
                    href={`mailto:${lead.email}`}
                  >
                    {lead.email}
                  </a>
                  <p className="mt-1 text-xs text-slate-400">
                    {lead.projectTypeLabel} ·{" "}
                    {new Intl.DateTimeFormat("es-PY", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(lead.createdAt))}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${lead.notificationStatus === "sent" ? "bg-emerald-400/10 text-emerald-300" : lead.notificationStatus === "failed" ? "bg-red-400/10 text-red-300" : "bg-amber-400/10 text-amber-200"}`}
                  >
                    Email: {lead.notificationStatus}
                  </span>
                  <span className="rounded-full bg-sky-300/10 px-3 py-1 text-xs font-bold text-sky-200">
                    {lead.status}
                  </span>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-[#030918]/70 p-4 text-sm leading-6 text-slate-300">
                {lead.message}
              </p>
              {lead.notificationError && (
                <p className="mt-2 text-xs text-red-300">
                  {lead.notificationError}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {lead.status === "new" && (
                  <button
                    disabled={busy === lead.id}
                    className="admin-small-button"
                    onClick={() =>
                      void action(lead.id, () =>
                        updateLeadStatus(lead.id, "read"),
                      )
                    }
                  >
                    Marcar leído
                  </button>
                )}
                {lead.status !== "archived" && (
                  <button
                    disabled={busy === lead.id}
                    className="admin-small-button"
                    onClick={() =>
                      void action(lead.id, () =>
                        updateLeadStatus(lead.id, "archived"),
                      )
                    }
                  >
                    <Archive className="h-3.5 w-3.5" />
                    Archivar
                  </button>
                )}
                {lead.notificationStatus === "failed" && (
                  <button
                    disabled={busy === lead.id}
                    className="admin-small-button"
                    onClick={() =>
                      void action(lead.id, () => retryLeadNotification(lead.id))
                    }
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Reintentar alerta
                  </button>
                )}
                <button
                  disabled={busy === lead.id}
                  className="admin-small-button text-red-300"
                  onClick={() => {
                    if (
                      window.confirm("¿Eliminar definitivamente este contacto?")
                    )
                      void action(lead.id, () => deleteLead(lead.id));
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
