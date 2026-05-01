import { motion } from 'motion/react';
import { ChevronRight, Zap, CheckCircle2 } from 'lucide-react';

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
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full font-mono text-[10px] md:text-sm leading-relaxed p-10 overflow-hidden select-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="whitespace-nowrap text-cyan-glow/40">
                {`service_call("${title.toLowerCase().replace(/ /g, '_')}");`}
                {` // Status: OPTIMIZING...`}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-navy-900/0 via-navy-900/80 to-navy-900" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-cyan-glow/30 bg-cyan-glow/5 text-cyan-glow text-sm font-bold tracking-widest uppercase"
          >
            Servicio Especializado
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            {title} <br />
            <span className="glow-text">{tagline}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-xl text-gray-400 mb-10"
          >
            {description}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glow-button flex items-center gap-2 mx-auto"
          >
            Consultar sobre este servicio
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* Scope Section */}
      <section className="py-24 bg-navy-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-8">¿Qué podemos <span className="glow-text">crear</span>?</h2>
              <div className="grid grid-cols-1 gap-4">
                {scope.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/10">
                    <CheckCircle2 className="w-6 h-6 text-cyan-glow shrink-0 mt-1" />
                    <p className="text-gray-300 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-blue-glow/20 blur-3xl rounded-full" />
               <div className="glass-card p-8 relative z-10 border-cyan-glow/20">
                  <Zap className="w-16 h-16 text-cyan-glow mb-6 animate-pulse" />
                  <h3 className="text-2xl font-bold mb-4">Eficiencia sin Límites</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Nuestras soluciones están diseñadas para escalar masivamente sin comprometer la latencia. Utilizamos arquitecturas modernas que permiten un crecimiento orgánico y sostenido.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold mb-16 text-center">Nuestro <span className="glow-text">Laboratorio</span> de Proceso</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {process.map((step, idx) => (
              <div key={idx} className="relative p-8 glass-card border-white/5 hover:border-cyan-glow/30 transition-colors group">
                <div className="text-5xl font-display font-bold text-white/5 absolute top-4 right-4 group-hover:text-cyan-glow/10 transition-colors">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-glow rounded-full" />
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-24 bg-navy-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold mb-12 text-center text-white">Casos de Éxito y <span className="glow-text">Ejemplos</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {examples.map((ex, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-video glass-card">
                <img src={ex.image} alt={ex.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-navy-900 to-transparent">
                  <h4 className="text-lg font-bold">{ex.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
