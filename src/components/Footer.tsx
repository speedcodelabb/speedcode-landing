import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="flex justify-center flex-wrap gap-8 text-gray-400">
           <a href="#" className="hover:text-cyan-glow transition-colors"><Github className="w-6 h-6" /></a>
           <a href="#" className="hover:text-cyan-glow transition-colors"><Twitter className="w-6 h-6" /></a>
           <a href="#" className="hover:text-cyan-glow transition-colors"><Linkedin className="w-6 h-6" /></a>
           <a href="#" className="hover:text-cyan-glow transition-colors"><Instagram className="w-6 h-6" /></a>
        </div>

        <p className="text-gray-500 text-sm">
          Desarrollado con Velocidad por <span className="text-cyan-glow font-bold">SPEEDCODE Lab</span>
        </p>

        <div className="text-xs text-gray-600 space-x-4">
          <a href="#" className="hover:text-white">Privacidad</a>
          <a href="#" className="hover:text-white">Términos</a>
          <a href="#" className="hover:text-white">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
