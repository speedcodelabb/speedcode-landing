import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-navy-800/80 relative overflow-hidden">
       {/* Background Noise/Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#00f2ff_1px,transparent_1px)] [background-size:40px_40px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              SOBRE NUESTRO <br />
              <span className="glow-text">LABORATORIO</span>
            </h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              SPEEDCODE Lab nació de la necesidad de transformar ideas complejas en realidades técnicas tangibles con una velocidad sin precedentes. No somos solo una agencia; somos un equipo de ingenieros obsesionados con la optimización.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Nuestro enfoque combina la agilidad de los últimos frameworks de desarrollo con la robustez de arquitecturas de nivel empresarial. En nuestro "laboratorio", cada línea de código es sometida a rigurosas pruebas de rendimiento y escalabilidad.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="glass-card p-6 text-center space-y-2">
              <div className="text-3xl font-bold glow-text">100+</div>
              <div className="text-sm text-gray-400">Proyectos Lanzados</div>
            </div>
            <div className="glass-card p-6 text-center space-y-2 mt-8">
              <div className="text-3xl font-bold glow-text">15+</div>
              <div className="text-sm text-gray-400">Artesanos de Código</div>
            </div>
            <div className="glass-card p-6 text-center space-y-2">
              <div className="text-3xl font-bold glow-text">99.9%</div>
              <div className="text-sm text-gray-400">Uptime Promedio</div>
            </div>
            <div className="glass-card p-6 text-center space-y-2 mt-8">
              <div className="text-3xl font-bold glow-text">24/7</div>
              <div className="text-sm text-gray-400">Monitoreo Proactivo</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
