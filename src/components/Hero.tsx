import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

export default function Hero() {
  const { content } = useSiteContent();
  const reduceMotion = useReducedMotion();
  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden bg-[#020614]"
    >
      <div className="premium-hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-left" />
        <div className="hero-orb hero-orb-right" />
      </div>
      <div className="relative z-10 flex min-h-[680px] flex-col items-center justify-center px-5 pb-16 pt-28 text-center md:min-h-[760px] md:pt-32">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-full border border-sky-300/30 bg-[#061126]/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-sky-100"
        >
          {content.hero.eyebrow}
        </motion.p>
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading mt-6 max-w-6xl text-[clamp(2.4rem,9vw,4rem)] font-black uppercase leading-[0.98] tracking-[-0.04em]"
        >
          <span className="bg-gradient-to-r from-sky-100 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            {content.hero.title}
          </span>
        </motion.h1>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-3xl text-base leading-8 text-slate-200 md:text-lg"
        >
          {content.hero.subtitle}
        </motion.p>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <a
            href="#contacto"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-300 px-8 font-black uppercase text-white"
          >
            {content.hero.primaryCta}
            <ArrowUpRight className="h-5 w-5" />
          </a>
          <a
            href="#servicios"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-[#081225]/70 px-8 font-bold text-white"
          >
            {content.hero.secondaryCta}
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </motion.div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="mt-10 grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-2xl border border-sky-300/12 bg-[#061126]/75 sm:grid-cols-3"
        >
          {content.hero.stats.map((stat) => (
            <div
              key={stat.id}
              className="border-b border-sky-300/10 px-4 py-4 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <p className="font-black text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
