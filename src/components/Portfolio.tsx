import { motion } from 'motion/react';

const projects = [
  {
    title: 'Fintech Hub',
    category: 'SaaS / Banking',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'EduTech Pro',
    category: 'E-Learning',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Health AI',
    category: 'Medical Tech',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Crypto Pulse',
    category: 'Blockchain',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=600',
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              PROYECTOS <span className="glow-text">DESTACADOS</span>
            </h2>
            <p className="text-gray-400">Una muestra de nuestro trabajo en el laboratorio.</p>
          </div>
          <button className="text-cyan-glow hover:underline font-medium">Ver todo el portafolio →</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl bg-navy-800"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-navy-900 to-transparent">
                <p className="text-xs text-cyan-glow font-bold uppercase tracking-widest mb-1">
                  {project.category}
                </p>
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
