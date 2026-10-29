import { motion, useReducedMotion } from "motion/react";
import { useSiteContent } from "../context/SiteContentContext";
import { getServiceIcon } from "../lib/serviceIcons";
import { getServiceWhatsappMessage, getWhatsappUrl } from "../lib/siteContent";

export default function ServicesDetails() {
  const { content } = useSiteContent();
  const reduceMotion = useReducedMotion();
  return (
    <section id="servicios" className="scroll-mt-24">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase text-sky-300">
            {content.services.eyebrow}
          </p>
          <h2 className="font-heading mt-3 text-4xl font-black uppercase md:text-6xl">
            {content.services.title}
            <span className="block bg-gradient-to-r from-sky-200 to-blue-500 bg-clip-text text-transparent">
              {content.services.highlight}
            </span>
          </h2>
        </div>
        <p className="max-w-lg text-base leading-8 text-slate-300">
          {content.services.description}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {content.services.items.map((service) => {
          const Icon = getServiceIcon(service.icon);
          return (
            <motion.article
              key={service.id}
              id={service.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="premium-card flex min-h-[320px] scroll-mt-28 flex-col border border-sky-300/12 bg-[#071126]/70 p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-300/8">
                <Icon className="h-5 w-5 text-sky-300" />
              </div>
              <h3 className="mt-5 text-xl font-black uppercase">
                {service.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-7 text-slate-300">
                {service.body}
              </p>
              <span className="mt-6 w-fit rounded-full border border-sky-300/14 px-3 py-1 text-[11px] font-bold uppercase text-sky-200">
                {service.proof}
              </span>
              <a
                href={getWhatsappUrl(
                  content.contact.whatsappNumber,
                  getServiceWhatsappMessage(service),
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Consultar por ${service.title} en WhatsApp`}
                className="mt-4 inline-flex min-h-12 w-fit items-center font-bold text-sky-300 hover:text-sky-100"
              >
                Consultar
              </a>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
