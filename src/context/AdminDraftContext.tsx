import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchDraft, publishDraft, saveDraft } from "../lib/adminApi";
import type { DraftRecord, SiteDocument } from "../lib/siteContent";

type AdminDraftState = {
  draft: DraftRecord | null;
  content: SiteDocument | null;
  loading: boolean;
  busy: boolean;
  dirty: boolean;
  message: string | null;
  error: string | null;
  setContent: (content: SiteDocument) => void;
  reload: () => Promise<void>;
  save: () => Promise<boolean>;
  publish: () => Promise<void>;
};

const AdminDraftContext = createContext<AdminDraftState | null>(null);

export function AdminDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<DraftRecord | null>(null);
  const [content, setContentState] = useState<SiteDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const remote = await fetchDraft();
      setDraft(remote);
      setContentState(remote.content);
      setDirty(false);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo cargar el borrador.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  function setContent(next: SiteDocument) {
    setContentState(next);
    setDirty(true);
    setMessage(null);
  }

  async function save() {
    if (!draft || !content) return false;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const saved = await saveDraft(content, draft.revision);
      setDraft(saved);
      setContentState(saved.content);
      setDirty(false);
      setMessage(`Borrador guardado (revisión ${saved.revision}).`);
      return true;
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el borrador.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!draft || !content) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      let current = draft;
      if (dirty) {
        current = await saveDraft(content, draft.revision);
        setDraft(current);
        setContentState(current.content);
        setDirty(false);
      }
      const version = await publishDraft(current.revision);
      const publishedDraft: DraftRecord = {
        ...current,
        revision: current.revision + 1,
        baseVersion: version,
        updatedAt: new Date().toISOString(),
      };
      setDraft(publishedDraft);
      setContentState(publishedDraft.content);
      setMessage(`Versión ${version} publicada correctamente.`);
      try {
        const refreshed = await fetchDraft();
        setDraft(refreshed);
        setContentState(refreshed.content);
      } catch (refreshError) {
        setError(
          `La versión ${version} se publicó, pero no se pudo recargar el borrador: ${refreshError instanceof Error ? refreshError.message : "error desconocido"}`,
        );
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "No se pudo publicar.",
      );
    } finally {
      setBusy(false);
    }
  }

  const value = useMemo(
    () => ({
      draft,
      content,
      loading,
      busy,
      dirty,
      message,
      error,
      setContent,
      reload,
      save,
      publish,
    }),
    [draft, content, loading, busy, dirty, message, error],
  );
  return (
    <AdminDraftContext.Provider value={value}>
      {children}
    </AdminDraftContext.Provider>
  );
}

export function useAdminDraft() {
  const value = useContext(AdminDraftContext);
  if (!value)
    throw new Error("useAdminDraft debe usarse dentro de AdminDraftProvider");
  return value;
}
