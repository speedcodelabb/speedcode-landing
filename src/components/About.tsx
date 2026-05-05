import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import logoMark from '../assets/speedcode-logo-mark.png';
import { processSteps } from '../data/landing';

export default function About() {
  return (
    <section id="laboratorio" className="mt-20 grid scroll-mt-24 grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.35 }}
        className="premium-card relative h-full overflow-hidden border border-sky-300/10 bg-[#060d21] p-8 md:p-10"
      >
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(56,189,248,0.45)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative">
          <h2 className="font-heading text-4xl font-black uppercase leading-tight md:text-5xl">
            Sobre nuestro
            <span className="block text-sky-300">laboratorio</span>
          </h2>
          <p className="mt-7 max-w-3xl text-base leading-8 text-white">
            SPEEDCODE Lab nació de la necesidad de transformar ideas complejas en realidades técnicas tangibles con
            una velocidad sin precedentes. No somos solo una agencia: somos un equipo de ingenieros obsesionados con
            la optimización.
          </p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
            Nuestro enfoque combina la agilidad de los últimos frameworks de desarrollo con la robustez de
            arquitecturas de nivel empresarial. En nuestro laboratorio, cada línea de código se somete a rigurosas
            pruebas de rendimiento y escalabilidad.
          </p>
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.35, delay: 0.06 }}
        className="premium-card h-full border border-sky-300/12 bg-[#071126]/70 p-7 md:p-10"
      >
        <div className="flex items-center gap-4 border-b border-sky-300/10 pb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-300/8">
            <img src={logoMark} alt="Speedcode" className="h-12 w-12 rounded-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-sky-300">Método Speedcode</p>
            <h3 className="font-heading mt-1 text-2xl font-black uppercase text-white">Ejecución técnica con foco comercial</h3>
          </div>
        </div>
        <ul className="mt-7 space-y-4">
          {processSteps.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm font-semibold text-slate-200">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.article>
    </section>
  );
}
