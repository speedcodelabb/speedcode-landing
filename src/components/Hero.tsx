import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import PremiumAnimatedBackground from './3d/PremiumAnimatedBackground';
import { heroStats } from '../data/landing';
import { useSiteContent } from '../context/SiteContentContext';

export default function Hero() {
  const { content } = useSiteContent();

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-[#020614] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-[1] after:h-32 after:bg-gradient-to-b after:from-transparent after:to-[#020614]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.18),transparent_34%),linear-gradient(180deg,#020614_0%,#050b1f_100%)]" />
      <div className="relative">
        <div className="relative min-h-[640px] overflow-hidden bg-black sm:min-h-[680px] md:min-h-[min(760px,92dvh)]">
          <PremiumAnimatedBackground />

          <div className="relative z-10 flex min-h-[640px] flex-col sm:min-h-[680px] md:min-h-[min(760px,92dvh)]">
            <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12 pt-24 text-center sm:px-5 sm:pb-16 sm:pt-28 md:px-10 md:pb-16 md:pt-32">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[92vw] rounded-full border border-sky-300/30 bg-[#061126]/60 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[-0.01em] text-sky-100 backdrop-blur-md min-[390px]:text-xs"
              >
                Desarrollo web, software y automatización
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-heading mt-5 max-w-6xl text-[clamp(2.15rem,9.4vw,3.7rem)] font-black uppercase leading-[0.98] tracking-[-0.04em] text-white md:mt-6 md:text-5xl md:tracking-normal lg:text-6xl xl:text-[4rem]"
              >
                <span className="bg-gradient-to-r from-sky-100 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                  {content.heroTitle}
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 max-w-[34rem] text-[15px] leading-7 text-slate-200 md:mt-6 md:max-w-3xl md:text-lg md:leading-relaxed"
              >
                {content.heroSubtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-7 flex w-full max-w-[21rem] flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center md:mt-8"
              >
                <a
                  href="#contacto"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-300 px-7 py-3 text-base font-black text-white shadow-[0_18px_55px_rgba(14,165,233,0.28)] sm:w-auto sm:px-8"
                >
                  Solicitar Presupuesto
                  <ArrowUpRight className="h-5 w-5" />
                </a>
                <a
                  href="#servicios"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-[#081225]/55 px-7 py-3 text-base font-bold text-white backdrop-blur-md transition hover:border-sky-300/70 sm:w-auto sm:px-8"
                >
                  Ver servicios
                  <ArrowUpRight className="h-5 w-5" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                className="mt-8 grid w-full max-w-[35rem] grid-cols-3 overflow-hidden rounded-2xl border border-sky-300/12 bg-[#061126]/52 backdrop-blur-xl md:max-w-3xl md:rounded-none"
              >
                {heroStats.map((stat) => (
                  <div key={stat.label} className="border-r border-sky-300/10 px-2.5 py-3 last:border-r-0 sm:px-5 sm:py-4">
                    <p className="text-sm font-black leading-tight text-white min-[390px]:text-base sm:text-lg">{stat.value}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase leading-tight text-slate-400 sm:text-xs">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
