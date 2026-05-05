import { motion } from 'motion/react';
import { values } from '../data/landing';

export default function Values() {
  return (
    <section id="valores" className="mt-20 scroll-mt-24">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-black uppercase leading-tight md:text-4xl">
          Nuestra misión y
          <span className="text-sky-300"> valores positivos</span>
        </h2>
        <div className="mx-auto mt-4 h-1 w-28 bg-gradient-to-r from-blue-600 to-sky-300" />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <motion.article
              key={value.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.35 }}
              className="premium-card border border-sky-300/12 bg-[#071126]/70 p-7"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-300/8">
                <Icon className="h-7 w-7 text-sky-300" />
              </div>
              <h3 className="mt-7 text-lg font-black uppercase text-white">{value.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{value.body}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
