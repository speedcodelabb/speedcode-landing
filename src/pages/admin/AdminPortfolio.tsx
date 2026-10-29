import {
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Plus,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAdminDraft } from "../../context/AdminDraftContext";
import { deleteMedia, uploadMedia } from "../../lib/adminApi";
import { getPublicMediaUrl, type PortfolioItem } from "../../lib/siteContent";

const blankItem = (): PortfolioItem => ({
  id: crypto.randomUUID(),
  name: "",
  industry: "",
  metric: "",
  result: "",
  imagePath: null,
  link: null,
});

export default function AdminPortfolio() {
  const {
    content,
    loading,
    busy,
    dirty,
    message,
    error,
    save,
    publish,
    setContent,
  } = useAdminDraft();
  const [uploading, setUploading] = useState<string | null>(null);
  const [pendingDeletes, setPendingDeletes] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  if (loading) return <p className="admin-state">Cargando portafolio…</p>;
  if (!content)
    return (
      <p className="admin-error">{error ?? "No se pudo cargar el borrador."}</p>
    );
  const items = content.portfolio.items;
  const updateItems = (next: PortfolioItem[]) =>
    setContent({
      ...content,
      portfolio: { ...content.portfolio, items: next },
    });
  const patchItem = (id: string, patch: Partial<PortfolioItem>) =>
    updateItems(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );

  async function upload(item: PortfolioItem, file: File | null) {
    if (!file) return;
    setUploading(item.id);
    setLocalError(null);
    try {
      const nextPath = await uploadMedia(file);
      if (item.imagePath)
        setPendingDeletes((paths) => [...new Set([...paths, item.imagePath!])]);
      patchItem(item.id, { imagePath: nextPath });
    } catch (caught) {
      setLocalError(
        caught instanceof Error
          ? caught.message
          : "No se pudo subir la imagen.",
      );
    } finally {
      setUploading(null);
    }
  }

  async function removeImage(item: PortfolioItem) {
    if (
      !item.imagePath ||
      !window.confirm(
        "¿Quitar esta imagen? El archivo solo se borrará si ninguna versión lo usa.",
      )
    )
      return;
    const path = item.imagePath;
    patchItem(item.id, { imagePath: null });
    setPendingDeletes((paths) => [...new Set([...paths, path])]);
  }

  async function saveAndClean() {
    if (!(await save())) return;
    const retained: string[] = [];
    for (const path of pendingDeletes) {
      try {
        await deleteMedia(path);
      } catch {
        retained.push(path);
      }
    }
    setPendingDeletes(retained);
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase">
            Portafolio
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Editá proyectos, enlaces HTTPS, imágenes y orden. Los cambios quedan
            en borrador.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            disabled={busy || !dirty}
            onClick={() => void saveAndClean()}
            className="admin-secondary-button"
          >
            <Save className="h-4 w-4" />
            Guardar
          </button>
          <button
            disabled={busy}
            onClick={() => {
              if (window.confirm("¿Publicar todo el borrador?")) void publish();
            }}
            className="admin-primary-button"
          >
            <Send className="h-4 w-4" />
            Publicar
          </button>
        </div>
      </header>
      {(error || localError) && (
        <p role="alert" className="admin-error">
          {error || localError}
        </p>
      )}
      {message && (
        <p role="status" className="admin-success">
          {message}
        </p>
      )}
      <section className="premium-card rounded-[26px] border border-sky-300/14 bg-[#071126]/80 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="admin-label">
            Etiqueta
            <input
              className="admin-input"
              value={content.portfolio.eyebrow}
              onChange={(e) =>
                setContent({
                  ...content,
                  portfolio: { ...content.portfolio, eyebrow: e.target.value },
                })
              }
            />
          </label>
          <label className="admin-label">
            CTA
            <input
              className="admin-input"
              value={content.portfolio.ctaLabel}
              onChange={(e) =>
                setContent({
                  ...content,
                  portfolio: { ...content.portfolio, ctaLabel: e.target.value },
                })
              }
            />
          </label>
          <label className="admin-label">
            Título
            <input
              className="admin-input"
              value={content.portfolio.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  portfolio: { ...content.portfolio, title: e.target.value },
                })
              }
            />
          </label>
          <label className="admin-label">
            Destacado
            <input
              className="admin-input"
              value={content.portfolio.highlight}
              onChange={(e) =>
                setContent({
                  ...content,
                  portfolio: {
                    ...content.portfolio,
                    highlight: e.target.value,
                  },
                })
              }
            />
          </label>
        </div>
      </section>
      <button
        type="button"
        onClick={() => updateItems([...items, blankItem()])}
        className="admin-secondary-button w-fit"
      >
        <Plus className="h-4 w-4" />
        Nuevo proyecto
      </button>
      <div className="grid gap-4">
        {items.length === 0 && (
          <p className="admin-state">
            No hay proyectos. Podés publicar este estado vacío o agregar uno.
          </p>
        )}
        {items.map((item, index) => {
          const imageUrl = getPublicMediaUrl(item.imagePath);
          return (
            <article
              key={item.id}
              className="premium-card rounded-[26px] border border-sky-300/14 bg-[#071126]/80 p-5"
            >
              <div className="mb-4 flex justify-end gap-1">
                <button
                  className="admin-icon-button"
                  disabled={index === 0}
                  aria-label="Subir proyecto"
                  onClick={() => {
                    const next = [...items];
                    [next[index - 1], next[index]] = [
                      next[index],
                      next[index - 1],
                    ];
                    updateItems(next);
                  }}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  className="admin-icon-button"
                  disabled={index === items.length - 1}
                  aria-label="Bajar proyecto"
                  onClick={() => {
                    const next = [...items];
                    [next[index + 1], next[index]] = [
                      next[index],
                      next[index + 1],
                    ];
                    updateItems(next);
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  className="admin-icon-button text-red-300"
                  aria-label="Eliminar proyecto"
                  onClick={() => {
                    if (
                      window.confirm(
                        `¿Eliminar ${item.name || "este proyecto"} del borrador?`,
                      )
                    ) {
                      if (item.imagePath)
                        setPendingDeletes((paths) => [
                          ...new Set([...paths, item.imagePath!]),
                        ]);
                      updateItems(
                        items.filter((existing) => existing.id !== item.id),
                      );
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <div>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-32 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-sky-300/20 text-slate-500">
                      <ImagePlus />
                    </div>
                  )}
                  <label className="admin-small-button mt-3 cursor-pointer justify-center">
                    {uploading === item.id ? "Subiendo…" : "Elegir imagen"}
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={uploading === item.id}
                      onChange={(e) =>
                        void upload(item, e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                  {item.imagePath && (
                    <button
                      type="button"
                      onClick={() => void removeImage(item)}
                      className="mt-2 w-full text-xs text-red-300"
                    >
                      Quitar imagen
                    </button>
                  )}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="admin-label">
                    Nombre
                    <input
                      className="admin-input"
                      value={item.name}
                      onChange={(e) =>
                        patchItem(item.id, { name: e.target.value })
                      }
                    />
                  </label>
                  <label className="admin-label">
                    Industria
                    <input
                      className="admin-input"
                      value={item.industry}
                      onChange={(e) =>
                        patchItem(item.id, { industry: e.target.value })
                      }
                    />
                  </label>
                  <label className="admin-label">
                    Métrica
                    <input
                      className="admin-input"
                      value={item.metric}
                      onChange={(e) =>
                        patchItem(item.id, { metric: e.target.value })
                      }
                    />
                  </label>
                  <label className="admin-label">
                    Enlace HTTPS opcional
                    <input
                      type="url"
                      className="admin-input"
                      value={item.link ?? ""}
                      onChange={(e) =>
                        patchItem(item.id, { link: e.target.value || null })
                      }
                    />
                  </label>
                  <label className="admin-label md:col-span-2">
                    Resultado
                    <textarea
                      className="admin-textarea"
                      value={item.result}
                      onChange={(e) =>
                        patchItem(item.id, { result: e.target.value })
                      }
                    />
                  </label>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
