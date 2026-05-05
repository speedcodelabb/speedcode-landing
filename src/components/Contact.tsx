import { type FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageCircle, Phone, Send } from 'lucide-react';
import {
  contactEmail,
  getWhatsappUrl,
  maxMessageLength,
  nextSteps,
  truncateForWhatsapp,
} from '../data/landing';

type ContactProps = {
  defaultWhatsappUrl: string;
};

export default function Contact({ defaultWhatsappUrl }: ContactProps) {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus('sending');

    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || 'Sin nombre');
    const email = String(form.get('email') || 'Sin email');
    const projectType = String(form.get('projectType') || 'Desarrollo Web');
    const message = String(form.get('message') || 'Quiero conversar sobre mi proyecto.').slice(0, maxMessageLength);
    const contactMessage = `Hola Speedcode Lab. Soy ${name}. Email: ${email}. Tipo de proyecto: ${projectType}. Mensaje: ${message}`;

    window.open(getWhatsappUrl(truncateForWhatsapp(contactMessage)), '_blank', 'noopener,noreferrer');

    form.set('Nombre', name);
    form.set('Email', email);
    form.set('Tipo de proyecto', projectType);
    form.set('Mensaje', message);
    form.set('_subject', `Nuevo contacto web: ${projectType}`);
    form.set('_template', 'table');
    form.set('_captcha', 'false');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el formulario');
      }

      setFormStatus('sent');
      event.currentTarget.reset();
    } catch {
      setFormStatus('error');
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
        `Nuevo contacto web: ${projectType}`,
      )}&body=${encodeURIComponent(
        `Nombre: ${name}\nEmail: ${email}\nTipo de proyecto: ${projectType}\n\nMensaje:\n${message}`,
      )}`;
    }
  }

  return (
    <section id="contacto" className="mx-auto mt-24 max-w-[1240px] scroll-mt-24 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.35 }}
        className="premium-card relative overflow-hidden rounded-[32px] border border-sky-300/14 bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.18),transparent_36%),linear-gradient(135deg,rgba(7,17,38,0.96),rgba(2,6,18,0.99))] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.42)] md:p-8 lg:p-10"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-300/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-sky-300/45 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-300">Contacto</p>
            <h2 className="font-heading mt-4 text-4xl font-black uppercase leading-tight md:text-6xl">
              Trabajemos <span className="block bg-gradient-to-r from-sky-200 to-blue-500 bg-clip-text text-transparent">juntos</span>
            </h2>
          </div>
          <p className="max-w-lg text-base leading-8 text-slate-300">
            Cuéntanos qué necesitas construir. Te respondemos con alcance, tiempos y una ruta clara para avanzar sin perder semanas definiendo por tu cuenta.
          </p>
        </div>

        <div className="relative mt-9 grid min-w-0 gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="grid min-w-0 gap-4">
            <div className="rounded-[26px] border border-sky-300/12 bg-[#041022]/70 p-5 backdrop-blur">
              <p className="text-sm font-black uppercase text-white">Canales directos</p>
              <div className="mt-5 grid gap-3 text-sm text-slate-200">
                <a href="tel:+595994381638" className="flex min-h-12 items-center gap-3 rounded-2xl border border-sky-300/10 bg-sky-300/5 px-4 transition hover:border-sky-300/35 hover:text-sky-300">
                  <Phone className="h-4 w-4 text-sky-300" />
                  0994 381 638
                </a>
                <a href={`mailto:${contactEmail}`} className="flex min-h-12 min-w-0 items-center gap-3 rounded-2xl border border-sky-300/10 bg-sky-300/5 px-4 transition hover:border-sky-300/35 hover:text-sky-300">
                  <Mail className="h-4 w-4 text-sky-300" />
                  <span className="min-w-0 break-all">{contactEmail}</span>
                </a>
                <a
                  href={defaultWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 font-black text-emerald-400 transition hover:border-emerald-300/40 hover:text-emerald-300"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp directo
                </a>
              </div>
            </div>

            <div className="rounded-[26px] border border-sky-300/12 bg-[#030a19]/72 p-5">
              <p className="text-sm font-black uppercase text-white">Qué pasa después</p>
              <ol className="mt-5 grid gap-4">
                {nextSteps.map((step, index) => (
                  <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-6 text-slate-300">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-300/12 text-xs font-black text-sky-200">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <form onSubmit={handleContactSubmit} className="grid min-w-0 grid-cols-1 gap-5 rounded-[26px] border border-sky-300/14 bg-[#071126]/88 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:grid-cols-2 md:p-7">
            <label className="min-w-0 text-xs font-semibold text-slate-300">
              Nombre *
              <input
                name="name"
                required
                autoComplete="name"
                placeholder="Tu nombre completo"
                className="mt-2 h-12 w-full min-w-0 rounded-2xl border border-sky-300/14 bg-[#030918] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15"
              />
            </label>

            <label className="min-w-0 text-xs font-semibold text-slate-300">
              Email *
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="hola@ejemplo.com"
                className="mt-2 h-12 w-full min-w-0 rounded-2xl border border-sky-300/14 bg-[#030918] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15"
              />
            </label>

            <label className="min-w-0 text-xs font-semibold text-slate-300 md:col-span-2">
              Tipo de Proyecto
              <select
                name="projectType"
                className="mt-2 h-12 w-full min-w-0 rounded-2xl border border-sky-300/14 bg-[#030918] px-4 text-sm text-white outline-none transition focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15"
                defaultValue="Desarrollo Web"
              >
                <option className="bg-[#111426]">Automatización</option>
                <option className="bg-[#111426]">Desarrollo Web</option>
                <option className="bg-[#111426]">Apps de Escritorio</option>
                <option className="bg-[#111426]">Análisis de datos</option>
                <option className="bg-[#111426]">Consultoría tecnológica</option>
                <option className="bg-[#111426]">Productos SaaS</option>
                <option className="bg-[#111426]">Soporte y Mantenimiento</option>
              </select>
            </label>

            <label className="min-w-0 text-xs font-semibold text-slate-300 md:col-span-2">
              Mensaje *
              <textarea
                name="message"
                required
                maxLength={maxMessageLength}
                placeholder="Cuéntanos un poco sobre tu visión..."
                className="mt-2 min-h-32 w-full min-w-0 resize-none rounded-2xl border border-sky-300/14 bg-[#030918] px-4 py-4 text-sm text-white outline-none transition [overflow-wrap:anywhere] placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-300/15"
              />
              <span className="mt-2 block text-[11px] font-medium text-slate-500">
                Máximo {maxMessageLength} caracteres.
              </span>
            </label>

            <button
              type="submit"
              disabled={formStatus === 'sending'}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-300 px-7 text-sm font-black uppercase text-white transition hover:shadow-[0_16px_42px_rgba(14,165,233,0.28)] md:col-span-2"
            >
              {formStatus === 'sending' ? 'Enviando y abriendo WhatsApp' : 'Enviar mensaje'}
              <Send className="h-4 w-4" />
            </button>

            {formStatus === 'sent' && (
              <p className="text-sm font-semibold text-emerald-300 md:col-span-2">
                Mensaje enviado al correo y WhatsApp abierto con tu consulta.
              </p>
            )}

            {formStatus === 'error' && (
              <p className="text-sm font-semibold text-amber-200 md:col-span-2">
                Abrimos WhatsApp. El envío automático al correo falló, así que abrimos tu cliente de correo como respaldo.
              </p>
            )}
          </form>
        </div>
      </motion.div>
    </section>
  );
}
