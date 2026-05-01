import { motion } from 'motion/react';
import { Send, Phone, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipoProyecto: 'Desarrollo Web / SaaS',
    mensaje: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      alert('Por favor completá todos los campos obligatorios.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al enviar');
      setStatus('success');
      setFormData({ nombre: '', email: '', tipoProyecto: 'Desarrollo Web / SaaS', mensaje: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-navy-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Send className="w-24 h-24 rotate-12" />
          </div>

          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 uppercase">
              Trabajemos <span className="glow-text">Juntos</span>
            </h2>
            <p className="text-gray-400">Tienes un proyecto en mente? Hablemos de como acelerarlo.</p>
          </div>

          {/* Datos de contacto directo */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 relative z-10">
            <a href="tel:+595994381638" className="flex items-center gap-2 text-gray-300 hover:text-cyan-glow transition-colors text-sm">
              <Phone className="w-4 h-4" />
              0994 381 638
            </a>
            <a href="mailto:speedcodelab2@gmail.com" className="flex items-center gap-2 text-gray-300 hover:text-cyan-glow transition-colors text-sm">
              <Mail className="w-4 h-4" />
              speedcodelab2@gmail.com
            </a>
            <a
              href="https://wa.me/595994381638?text=Hola%20SPEEDCODE%20Lab%2C%20me%20interesa%20un%20proyecto%20%F0%9F%9A%80"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#25D366] hover:text-white transition-colors text-sm font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp directo
            </a>
          </div>

          {status === 'success' ? (
            <div className="relative z-10 text-center py-12">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-cyan-glow mb-2">Mensaje enviado!</h3>
              <p className="text-gray-400">Nos pondremos en contacto contigo muy pronto.</p>
              <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-gray-500 hover:text-white transition-colors underline">
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400">Nombre *</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Tu nombre completo"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-glow/50 transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="hola@ejemplo.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-glow/50 transition-colors" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Tipo de Proyecto</label>
                <select name="tipoProyecto" value={formData.tipoProyecto} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-glow/50 transition-colors appearance-none">
                  <option className="bg-navy-800">Desarrollo Web / SaaS</option>
                  <option className="bg-navy-800">App de Escritorio</option>
                  <option className="bg-navy-800">Automatizacion</option>
                  <option className="bg-navy-800">Analisis de Datos</option>
                  <option className="bg-navy-800">Consultoria Tecnologica</option>
                  <option className="bg-navy-800">Otro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Mensaje *</label>
                <textarea rows={4} name="mensaje" value={formData.mensaje} onChange={handleChange} placeholder="Cuentanos un poco sobre tu vision..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-glow/50 transition-colors resize-none"></textarea>
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-sm text-center">
                  Ocurrio un error. Por favor intenta de nuevo o escribinos por WhatsApp.
                </p>
              )}

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit}
                disabled={status === 'loading'}
                className="glow-button w-full flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                {status === 'loading' ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
