import { useEffect, useRef } from "react";
import { useSiteContent } from "../context/SiteContentContext";
import { getServiceIcon } from "../lib/serviceIcons";

export const PROCESS_VIDEO_SRC = "/video/proceso.mp4";
export const PROCESS_VIDEO_POSTER = "/video/proceso-poster.jpg";

const STEPS = [
  "Requisitos",
  "Propuesta",
  "Diseño",
  "Desarrollo",
  "Pruebas",
  "Lanzamiento",
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Vídeo del proceso: se reproduce en silencio solo mientras está a la vista y
// nunca de forma automática si el visitante pidió reducir el movimiento.
export default function ProcessVideo() {
  const { content } = useSiteContent();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (
      !element ||
      prefersReducedMotion() ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void element.play().catch(() => undefined);
        else element.pause();
      },
      { threshold: 0.45 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="proceso"
      aria-labelledby="proceso-titulo"
      className="mt-24 scroll-mt-24"
    >
      <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase text-sky-300">
            Cómo trabajamos
          </p>
          <h2
            id="proceso-titulo"
            className="font-heading mt-3 text-4xl font-black uppercase md:text-5xl"
          >
            De la idea
            <span className="block bg-gradient-to-r from-sky-200 to-blue-500 bg-clip-text text-transparent">
              al lanzamiento
            </span>
          </h2>
        </div>
        <p className="max-w-lg text-base leading-8 text-slate-300">
          Así creamos una web: entendemos lo que necesitás, te proponemos un
          plan claro, diseñamos, desarrollamos con avances semanales, probamos y
          lanzamos.
        </p>
      </div>
      <div className="premium-card overflow-hidden rounded-[28px] border border-sky-300/14 bg-[#071126]/80">
        <video
          ref={video}
          className="block aspect-video h-auto w-full"
          width={2560}
          height={1440}
          src={PROCESS_VIDEO_SRC}
          poster={PROCESS_VIDEO_POSTER}
          preload="none"
          muted
          loop
          playsInline
          controls
          aria-describedby="proceso-descripcion"
        />
      </div>
      <p id="proceso-descripcion" className="sr-only">
        Vídeo de 38 segundos con música de fondo, sin narración, que muestra las
        etapas de un proyecto web en Speedcode Lab: {STEPS.join(", ")}.
      </p>
      <div className="mt-10">
        <p className="text-xs font-black uppercase text-sky-300">
          {content.commitments.eyebrow}
        </p>
        <h3 className="font-heading mt-3 text-2xl font-black uppercase md:text-3xl">
          {content.commitments.title}
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {content.commitments.items.map((item) => {
            const Icon = getServiceIcon(item.icon);
            return (
              <article
                key={item.id}
                className="premium-card overflow-hidden rounded-2xl border border-sky-300/14 bg-[#071126] p-6"
              >
                <Icon aria-hidden="true" className="h-6 w-6 text-sky-300" />
                <h4 className="font-heading mt-4 text-lg font-black">
                  {item.title}
                </h4>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
