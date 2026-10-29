import logoMark from "../assets/speedcode-logo-mark.webp";
import { useSiteContent } from "../context/SiteContentContext";

export default function Footer({
  defaultWhatsappUrl,
}: {
  defaultWhatsappUrl: string;
}) {
  const { content } = useSiteContent();
  return (
    <footer className="border-t border-sky-300/10 bg-[#020614] px-5 py-10 md:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logoMark}
              width="44"
              height="44"
              alt="Speedcode"
              className="h-11 w-11 rounded-full object-cover"
            />
            <span className="text-lg font-black uppercase">Speedcode Lab</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            {content.footer.description}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase">
            {content.footer.servicesTitle}
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            {content.services.items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="hover:text-sky-300"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase">
            {content.footer.contactTitle}
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <a href={`tel:+${content.contact.whatsappNumber}`}>
              {content.contact.phoneLabel}
            </a>
            <a href={`mailto:${content.contact.email}`}>
              {content.contact.email}
            </a>
            <a
              href={defaultWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-emerald-400"
            >
              {content.contact.directWhatsappLabel}
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1240px] flex-col justify-between gap-3 border-t border-sky-300/10 pt-6 text-xs text-slate-400 md:flex-row">
        <p>
          © {new Date().getFullYear()} Speedcode Lab. Todos los derechos
          reservados.
        </p>
        <p>{content.footer.tagline}</p>
      </div>
    </footer>
  );
}
