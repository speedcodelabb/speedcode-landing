import { motion, useReducedMotion } from "motion/react";
import { useSiteContent } from "../context/SiteContentContext";
import { getServiceIcon } from "../lib/serviceIcons";

export default function Values() {
  const { content } = useSiteContent();
  const reduceMotion = useReducedMotion();
  return (
    <section id="valores" className="mt-20 scroll-mt-24">
      <h2 className="font-heading text-center text-3xl font-black uppercase md:text-4xl">
        {content.values.title}{" "}
        <span className="text-sky-300">{content.values.highlight}</span>
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {content.values.items.map((value) => {
          const Icon = getServiceIcon(value.icon);
          return (
            <motion.article
              key={value.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="premium-card border border-sky-300/12 bg-[#071126]/70 p-7"
            >
              <Icon className="h-8 w-8 text-sky-300" />
              <h3 className="mt-7 text-lg font-black uppercase">
                {value.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {value.body}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
