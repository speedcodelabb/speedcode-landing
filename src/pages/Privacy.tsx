import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useSiteContent } from "../context/SiteContentContext";
import { BUDGET_WHATSAPP_MESSAGE, getWhatsappUrl } from "../lib/siteContent";

export default function Privacy() {
  const { content } = useSiteContent();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Política de privacidad | SPEEDCODE Lab";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020614] text-white">
      <header className="mx-auto max-w-4xl px-5 py-8 md:px-8">
        <Link
          to="/"
          className="inline-flex min-h-12 items-center font-bold text-sky-300 hover:text-sky-100"
        >
          ← Volver al inicio de SPEEDCODE Lab
        </Link>
      </header>
      <main className="mx-auto max-w-4xl px-5 pb-20 md:px-8">
        <h1 className="font-heading text-4xl font-black md:text-5xl">
          Política de privacidad
        </h1>
        <p className="mt-4 text-sm text-slate-400">
          Última actualización: 29 de octubre de 2026.
        </p>
        <div className="mt-10 grid gap-8 leading-8 text-slate-300 [&_h2]:font-heading [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_a]:break-all [&_a]:text-sky-300 [&_a]:underline [&_a]:underline-offset-4">
          <section aria-labelledby="privacidad-responsable">
            <h2 id="privacidad-responsable">Quién es responsable</h2>
            <p>
              SPEEDCODE Lab, en Asunción, Paraguay, es responsable del
              tratamiento de tus datos de acuerdo con la normativa aplicable en
              Paraguay. Podés escribirnos a{" "}
              <a href="mailto:soluciones@speedcodelab.com">
                soluciones@speedcodelab.com
              </a>
              .
            </p>
          </section>
          <section aria-labelledby="privacidad-datos">
            <h2 id="privacidad-datos">Qué datos recibimos y para qué</h2>
            <p>
              El formulario recoge tu nombre, email, tipo de proyecto y mensaje.
              Los usamos para responder tu consulta y preparar una propuesta. No
              los usamos para publicidad ni los vendemos.
            </p>
            <p className="mt-3">
              Tu dirección IP no se guarda. Solo usamos un hash (HMAC) para
              limitar los envíos abusivos; ese hash se descarta tras la ventana
              de 15 minutos.
            </p>
          </section>
          <section aria-labelledby="privacidad-proveedores">
            <h2 id="privacidad-proveedores">Proveedores que intervienen</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Supabase: base de datos en la región de São Paulo.</li>
              <li>Vercel: alojamiento del sitio.</li>
              <li>Cloudflare Turnstile: protección contra bots.</li>
              <li>
                Resend: aviso por email al equipo cuando llega una consulta.
              </li>
              <li>Google Fonts: tipografías del sitio.</li>
            </ul>
            <p className="mt-3">
              Si elegís WhatsApp, incluida la conversación que se abre al enviar
              el formulario, esa conversación se rige por las políticas de
              WhatsApp/Meta.
            </p>
          </section>
          <section aria-labelledby="privacidad-conservacion">
            <h2 id="privacidad-conservacion">
              Cuánto tiempo conservamos las consultas
            </h2>
            <p>
              Conservamos las consultas mientras sean necesarias para la
              relación comercial. Las consultas archivadas se eliminan
              automáticamente a los 180 días. Podés pedir que las borremos
              antes.
            </p>
          </section>
          <section aria-labelledby="privacidad-derechos">
            <h2 id="privacidad-derechos">Tus derechos</h2>
            <p>
              Podés acceder, corregir o eliminar tus datos escribiendo a{" "}
              <a href="mailto:soluciones@speedcodelab.com">
                soluciones@speedcodelab.com
              </a>
              .
            </p>
          </section>
          <section aria-labelledby="privacidad-cookies">
            <h2 id="privacidad-cookies">Cookies</h2>
            <p>
              El sitio no usa cookies de publicidad ni de analítica. Cloudflare
              Turnstile puede usar las cookies estrictamente necesarias para su
              verificación.
            </p>
          </section>
        </div>
      </main>
      <Footer
        defaultWhatsappUrl={getWhatsappUrl(
          content.contact.whatsappNumber,
          BUDGET_WHATSAPP_MESSAGE,
        )}
      />
    </div>
  );
}
