import { useMemo } from "react";
import About from "../components/About";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Portfolio from "../components/Portfolio";
import ServicesDetails from "../components/ServicesDetails";
import Values from "../components/Values";
import { useSiteContent } from "../context/SiteContentContext";
import { getWhatsappUrl } from "../lib/siteContent";

export default function Home() {
  const { content } = useSiteContent();
  const defaultWhatsappUrl = useMemo(
    () =>
      getWhatsappUrl(
        content.contact.whatsappNumber,
        "Hola Speedcode Lab, quiero hablar sobre un proyecto y recibir una propuesta.",
      ),
    [content.contact.whatsappNumber],
  );

  return (
    <div className="min-h-screen bg-[#020614] text-white">
      <Navbar defaultWhatsappUrl={defaultWhatsappUrl} />
      <Hero />
      <main className="ambient-shell relative mx-auto max-w-[1240px] px-5 py-20 md:px-8">
        <div className="section-flow-line" aria-hidden="true" />
        <ServicesDetails />
        <About />
        <Values />
        <Portfolio defaultWhatsappUrl={defaultWhatsappUrl} />
        <FAQ />
        <Contact defaultWhatsappUrl={defaultWhatsappUrl} />
      </main>
      <Footer defaultWhatsappUrl={defaultWhatsappUrl} />
    </div>
  );
}
