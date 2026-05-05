import { motion } from 'motion/react';
import { ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import TiltCard from './3d/TiltCard';

interface ServicePageProps {
  title: string;
  tagline: string;
  description: string;
  scope: string[];
  process: { title: string; desc: string }[];
  examples: { title: string; image: string }[];
}

export default function ServicePageTemplate({ title, tagline, description, scope, process, examples }: ServicePageProps) {
  return (
    <div className="pt-16">
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 text-text-secondary text-sm font-normal"
          >
            Servicio Especializado
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            {title}<br />
            <span className="text-accent-cyan">{tagline}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-xl text-text-secondary mb-10"
          >
            {description}
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            href="/#contact"
            className="inline-flex items-center gap-2 mx-auto border border-accent-cyan text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-accent-cyan/10 transition-colors"
          >
            Consultar sobre este servicio
            <ChevronRight className="w-4 h-4" />
          </motion.a>
        </div>
      </section>

      <section className="py-24 bg-canvas border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-8">
                ¿Qué podemos <span className="text-accent-cyan">crear</span>?
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {scope.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-surface border border-white/10 p-4 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                    <p className="text-text-primary font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface border border-white/10 rounded-2xl p-8">
              <Zap className="w-12 h-12 text-accent-cyan mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-text-primary">Eficiencia sin Límites</h3>
              <p className="text-text-secondary leading-relaxed">
                Nuestras soluciones están diseñadas para escalar masivamente sin comprometer la latencia. Utilizamos arquitecturas modernas que permiten un crecimiento orgánico y sostenido.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-canvas border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold mb-16 text-center">
            Nuestro <span className="text-accent-cyan">Laboratorio</span> de Proceso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {process.map((step, idx) => (
              <TiltCard key={idx} className="h-full">
                <div className="relative p-8 bg-surface border border-white/10 rounded-2xl h-full">
                  <div className="text-5xl font-display font-bold text-white/5 absolute top-4 right-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-text-primary">
                    <div className="w-2 h-2 bg-accent-cyan rounded-full" />
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-canvas border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            Casos de Éxito y <span className="text-accent-cyan">Ejemplos</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {examples.map((ex, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-video bg-surface border border-white/10">
                <img src={ex.image} alt={ex.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-canvas to-transparent">
                  <h4 className="text-lg font-bold text-text-primary">{ex.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
