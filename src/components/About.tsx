import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import logoMark from "../assets/speedcode-logo-mark.webp";
import { useSiteContent } from "../context/SiteContentContext";

export default function About() {
  const { content } = useSiteContent();
  const reduceMotion = useReducedMotion();
  return (
    <section
      id="laboratorio"
      className="mt-20 grid scroll-mt-24 gap-6 lg:grid-cols-2"
    >
      <motion.article
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="premium-card border border-sky-300/10 bg-[#060d21] p-8 md:p-10"
      >
        <h2 className="font-heading text-4xl font-black uppercase md:text-5xl">
          {content.about.title}
          <span className="block text-sky-300">{content.about.highlight}</span>
        </h2>
        {content.about.paragraphs.map((paragraph, index) => (
          <p
            key={`${index}-${paragraph}`}
            className={`${index ? "text-slate-300" : "text-white"} mt-6 leading-8`}
          >
            {paragraph}
          </p>
        ))}
      </motion.article>
      <motion.article
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="premium-card border border-sky-300/12 bg-[#071126]/70 p-8 md:p-10"
      >
        <div className="flex items-center gap-4 border-b border-sky-300/10 pb-6">
          <img
            src={logoMark}
            width="64"
            height="64"
            alt="Speedcode"
            className="h-16 w-16 rounded-2xl object-cover"
          />
          <div>
            <p className="text-xs font-black uppercase text-sky-300">
              {content.about.methodEyebrow}
            </p>
            <h3 className="font-heading mt-1 text-2xl font-black uppercase">
              {content.about.methodTitle}
            </h3>
          </div>
        </div>
        <ul className="mt-7 space-y-4">
          {content.about.steps.map((step) => (
            <li
              key={step.id}
              className="flex items-start gap-3 text-sm font-semibold text-slate-200"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
              {step.text}
            </li>
          ))}
        </ul>
      </motion.article>
    </section>
  );
}
