import { motion } from 'motion/react';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: '¿Cuánto cuesta desarrollar un sitio web?',
    answer: 'El costo varía según la complejidad y las funcionalidades requeridas. Realizamos presupuestos a medida tras una fase de consultoría inicial para asegurar que pagas solo por lo que necesitas.'
  },
  {
    question: '¿Cuánto tiempo toma tener mi web lista?',
    answer: 'Una landing page puede estar lista en 1-2 semanas, mientras que un sistema complejo o un e-commerce puede tomar de 4 a 8 semanas dependiendo de las integraciones.'
  },
  {
    question: '¿El sitio va a funcionar bien en celulares?',
    answer: 'Absolutamente. Todos nuestros desarrollos son "Mobile First" por defecto, garantizando una experiencia perfecta en cualquier dispositivo.'
  },
  {
    question: '¿Incluyen hosting y dominio?',
    answer: 'Te asesoramos en la compra del dominio y configuramos el hosting más eficiente (usualmente Vercel o AWS para máxima velocidad). El costo del servicio de terceros corre por cuenta del cliente.'
  },
  {
    question: '¿Puedo actualizar el contenido después?',
    answer: 'Sí. Entregamos un panel de administración intuitivo para que puedas gestionar textos, imágenes y productos sin depender de nosotros.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-navy-900 text-slate-100 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold">Preguntas <span className="glow-text">frecuentes</span></h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card border-white/5 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <span className="text-cyan-glow/20 font-display font-bold text-lg">{`0${index + 1}`}</span>
                  <span className="text-xl font-bold text-gray-200">{faq.question}</span>
                </div>
                <div className="p-2 transition-transform duration-300 text-cyan-glow">
                  {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>
              
              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 text-gray-400 leading-relaxed text-lg pl-24">
                  {faq.answer}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
