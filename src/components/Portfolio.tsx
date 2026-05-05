import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { portfolioItems } from '../data/landing';

type PortfolioProps = {
  defaultWhatsappUrl: string;
};

export default function Portfolio({ defaultWhatsappUrl }: PortfolioProps) {
  return (
    <section id="portafolio" className="mt-24 scroll-mt-24">
      <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase text-sky-300">Portafolio</p>
          <h2 className="font-heading mt-3 text-4xl font-black uppercase leading-tight md:text-5xl">
            Proyectos pensados
            <span className="block bg-gradient-to-r from-sky-200 to-blue-500 bg-clip-text text-transparent">
              para vender y operar mejor
            </span>
          </h2>
        </div>
        <a
          href={defaultWhatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/8 px-5 py-2.5 text-sm font-black text-sky-100 transition hover:border-sky-300/50"
        >
          Consultar disponibilidad
          <MessageCircle className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {portfolioItems.map((item, index) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="premium-card relative overflow-hidden border border-sky-300/12 bg-[#071126]/70 p-7 transition duration-300 hover:-translate-y-1 hover:border-sky-300/35"
          >
            <div className="absolute right-5 top-5 text-6xl font-black text-sky-300/5">
              {String(index + 1).padStart(2, '0')}
            </div>
            <p className="relative text-xs font-black uppercase text-sky-300">{item.industry}</p>
            <h3 className="relative mt-5 text-2xl font-black uppercase leading-tight text-white">{item.name}</h3>
            <p className="relative mt-5 text-3xl font-black tracking-tight text-white">{item.metric}</p>
            <p className="relative mt-4 text-sm leading-7 text-slate-300">{item.result}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
