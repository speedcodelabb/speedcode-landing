import { type FormEvent, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { updateSiteContent } from '../../lib/adminApi';
import type { FaqItem } from '../../lib/siteContent';

const inputClass =
  'mt-2 h-12 w-full min-w-0 rounded-2xl border border-sky-300/14 bg-[#030918] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15';

const textareaClass =
  'mt-2 min-h-28 w-full min-w-0 resize-none rounded-2xl border border-sky-300/14 bg-[#030918] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15';

export default function AdminContent() {
  const { content, setContent } = useSiteContent();

  const [heroTitle, setHeroTitle] = useState(content.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(content.heroSubtitle);
  const [aboutText, setAboutText] = useState(content.aboutText);
  const [contactEmail, setContactEmail] = useState(content.contactEmail);
  const [contactPhone, setContactPhone] = useState(content.contactPhone);
  const [whatsappNumber, setWhatsappNumber] = useState(content.whatsappNumber);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(content.faqItems);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateFaq(index: number, patch: Partial<FaqItem>) {
    setFaqItems((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeFaq(index: number) {
    setFaqItems((items) => items.filter((_, i) => i !== index));
  }

  function addFaq() {
    setFaqItems((items) => [...items, { question: '', answer: '' }]);
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

      <section className="premium-card rounded-[26px] border border-sky-300/14 bg-[#071126]/80 p-6">
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

      <section className="premium-card rounded-[26px] border border-sky-300/14 bg-[#071126]/80 p-6">
        <p className="text-xs font-black uppercase text-sky-300">Nosotros</p>
        <label className="mt-4 block text-xs font-semibold text-slate-300">
          Texto "Sobre nosotros"
          <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} className={textareaClass} />
        </label>
      </section>

      <section className="premium-card rounded-[26px] border border-sky-300/14 bg-[#071126]/80 p-6">
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

      <section className="premium-card rounded-[26px] border border-sky-300/14 bg-[#071126]/80 p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase text-sky-300">Preguntas frecuentes</p>
          <button
            type="button"
            onClick={addFaq}
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/20 bg-sky-300/8 px-3 py-1.5 text-xs font-black text-sky-100 transition hover:border-sky-300/50"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar
          </button>
        </div>

        <div className="mt-4 grid gap-4">
          {faqItems.map((item, index) => (
            <div key={index} className="grid gap-3 rounded-2xl border border-sky-300/10 bg-[#030918]/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <input
                  value={item.question}
                  onChange={(e) => updateFaq(index, { question: e.target.value })}
                  placeholder="Pregunta"
                  className="h-11 w-full min-w-0 rounded-xl border border-sky-300/14 bg-[#030918] px-3 text-sm text-white outline-none focus:border-sky-300/70"
                />
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  aria-label="Borrar pregunta"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-300/20 text-red-300 transition hover:bg-red-400/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={item.answer}
                onChange={(e) => updateFaq(index, { answer: e.target.value })}
                placeholder="Respuesta"
                className="min-h-20 w-full resize-none rounded-xl border border-sky-300/14 bg-[#030918] px-3 py-2.5 text-sm text-white outline-none focus:border-sky-300/70"
              />
            </div>
          ))}
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
        {saved && <p className="text-sm font-semibold text-emerald-300">Cambios guardados.</p>}
      </div>
    </form>
  );
}
