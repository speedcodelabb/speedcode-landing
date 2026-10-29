import {
  ChevronDown,
  ChevronUp,
  Eye,
  Plus,
  RefreshCw,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAdminDraft } from "../../context/AdminDraftContext";
import { SiteContentProvider } from "../../context/SiteContentContext";
import {
  defaultSiteDocument,
  iconKeySchema,
  siteDocumentSchema,
  type SiteDocument,
} from "../../lib/siteContent";
import Home from "../Home";

const labels: Record<string, string> = {
  navigation: "Navegación",
  hero: "Portada",
  services: "Servicios",
  about: "Nosotros",
  values: "Valores",
  faq: "Preguntas frecuentes",
  contact: "Contacto",
  footer: "Pie de página",
  eyebrow: "Etiqueta",
  title: "Título",
  highlight: "Texto destacado",
  subtitle: "Subtítulo",
  description: "Descripción",
  primaryCta: "CTA principal",
  secondaryCta: "CTA secundario",
  items: "Elementos",
  stats: "Estadísticas",
  paragraphs: "Párrafos",
  steps: "Pasos",
  nextSteps: "Próximos pasos",
  projectTypes: "Tipos de proyecto",
  body: "Descripción",
  proof: "Prueba / beneficio",
  question: "Pregunta",
  answer: "Respuesta",
  text: "Texto",
  value: "Valor",
  label: "Etiqueta",
  icon: "Icono",
  email: "Email",
  phoneLabel: "Teléfono visible",
  whatsappNumber: "WhatsApp",
  directWhatsappLabel: "Etiqueta WhatsApp",
  nextStepsTitle: "Título próximos pasos",
  servicesTitle: "Título servicios",
  contactTitle: "Título contacto",
  tagline: "Tagline",
  home: "Inicio",
  portfolio: "Portafolio",
  whatsapp: "WhatsApp",
  methodEyebrow: "Etiqueta método",
  methodTitle: "Título método",
  id: "ID estable",
  ctaLabel: "CTA",
  name: "Nombre",
  industry: "Industria",
  metric: "Métrica",
  result: "Resultado",
  link: "Enlace HTTPS",
  imagePath: "Imagen",
};

const editableSections = [
  "navigation",
  "hero",
  "services",
  "about",
  "values",
  "faq",
  "contact",
  "footer",
] as const;
type Path = Array<string | number>;

function getAt(value: unknown, path: Path): unknown {
  return path.reduce<unknown>(
    (current, key) => (current as Record<string | number, unknown>)[key],
    value,
  );
}

function setAt(
  document: SiteDocument,
  path: Path,
  value: unknown,
): SiteDocument {
  const next = structuredClone(document) as unknown as Record<
    string | number,
    unknown
  >;
  let cursor = next;
  path.slice(0, -1).forEach((key) => {
    cursor = cursor[key] as Record<string | number, unknown>;
  });
  cursor[path.at(-1)!] = value;
  return next as unknown as SiteDocument;
}

