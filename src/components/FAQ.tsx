import { useState } from 'react';
import { motion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export default function FAQ() {
  const { content } = useSiteContent();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section id="faq" className="mx-auto mt-24 max-w-4xl scroll-mt-24">
      <h2 className="font-heading text-center text-4xl font-black leading-tight md:text-5xl">
        Preguntas <span className="bg-gradient-to-r from-sky-200 to-blue-500 bg-clip-text text-transparent">frecuentes</span>
      </h2>

      <div className="mt-12 space-y-3">
        {content.faqItems.map((item, index) => {
          const isOpen = openFaq === index;

          return (
            <motion.article
              key={item.question}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.3 }}
              className="premium-card overflow-hidden border border-sky-300/12 bg-[#071126]/70"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-7"
              >
                <span className="flex items-center gap-5">
                  <span className="text-sm font-black text-sky-400">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-base font-black text-white">{item.question}</span>
                </span>
                {isOpen ? <Minus className="h-5 w-5 shrink-0 text-sky-300" /> : <Plus className="h-5 w-5 shrink-0 text-sky-300" />}
              </button>
              {isOpen && <p className="px-16 pb-6 text-sm leading-7 text-slate-300 md:px-[76px]">{item.answer}</p>}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
