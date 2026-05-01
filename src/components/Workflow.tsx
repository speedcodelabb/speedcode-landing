import { motion } from 'motion/react';
import { Search, Code2, CloudUpload } from 'lucide-react';

const steps = [
  {
    title: 'CONSULTA Y PLANIFICACIÓN',
    description: 'Análisis profundo para entender tus metas. Creamos un plano detallado para el éxito de tu proyecto.',
    icon: <Search className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'DESARROLLO Y PRUEBAS',
    description: 'La fase "Lab". Escribimos código robusto y eficiente. Integración continua y control de calidad rigoroso.',
    icon: <Code2 className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'DESPLIEGUE Y SOPORTE',
    description: 'Lanzamos tu producto al mercado con confianza. Ofrecemos mantenimiento post-lanzamiento y actualizaciones constantes.',
    icon: <CloudUpload className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800',
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            TU PROYECTO <span className="glow-text">PASO A PASO</span>
          </h2>
          <p className="text-gray-400">Eficiencia técnica de principio a fin.</p>
        </div>

        <div className="space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
            >
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-glow/20 rounded-lg text-cyan-glow">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {step.description}
                </p>
                <div className="h-1 w-20 bg-linear-to-r from-blue-glow to-transparent" />
              </div>

              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-blue-glow/20 blur-3xl -z-10 rounded-full" />
                <img
                  src={step.image}
                  alt={step.title}
                  className="rounded-2xl border border-white/10 shadow-2xl w-full object-cover aspect-video hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
