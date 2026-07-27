import { type FormEvent, useState } from 'react';
import { ImagePlus, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { createPortfolioItem, deletePortfolioItem, updatePortfolioItem, uploadPortfolioImage } from '../../lib/adminApi';
import type { PortfolioItem } from '../../lib/siteContent';

const inputClass =
  'mt-2 h-11 w-full min-w-0 rounded-xl border border-sky-300/14 bg-[#030918] px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15';

const textareaClass =
  'mt-2 min-h-20 w-full min-w-0 resize-none rounded-xl border border-sky-300/14 bg-[#030918] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15';

type ItemFormState = {
  name: string;
  industry: string;
  metric: string;
  result: string;
  file: File | null;
  imageUrl: string | null;
};

const emptyForm: ItemFormState = { name: '', industry: '', metric: '', result: '', file: null, imageUrl: null };

function ItemFields({
  form,
  onChange,
}: {
  form: ItemFormState;
  onChange: (patch: Partial<ItemFormState>) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label className="text-xs font-semibold text-slate-300">
        Nombre del proyecto
        <input value={form.name} onChange={(e) => onChange({ name: e.target.value })} className={inputClass} />
      </label>
      <label className="text-xs font-semibold text-slate-300">
        Industria / rubro
        <input value={form.industry} onChange={(e) => onChange({ industry: e.target.value })} className={inputClass} />
      </label>
      <label className="text-xs font-semibold text-slate-300">
        Métrica destacada
        <input value={form.metric} onChange={(e) => onChange({ metric: e.target.value })} className={inputClass} />
      </label>
      <label className="text-xs font-semibold text-slate-300">
        Imagen
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange({ file: e.target.files?.[0] ?? null })}
          className="mt-2 block w-full text-xs text-slate-400 file:mr-3 file:rounded-full file:border-0 file:bg-sky-300/12 file:px-3 file:py-2 file:text-xs file:font-bold file:text-sky-100"
        />
      </label>
      <label className="text-xs font-semibold text-slate-300 md:col-span-2">
        Resultado / descripción
        <textarea value={form.result} onChange={(e) => onChange({ result: e.target.value })} className={textareaClass} />
      </label>
    </div>
  );
}

export default function AdminPortfolio() {
  const { portfolioItems, setPortfolioItems } = useSiteContent();
  const [newForm, setNewForm] = useState<ItemFormState>(emptyForm);
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ItemFormState>(emptyForm);
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);

    const imageUrl = newForm.file ? await uploadPortfolioImage(newForm.file) : newForm.imageUrl;
    const created = await createPortfolioItem({
      name: newForm.name,
      industry: newForm.industry,
      metric: newForm.metric,
      result: newForm.result,
      imageUrl,
      sortOrder: portfolioItems.length,
    });

    setPortfolioItems([...portfolioItems, created]);
    setNewForm(emptyForm);
    setCreating(false);
  }

  function startEdit(item: PortfolioItem) {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      industry: item.industry,
      metric: item.metric,
      result: item.result,
      file: null,
      imageUrl: item.imageUrl,
    });
  }

  async function handleSaveEdit(item: PortfolioItem) {
    setSavingEdit(true);
    const imageUrl = editForm.file ? await uploadPortfolioImage(editForm.file) : editForm.imageUrl;

    const updated = await updatePortfolioItem({
      ...item,
      name: editForm.name,
      industry: editForm.industry,
      metric: editForm.metric,
      result: editForm.result,
      imageUrl,
    });

    setPortfolioItems(portfolioItems.map((existing) => (existing.id === item.id ? updated : existing)));
    setSavingEdit(false);
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    await deletePortfolioItem(id);
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-heading text-2xl font-black uppercase text-white">Portafolio</h1>
        <p className="mt-1 text-sm text-slate-400">Agregá, editá o borrá los proyectos que se muestran en la web.</p>
      </div>

      <form onSubmit={handleCreate} className="premium-card rounded-[26px] border border-sky-300/14 bg-[#071126]/80 p-6">
        <p className="flex items-center gap-2 text-xs font-black uppercase text-sky-300">
          <ImagePlus className="h-4 w-4" />
          Nuevo proyecto
        </p>
        <div className="mt-4">
          <ItemFields form={newForm} onChange={(patch) => setNewForm((f) => ({ ...f, ...patch }))} />
        </div>
        <button
          type="submit"
          disabled={creating || !newForm.name}
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-300 px-6 text-sm font-black uppercase text-white transition hover:shadow-[0_16px_42px_rgba(14,165,233,0.28)] disabled:opacity-60"
        >
          {creating ? 'Agregando…' : 'Agregar proyecto'}
          <Plus className="h-4 w-4" />
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {portfolioItems.map((item) => (
          <div key={item.id} className="premium-card rounded-[26px] border border-sky-300/14 bg-[#071126]/80 p-5">
            {editingId === item.id ? (
              <div className="grid gap-3">
                <ItemFields form={editForm} onChange={(patch) => setEditForm((f) => ({ ...f, ...patch }))} />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(item)}
                    disabled={savingEdit}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-300 px-4 text-xs font-black uppercase text-white disabled:opacity-60"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {savingEdit ? 'Guardando…' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-sky-300/20 px-4 text-xs font-black uppercase text-slate-300"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="mb-4 h-36 w-full rounded-2xl object-cover"
                  />
                )}
                <p className="text-xs font-black uppercase text-sky-300">{item.industry || 'Sin rubro'}</p>
                <h3 className="mt-2 text-lg font-black uppercase text-white">{item.name || 'Sin nombre'}</h3>
                <p className="mt-2 text-sm font-black text-white">{item.metric}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.result}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/8 px-4 text-xs font-black text-sky-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-red-300/20 px-4 text-xs font-black text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Borrar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