function Editor({
  value,
  path,
  onChange,
}: {
  value: unknown;
  path: Path;
  onChange: (path: Path, value: unknown) => void;
}) {
  const key = String(path.at(-1));
  if (typeof value === "string") {
    if (key === "icon")
      return (
        <label className="admin-label">
          {labels[key]}
          <select
            className="admin-input"
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
          >
            {iconKeySchema.options.map((icon) => (
              <option key={icon}>{icon}</option>
            ))}
          </select>
        </label>
      );
    if (key === "id")
      return (
        <label className="admin-label">
          {labels[key]}
          <input className="admin-input opacity-70" value={value} readOnly />
        </label>
      );
    const multiline =
      value.length > 80 ||
      ["description", "body", "answer", "result", "tagline"].includes(key);
    return (
      <label className="admin-label">
        {labels[key] ?? key}
        {multiline ? (
          <textarea
            className="admin-textarea"
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
          />
        ) : (
          <input
            className="admin-input"
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
          />
        )}
      </label>
    );
  }
  if (Array.isArray(value)) {
    const template = getAt(defaultSiteDocument, path);
    return (
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase text-sky-200">
            {labels[key] ?? key}
          </p>
          <button
            type="button"
            className="admin-small-button"
            onClick={() => {
              const nextItem = structuredClone(
                (template as unknown[])?.[0] ?? "",
              );
              if (nextItem && typeof nextItem === "object" && "id" in nextItem)
                nextItem.id = crypto.randomUUID();
              onChange(path, [...value, nextItem]);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar
          </button>
        </div>
        {value.map((item, index) => (
          <div
            key={
              typeof item === "object" && item && "id" in item
                ? String(item.id)
                : index
            }
            className="rounded-2xl border border-sky-300/10 bg-[#030918]/55 p-4"
          >
            <div className="mb-3 flex justify-end gap-1">
              <button
                type="button"
                aria-label="Subir"
                disabled={index === 0}
                onClick={() => {
                  const next = [...value];
                  [next[index - 1], next[index]] = [
                    next[index],
                    next[index - 1],
                  ];
                  onChange(path, next);
                }}
                className="admin-icon-button"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Bajar"
                disabled={index === value.length - 1}
                onClick={() => {
                  const next = [...value];
                  [next[index + 1], next[index]] = [
                    next[index],
                    next[index + 1],
                  ];
                  onChange(path, next);
                }}
                className="admin-icon-button"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Eliminar"
                disabled={value.length === 1}
                onClick={() =>
                  onChange(
                    path,
                    value.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className="admin-icon-button text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Editor value={item} path={[...path, index]} onChange={onChange} />
          </div>
        ))}
      </div>
    );
  }
  if (value && typeof value === "object")
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(value).map(([childKey, child]) => (
          <div
            key={childKey}
            className={
              Array.isArray(child) || (child && typeof child === "object")
                ? "md:col-span-2"
                : ""
            }
          >
            <Editor
              value={child}
              path={[...path, childKey]}
              onChange={onChange}
            />
          </div>
        ))}
      </div>
    );
  return null;
}

function DraftPreview({ content }: { content: SiteDocument }) {
  return (
    <div className="draft-preview max-h-[72vh] overflow-auto rounded-[26px] border border-sky-300/15">
      <SiteContentProvider document={content}>
        <Home />
      </SiteContentProvider>
    </div>
  );
}

export default function AdminContent() {
  const {
    content,
    loading,
    busy,
    dirty,
    message,
    error,
    reload,
    save,
    publish,
    setContent,
  } = useAdminDraft();
  const [preview, setPreview] = useState(false);
  if (loading) return <p className="admin-state">Cargando borrador…</p>;
  if (!content)
    return (
      <div className="admin-state" role="alert">
        <p>{error ?? "No existe un borrador disponible."}</p>
        <button
          className="admin-small-button mx-auto mt-4"
          onClick={() => void reload()}
        >
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </button>
      </div>
    );
  function update(path: Path, value: unknown) {
    if (content) setContent(setAt(content, path, value));
  }
  const validation = siteDocumentSchema.safeParse(content);
  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black uppercase">
            Contenido
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Guardar modifica el borrador. Publicar actualiza todo el sitio de
            forma atómica.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPreview((value) => !value)}
            className="admin-secondary-button"
          >
            <Eye className="h-4 w-4" />
            {preview ? "Editar" : "Vista previa"}
          </button>
          <button
            type="button"
            disabled={busy || !dirty || !validation.success}
            onClick={() => void save()}
            className="admin-secondary-button"
          >
            <Save className="h-4 w-4" />
            Guardar borrador
          </button>
          <button
            type="button"
            disabled={busy || !validation.success}
            onClick={() => {
              if (window.confirm("¿Publicar este borrador en el sitio?"))
                void publish();
            }}
            className="admin-primary-button"
          >
            <Send className="h-4 w-4" />
            Publicar
          </button>
        </div>
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
      {!validation.success && (
        <p role="alert" className="admin-error">
          El documento contiene campos inválidos o vacíos. Revisá los campos
          antes de guardar.
        </p>
      )}
      {preview ? (
        <DraftPreview content={content} />
      ) : (
        editableSections.map((section) => (
          <details
            key={section}
            open={section === "hero"}
            className="premium-card rounded-[26px] border border-sky-300/14 bg-[#071126]/80 p-6"
          >
            <summary className="cursor-pointer text-sm font-black uppercase text-sky-300">
              {labels[section]}
            </summary>
            <div className="mt-5">
              <Editor
                value={content[section]}
                path={[section]}
                onChange={update}
              />
            </div>
          </details>
        ))
      )}
    </div>
  );
}
