import { useState } from 'react';
import { ChevronDown, Menu, MessageCircle, X } from 'lucide-react';
import logoMark from '../assets/speedcode-logo-mark.png';
import { serviceNavItems } from '../data/landing';

type NavbarProps = {
  defaultWhatsappUrl: string;
};

export default function Navbar({ defaultWhatsappUrl }: NavbarProps) {
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenus = () => {
    setServicesMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const navContent = (
    <>
      <a href="#inicio" onClick={closeMenus} className="premium-nav-link">
        Inicio
      </a>
      <div
        className="relative"
        onMouseEnter={() => setServicesMenuOpen(true)}
        onMouseLeave={() => setServicesMenuOpen(false)}
      >
        <button
          type="button"
          onClick={() => setServicesMenuOpen((isOpen) => !isOpen)}
          className="premium-nav-link inline-flex items-center gap-1"
          aria-expanded={servicesMenuOpen}
        >
          Servicios
          <ChevronDown className={`h-4 w-4 transition ${servicesMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        <div
          className={`absolute right-0 top-9 z-30 w-72 border border-sky-300/15 bg-[#071126]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition ${
            servicesMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'
          }`}
        >
          {serviceNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenus}
              className="block px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-sky-300/10 hover:text-sky-100"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
      <a href="#portafolio" onClick={closeMenus} className="premium-nav-link">
        Portafolio
      </a>
      <a href="#contacto" onClick={closeMenus} className="premium-nav-link">
        Contacto
      </a>
    </>
  );

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-[1240px] -translate-x-1/2 rounded-[22px] border border-sky-300/15 bg-[#041024]/78 px-3.5 py-2.5 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:top-7 md:w-[calc(100%-120px)] md:rounded-full md:px-5">
      <div className="flex items-center justify-between gap-3">
        <a href="#inicio" className="flex min-w-0 items-center gap-2.5 md:gap-3" onClick={closeMenus}>
          <img src={logoMark} alt="Speedcode" className="h-9 w-9 rounded-full object-cover md:h-10 md:w-10" />
          <span className="truncate text-sm font-black uppercase text-white min-[390px]:text-base md:text-lg">Speedcode Lab</span>
        </a>

        <div className="hidden items-center gap-4 md:flex xl:gap-5">
          <nav className="flex items-center gap-4 xl:gap-5">{navContent}</nav>
          <a
            href={defaultWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-[#041022] transition hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300/70"
          >
            WhatsApp
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={defaultWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir WhatsApp"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#041022]"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            aria-label="Abrir navegación"
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-300/20 bg-sky-300/8 text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="mt-4 grid gap-2 border-t border-sky-300/10 pt-4 md:hidden">
          <a href="#inicio" onClick={closeMenus} className="px-3 py-3 text-sm font-bold text-slate-200">
            Inicio
          </a>
          <a href="#servicios" onClick={closeMenus} className="px-3 py-3 text-sm font-bold text-slate-200">
            Servicios
          </a>
          {serviceNavItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenus} className="px-6 py-2 text-sm font-semibold text-slate-400">
              {item.label}
            </a>
          ))}
          <a href="#portafolio" onClick={closeMenus} className="px-3 py-3 text-sm font-bold text-slate-200">
            Portafolio
          </a>
          <a href="#contacto" onClick={closeMenus} className="px-3 py-3 text-sm font-bold text-slate-200">
            Contacto
          </a>
        </nav>
      )}
    </header>
  );
}
