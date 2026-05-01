import { motion } from 'motion/react';
import { Cpu, Terminal, Layers } from 'lucide-react';

const values = [
  {
    title: 'DESARROLLO ÁGIL',
    description: 'Entregas rápidas y continuas. Nos adaptamos a los cambios para que tu producto nunca se detenga.',
    icon: <Cpu className="w-10 h-10 text-cyan-glow" />,
  },
  {
    title: 'ARQUITECTURA ESCALABLE',
    description: 'Diseñamos sistemas que crecen contigo. Infraestructura sólida preparada para millones de usuarios.',
    icon: <Layers className="w-10 h-10 text-blue-glow" />,
  },
  {
    title: 'CÓDIGO LIMPIO',
    description: 'Legibilidad, mantenibilidad y rendimiento extremo. Escribimos código que dura.',
    icon: <Terminal className="w-10 h-10 text-cyan-glow" />,
  },
];

export default function Values() {
  return (
    <section id="features" className="py-24 bg-navy-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            NUESTRA MISIÓN Y <span className="glow-text">VALORES POSITIVOS</span>
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-blue-glow to-cyan-glow mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-card p-8 hover:bg-white/10 transition-colors group"
            >
              <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
