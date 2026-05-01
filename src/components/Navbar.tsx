import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Zap, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Nosotros', href: '/#about' },
  ];

  const services = [
    { name: 'Automatización', href: '/servicios/automatizacion' },
    { name: 'Desarrollo Web', href: '/servicios/desarrollo-web' },
    { name: 'Apps de Escritorio', href: '/servicios/apps-escritorio' },
    { name: 'Análisis de Datos', href: '/servicios/analisis-datos' },
    { name: 'Consultoría Tecnológica', href: '/servicios/consultoria' },
    { name: 'Productos SaaS', href: '/servicios/saas' },
    { name: 'Soporte y Mantenimiento', href: '/servicios/mantenimiento' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center text-cyan-glow group">
               <span className="text-2xl font-bold tracking-tighter flex items-center">
                <span className="text-white group-hover:text-blue-500 transition-colors">&lt;</span>
                <Zap className="w-8 h-8 mx-1 fill-cyan-glow/20 group-hover:scale-125 transition-transform" />
                <span className="text-cyan-glow">SPEEDCODE</span>
                <span className="ml-2 text-white font-light text-lg">Lab</span>
                <span className="text-white group-hover:text-blue-500 transition-colors">/&gt;</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-300 hover:text-cyan-glow transition-all px-4 py-2 text-sm font-medium rounded-lg hover:bg-white/5"
              >
                {link.name}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-300 hover:text-cyan-glow transition-all px-4 py-2 text-sm font-medium rounded-lg hover:bg-white/5">
                Servicios
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 w-64 mt-2 py-2 bg-navy-800 border border-white/10 rounded-xl shadow-2xl backdrop-blur-2xl"
                  >
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        to={service.href}
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:text-cyan-glow hover:bg-white/5 transition-colors"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/#portfolio" className="text-gray-300 hover:text-cyan-glow transition-all px-4 py-2 text-sm font-medium rounded-lg hover:bg-white/5">Portafolio</Link>
            <Link to="/#contact" className="text-gray-300 hover:text-cyan-glow transition-all px-4 py-2 text-sm font-medium rounded-lg hover:bg-white/5">Contacto</Link>
            
            <a 
              href="https://wa.me/595994381638?text=Hola%20SPEEDCODE%20Lab%2C%20me%20interesa%20un%20proyecto%20%F0%9F%9A%80" 
              className="ml-6 flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.3)]"
            >
              <Zap className="w-4 h-4 fill-white" />
              ¿Whatsappeaamos?
            </a>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <a 
              href="https://wa.me/595994381638?text=Hola%20SPEEDCODE%20Lab%2C%20me%20interesa%20un%20proyecto%20%F0%9F%9A%80" 
              className="p-2 bg-[#25D366] rounded-full text-white"
            >
              <Zap className="w-5 h-5 fill-white" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-800 border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {[...navLinks, { name: 'Servicios', href: '/#services' }, { name: 'Portafolio', href: '/#portfolio' }, { name: 'Contacto', href: '/#contact' }].map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-300 hover:text-cyan-glow block px-3 py-3 text-lg font-medium border-b border-white/5 last:border-0"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 space-y-1 pl-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Nuestros Servicios</p>
                {services.map((service) => (
                  <Link
                    key={service.name}
                    to={service.href}
                    className="text-gray-400 hover:text-cyan-glow block py-2 text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
