import { motion } from 'motion/react';
import { Zap, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[85vh] flex items-center">
      {/* Code Background Layer */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full font-mono text-[10px] md:text-sm leading-relaxed p-10 overflow-hidden select-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap text-cyan-glow/40">
              {`import { ${['Speed', 'Lab', 'Optimization', 'Agile'][i % 4]} } from '@speedcode/core';`}
              {` export async function deploy_${i}() { await laboratory.optimize("${Math.random().toString(36).substring(7)}"); }`}
              {` // Velocity check: ${Math.random().toFixed(4)}ms`}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-navy-900/0 via-navy-900/80 to-navy-900" />
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-glow/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-glow rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="relative flex items-center justify-center text-8xl md:text-9xl glow-text font-bold">
               <span className="text-blue-500 mr-2">&lt;</span>
               <div className="relative">
                 <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">S</span>
                 <Zap className="absolute -top-4 -right-10 w-16 h-16 text-cyan-glow drop-shadow-[0_0_15px_rgba(0,242,255,0.8)] animate-bounce" />
               </div>
               <span className="text-blue-500 ml-6">/&gt;</span>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight"
        >
          SOLUCIONES DE SOFTWARE <br />
          <span className="glow-text">A LA VELOCIDAD DEL CÓDIGO</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto text-xl text-gray-400 mb-10"
        >
          Acelera tu visión digital con un equipo de desarrollo enfocado en el laboratorio. 
          Expertos en agilidad, escalabilidad y arquitecturas de alto rendimiento.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="glow-button flex items-center gap-2 group">
            Solicitar Presupuesto
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-colors font-medium flex items-center gap-2">
            Ver Portafolio
          </button>
        </motion.div>

        {/* Decorative Zap */}
        <div className="mt-20 flex justify-center gap-20 opacity-20 grayscale pointer-events-none">
           <Zap className="w-24 h-24 text-cyan-glow animate-pulse" />
           <div className="text-left font-mono text-xs hidden md:block">
              <pre>{`const SPEED = "Lab";
function accelerate(product) {
  return product.optimize().deploy();
}`}</pre>
           </div>
        </div>
      </div>
    </section>
  );
}
