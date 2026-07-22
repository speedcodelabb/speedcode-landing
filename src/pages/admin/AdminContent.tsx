import { type FormEvent, useState } from 'react';
import { ChevronDown, ArrowDown, ArrowUp, Check, Plus, Save, Trash2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { updateSiteContent } from '../../lib/adminApi';
import type { FaqItem, ServiceItem } from '../../lib/siteContent';
import { serviceIconOptions, getServiceIcon } from '../../lib/serviceIcons';

const cardClass = 'rounded-[26px] border border-slate-800 bg-[#0b1626] p-6';

const inputClass =
  'mt-2 h-12 w-full min-w-0 rounded-2xl border border-slate-800 bg-[#030918] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15';

const textareaClass =
  'mt-2 min-h-28 w-full min-w-0 resize-none rounded-2xl border border-slate-800 bg-[#030918] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15';

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function AdminContent() {
  const { content, setContent } = useSiteContent();

  const [heroTitle, setHeroTitle] = useState(content.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(content.heroSubtitle);
  const [aboutText, setAboutText] = useState(content.aboutText);
  const [contactEmail, setContactEmail] = useState(content.contactEmail);
  const [contactPhone, setContactPhone] = useState(content.contactPhone);
  const [whatsappNumber, setWhatsappNumber] = useState(content.whatsappNumber);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(content.faqItems);
  const [services, setServices] = useState<ServiceItem[]>(content.services);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateFaq(index: number, patch: Partial<FaqItem>) {
    setFaqItems((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeFaq(index: number) {
    setFaqItems((items) => items.filter((_, i) => i !== index));
    setExpandedFaq((current) => (current === index ? null : current));
  }

  function addFaq() {
    setFaqItems((items) => {
      setExpandedFaq(items.length);
      return [...items, { question: '', answer: '' }];
    });
  }

  function updateService(index: number, patch: Partial<ServiceItem>) {
    setServices((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeService(index: number) {
    setServices((items) => items.filter((_, i) => i !== index));
  }

  function addService() {
    setServices((items) => [
      ...items,
      { id: crypto.randomUUID(), icon: 'sparkles', title: '', body: '', proof: '' },
    ]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);

    const updated = await updateSiteContent(content, {
      heroTitle,
      heroSubtitle,
      aboutText,
      contactEmail,
      contactPhone,
      whatsappNumber,
      faqItems,
      services,
    });

    setContent(updated);
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div>
        <h1 className="font-heading text-2xl font-black uppercase text-white">Contenido de la página</h1>
        <p className="mt-1 text-sm text-slate-400">Editá los textos principales del sitio y los datos de contacto.</p>
      </div>

      <section className={cardClass}>
        <p className="text-xs font-black uppercase text-sky-300">Hero</p>
        <div className="mt-4 grid gap-4">
          <label className="text-xs font-semibold text-slate-300">
            Título principal
            <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className={inputClass} />
          </label>
          <label className="text-xs font-semibold text-slate-300">
            Subtítulo
            <textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className={textareaClass} />
          </label>
        </div>
      </section>

      <section className={cardClass}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-sky-300">Servicios</p>
            <p className="mt-1 text-xs text-slate-400">Se muestran como tarjetas en la sección "Qué construimos".</p>
          </div>
          <button
            type="button"
            onClick={addService}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sky-300/20 bg-sky-300/8 px-3 py-1.5 text-xs font-black text-sky-100 transition hover:border-sky-300/50"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar servicio
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {services.map((service, index) => {
            const SelectedIcon = getServiceIcon(service.icon);
            return (
              <div key={service.id} className="grid gap-3 rounded-2xl border border-slate-800 bg-[#030918]/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-300/10 text-sky-300">
                      <SelectedIcon className="h-4 w-4" />
                    </span>
                    <input
                      value={service.title}
                      onChange={(e) => updateService(index, { title: e.target.value })}
                      placeholder="Nombre del servicio"
                      className="h-9 min-w-0 flex-1 rounded-xl border border-slate-800 bg-[#030918] px-3 text-sm font-bold text-white outline-none focus:border-sky-300/70"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    aria-label="Borrar servicio"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-300/20 text-red-300 transition hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {serviceIconOptions.map(({ key, label, Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateService(index, { icon: key })}
                      aria-label={label}
                      title={label}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                        service.icon === key
                          ? 'border-sky-300/70 bg-sky-300/15 text-sky-200'
                          : 'border-slate-800 text-slate-400 hover:border-sky-300/40 hover:text-sky-200'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>

                <textarea
                  value={service.body}
                  onChange={(e) => updateService(index, { body: e.target.value })}
                  placeholder="Descripción del servicio"
                  className="min-h-20 w-full resize-none rounded-xl border border-slate-800 bg-[#030918] px-3 py-2.5 text-sm text-white outline-none focus:border-sky-300/70"
                />

                <input
                  value={service.proof}
                  onChange={(e) => updateService(index, { proof: e.target.value })}
                  placeholder="Etiqueta corta (ej: Producto escalable)"
                  className="h-10 w-full min-w-0 rounded-xl border border-slate-800 bg-[#030918] px-3 text-sm text-white outline-none focus:border-sky-300/70"
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className={cardClass}>
        <p className="text-xs font-black uppercase text-sky-300">Nosotros</p>
        <label className="mt-4 block text-xs font-semibold text-slate-300">
          Texto "Sobre nosotros"
          <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} className={textareaClass} />
        </label>
      </section>

      <section className={cardClass}>
        <p className="text-xs font-black uppercase text-sky-300">Contacto</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="text-xs font-semibold text-slate-300">
            Email
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputClass} />
          </label>
          <label className="text-xs font-semibold text-slate-300">
            Teléfono (texto visible)
            <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={inputClass} />
          </label>
          <label className="text-xs font-semibold text-slate-300">
            Número de WhatsApp (con código de país, sin +)
            <input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className={inputClass} />
          </label>
        </div>
      </section>

      <section className={cardClass}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase text-sky-300">Preguntas frecuentes</p>
            <p className="mt-1 text-xs text-slate-400">Tocá una pregunta para editar su respuesta.</p>
          </div>
          <button
            type="button"
            onClick={addFaq}
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/20 bg-sky-300/8 px-3 py-1.5 text-xs font-black text-sky-100 transition hover:border-sky-300/50"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar
          </button>
        </div>

        <div className="mt-4 grid gap-2.5">
          {faqItems.map((item, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div key={index} className="overflow-hidden rounded-2xl border border-slate-800 bg-[#030918]/60">
                <div className="flex items-center gap-2 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-300/10 text-[11px] font-black text-sky-300">
                    {index + 1}
                  </span>

                  <input
                    value={item.question}
                    onChange={(e) => updateFaq(index, { question: e.target.value })}
                    placeholder="Pregunta"
                    className="h-9 w-full min-w-0 rounded-lg border border-transparent bg-transparent px-2 text-sm font-semibold text-white outline-none transition focus:border-sky-300/50 focus:bg-[#030918]"
                  />

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setFaqItems((items) => moveItem(items, index, -1))}
                      disabled={index === 0}
                      aria-label="Mover arriba"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800/60 hover:text-sky-200 disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFaqItems((items) => moveItem(items, index, 1))}
                      disabled={index === faqItems.length - 1}
                      aria-label="Mover abajo"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800/60 hover:text-sky-200 disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : index)}
                      aria-label={isOpen ? 'Cerrar respuesta' : 'Editar respuesta'}
                      aria-expanded={isOpen}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                        isOpen ? 'bg-sky-300/15 text-sky-200' : 'text-slate-400 hover:bg-slate-800/60 hover:text-sky-200'
                      }`}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      aria-label="Borrar pregunta"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-300/80 transition hover:bg-red-400/10 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-800 p-3">
                    <textarea
                      value={item.answer}
                      onChange={(e) => updateFaq(index, { answer: e.target.value })}
                      placeholder="Respuesta"
                      autoFocus
                      className="min-h-24 w-full resize-none rounded-xl border border-slate-800 bg-[#030918] px-3 py-2.5 text-sm text-white outline-none focus:border-sky-300/70"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-300 px-7 text-sm font-black uppercase text-white transition hover:shadow-[0_16px_42px_rgba(14,165,233,0.28)] disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar cambios'}
          <Save className="h-4 w-4" />
        </button>
        {saved && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
            <Check className="h-4 w-4" />
            Cambios guardados.
          </p>
        )}
      </div>
    </form>
  );
}
