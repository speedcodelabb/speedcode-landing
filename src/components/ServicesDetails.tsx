import { motion } from 'motion/react';
import { Smartphone, Monitor, Database, BarChart3 } from 'lucide-react';

const detailedServices = [
  {
    id: '01',
    title: 'Sitios y landing web',
    subtitle: 'Responsive y optimizados',
    icon: <Monitor className="w-10 h-10" />,
    description: 'Desarrollamos sitios web únicos y funcionales, diseñados específicamente para tu negocio. Desde landing pages que convierten hasta sitios corporativos completos.',
    highlight: 'Cada sitio web que creamos está pensado para generar resultados: más visitas, más leads y más ventas para tu negocio.',
    features: [
      'Diseño responsive que se adapta a todos los dispositivos',
      'Optimización completa para SEO y velocidad de carga',
      'Integración con sistemas existentes (CRM, inventarios, etc.)',
      'Panel de administración personalizado para gestionar tu contenido'
    ]
  },
  {
    id: '02',
    title: 'Apps Android e iOS',
    subtitle: 'Tecnología WebView / Nativas',
    icon: <Smartphone className="w-10 h-10" />,
    description: 'Convertimos tu visión en aplicaciones móviles potentes. Usamos las últimas tecnologías para asegurar rendimiento y una experiencia de usuario fluida.',
    highlight: 'Tus clientes podrán descargar tu app desde Google Play y App Store, llevando tu negocio siempre en su bolsillo.',
    features: [
      'Apps nativas para Android e iOS con tu marca',
      'Para su uso cómodo dondequiera que estés',
      'Sincronización automática con tu sitio web principal',
      'Experiencia móvil optimizada y fluida'
    ]
  }
];

export default function ServicesDetails() {
  return (
    <section id="services" className="py-24 bg-navy-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {detailedServices.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-12 border-white/5 flex flex-col h-full hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 bg-cyan-glow text-navy-900 rounded-2xl shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                  {service.icon}
                </div>
                <div className="text-white/5 text-6xl font-display font-bold">{service.id}</div>
              </div>

              <h3 className="text-3xl font-bold mb-2">{service.title}</h3>
              <p className="text-cyan-glow font-bold mb-6 tracking-wide">{service.subtitle}</p>
              
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                {service.description}
              </p>

              <div className="bg-white/5 rounded-2xl p-6 mb-8 border-l-4 border-cyan-glow">
                <p className="text-gray-300 font-medium">
                  {service.highlight}
                </p>
              </div>

              <div className="space-y-4 flex-grow">
                <p className="font-bold uppercase tracking-wider text-sm text-gray-500">Lo que incluye:</p>
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full mt-2 shrink-0" />
                    <p className="text-gray-400">{feature}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ERP Integration Banner Style Section */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-16 bg-navy-900 text-white rounded-[40px] p-10 md:p-20 relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#00f2ff_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
            Desarrollamos soluciones web que se conectan con <br />
            <span className="text-orange-400">tu ERP en tiempo real</span>
          </h2>
          
          <p className="max-w-3xl mx-auto text-xl text-gray-400 mb-12">
            En SPEEDCODE Lab somos una <span className="text-white font-bold italic underline decoration-cyan-glow">software web factory</span> especializada en desarrollar add-ons, plugins, módulos web e incluso aplicaciones que se integran con los sistemas más robustos.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
             <div className="flex flex-col items-center gap-4">
                <div className="text-2xl font-bold">SAP</div>
                <div className="text-xs tracking-widest text-gray-500 uppercase">Business One</div>
             </div>
             <div className="flex flex-col items-center gap-4">
                <div className="text-2xl font-bold">Odoo</div>
                <div className="text-xs tracking-widest text-gray-500 uppercase">ERP Ecosystem</div>
             </div>
             <div className="flex flex-col items-center gap-4">
                <div className="text-2xl font-bold">Century</div>
                <div className="text-xs tracking-widest text-gray-500 uppercase">Systems</div>
             </div>
             <div className="flex flex-col items-center gap-4">
                <div className="text-2xl font-bold">Pegasus</div>
                <div className="text-xs tracking-widest text-gray-500 uppercase">Control ERP</div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
