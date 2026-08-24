import { useState } from "react";
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import logoMark from "../assets/speedcode-logo-mark.webp";
import { useSiteContent } from "../context/SiteContentContext";

export default function Navbar({
  defaultWhatsappUrl,
}: {
  defaultWhatsappUrl: string;
}) {
  const { content } = useSiteContent();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenus = () => {
    setServicesOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-[1240px] -translate-x-1/2 rounded-[22px] border border-sky-300/15 bg-[#041024]/90 px-3.5 py-2.5 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:top-7 md:w-[calc(100%-120px)] md:rounded-full md:px-5">
      <div className="flex items-center justify-between gap-3">
        <a
          href="#inicio"
          className="flex min-w-0 items-center gap-2.5 md:gap-3"
          onClick={closeMenus}
        >
          <img
            src={logoMark}
            width="40"
            height="40"
            alt="Speedcode"
            className="h-9 w-9 rounded-full object-cover md:h-10 md:w-10"
          />
          <span className="truncate text-sm font-black uppercase text-white min-[390px]:text-base md:text-lg">
            Speedcode Lab
          </span>
        </a>
        <nav
          className="hidden items-center gap-5 md:flex"
          aria-label="Navegación principal"
        >
          <a href="#inicio" className="premium-nav-link">
            {content.navigation.home}
          </a>
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((value) => !value)}
              className="premium-nav-link gap-1"
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
            >
              {content.navigation.services}
              <ChevronDown
                className={`h-4 w-4 transition ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              role="menu"
              className={`absolute right-0 top-9 z-30 w-72 border border-sky-300/15 bg-[#071126]/98 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition ${servicesOpen ? "visible opacity-100" : "invisible translate-y-2 opacity-0"}`}
            >
              {content.services.items.map((item) => (
                <a
                  role="menuitem"
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={closeMenus}
                  className="block px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-sky-300/10 hover:text-sky-100"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
          <a href="#portafolio" className="premium-nav-link">
            {content.navigation.portfolio}
          </a>
          <a href="#contacto" className="premium-nav-link">
            {content.navigation.contact}
          </a>
          <a
            href={defaultWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-[#041022]"
          >
            {content.navigation.whatsapp}
            <MessageCircle className="h-4 w-4" />
          </a>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={defaultWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={content.navigation.whatsapp}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#041022]"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Abrir navegación"
            aria-expanded={mobileOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-300/20 text-white"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          className="mt-4 grid gap-1 border-t border-sky-300/10 pt-4 md:hidden"
          aria-label="Navegación móvil"
        >
          <a
            href="#inicio"
            onClick={closeMenus}
            className="px-3 py-3 font-bold"
          >
            {content.navigation.home}
          </a>
          <a
            href="#servicios"
            onClick={closeMenus}
            className="px-3 py-3 font-bold"
          >
            {content.navigation.services}
          </a>
          {content.services.items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={closeMenus}
              className="px-6 py-2 text-sm text-slate-400"
            >
              {item.title}
            </a>
          ))}
          <a
            href="#portafolio"
            onClick={closeMenus}
            className="px-3 py-3 font-bold"
          >
            {content.navigation.portfolio}
          </a>
          <a
            href="#contacto"
            onClick={closeMenus}
            className="px-3 py-3 font-bold"
          >
            {content.navigation.contact}
          </a>
        </nav>
      )}
    </header>
  );
}
