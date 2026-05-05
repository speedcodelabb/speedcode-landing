import logoMark from '../assets/speedcode-logo-mark.png';
import { contactEmail, serviceNavItems } from '../data/landing';

type FooterProps = {
  defaultWhatsappUrl: string;
};

export default function Footer({ defaultWhatsappUrl }: FooterProps) {
  return (
    <footer className="border-t border-sky-300/10 bg-[#020614] px-5 py-10 md:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoMark} alt="Speedcode" className="h-11 w-11 rounded-full object-cover" />
            <span className="text-lg font-black uppercase text-white">Speedcode Lab</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            Desarrollo web, automatización y productos digitales para empresas que necesitan moverse rápido sin sacrificar arquitectura.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase text-white">Servicios</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            {serviceNavItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-sky-300">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase text-white">Contacto</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <a href="tel:+595994381638" className="transition hover:text-sky-300">0994 381 638</a>
            <a href={`mailto:${contactEmail}`} className="transition hover:text-sky-300">{contactEmail}</a>
            <a href={defaultWhatsappUrl} target="_blank" rel="noreferrer" className="font-bold text-emerald-400 transition hover:text-emerald-300">
              WhatsApp directo
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1240px] flex-col justify-between gap-3 border-t border-sky-300/10 pt-6 text-xs text-slate-500 md:flex-row">
        <p>© {new Date().getFullYear()} Speedcode Lab. Todos los derechos reservados.</p>
        <p>Software, automatización y estrategia técnica desde Paraguay.</p>
      </div>
    </footer>
  );
}
