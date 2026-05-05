import { motion } from 'motion/react';
import { services } from '../data/landing';

export default function ServicesDetails() {
  return (
    <section id="servicios" className="scroll-mt-24">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase text-sky-300">Qué construimos</p>
          <h2 className="font-heading mt-3 text-4xl font-black uppercase leading-tight md:text-6xl">
            Soluciones de software
            <span className="block bg-gradient-to-r from-sky-200 to-blue-500 bg-clip-text text-transparent">
              a la velocidad del código
            </span>
          </h2>
        </div>
        <p className="max-w-lg text-base leading-8 text-slate-300">
          Aceleramos tu visión digital con un equipo enfocado en rendimiento, escalabilidad y diseño que convierte.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.35 }}
              id={service.id}
              key={service.title}
              className="premium-card group relative flex min-h-[320px] scroll-mt-28 flex-col overflow-hidden border border-sky-300/12 bg-[#071126]/70 p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300/35 hover:bg-[#0a1730]/90"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-300/8">
                <Icon className="h-5 w-5 text-sky-300" />
              </div>
              <h3 className="mt-5 text-xl font-black uppercase leading-tight text-white">{service.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-7 text-slate-300">{service.body}</p>
              <span className="mt-6 w-fit rounded-full border border-sky-300/14 bg-sky-300/6 px-3 py-1 text-[11px] font-bold uppercase text-sky-200">
                {service.proof}
              </span>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
