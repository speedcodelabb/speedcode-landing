import { motion, useReducedMotion } from "motion/react";
import { ExternalLink, MessageCircle } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";
import { getPublicMediaUrl } from "../lib/siteContent";

export default function Portfolio({
  defaultWhatsappUrl,
}: {
  defaultWhatsappUrl: string;
}) {
  const { content } = useSiteContent();
  const reduceMotion = useReducedMotion();
  return (
    <section id="portafolio" className="mt-24 scroll-mt-24">
      <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase text-sky-300">
            {content.portfolio.eyebrow}
          </p>
          <h2 className="font-heading mt-3 text-4xl font-black uppercase md:text-5xl">
            {content.portfolio.title}
            <span className="block bg-gradient-to-r from-sky-200 to-blue-500 bg-clip-text text-transparent">
              {content.portfolio.highlight}
            </span>
          </h2>
        </div>
        <a
          href={defaultWhatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-300/20 px-5 py-2.5 text-sm font-black text-sky-100"
        >
          {content.portfolio.ctaLabel}
          <MessageCircle className="h-4 w-4" />
        </a>
      </div>
      {content.portfolio.items.length === 0 ? (
        <p className="rounded-3xl border border-sky-300/12 p-8 text-center text-slate-400">
          Próximamente publicaremos nuevos proyectos.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {content.portfolio.items.map((item, index) => {
            const imageUrl = getPublicMediaUrl(item.imagePath);
            return (
              <motion.article
                key={item.id}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="premium-card group relative flex flex-col overflow-hidden border border-sky-300/12 bg-[#071126]/70"
              >
                {imageUrl && (
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-sky-300/10 bg-[#030918]">
                    <img
                      src={imageUrl}
                      alt={`Captura de ${item.name}`}
                      width={1600}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                )}
                <div className="relative flex flex-1 flex-col p-7">
                  <span className="absolute right-5 top-4 text-5xl font-black text-sky-300/10">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="relative text-xs font-black uppercase text-sky-300">
                    {item.industry}
                  </p>
                  <h3 className="relative mt-4 text-2xl font-black uppercase">
                    {item.name}
                  </h3>
                  <p className="relative mt-3 text-xl font-black text-sky-100 md:text-2xl">
                    {item.metric}
                  </p>
                  <p className="relative mt-4 text-sm leading-7 text-slate-300">
                    {item.result}
                  </p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative mt-5 inline-flex items-center gap-2 text-sm font-black text-sky-300"
                    >
                      Ver proyecto
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
