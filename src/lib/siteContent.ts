import { z } from "zod";

const viteEnvironment = import.meta.env as ImportMetaEnv | undefined;
const publicSupabaseUrl = viteEnvironment?.VITE_SUPABASE_URL as
  string | undefined;
const publicSupabaseAnonKey = viteEnvironment?.VITE_SUPABASE_ANON_KEY as
  string | undefined;

export const iconKeySchema = z.enum([
  "bot",
  "code",
  "cpu",
  "database",
  "desktop",
  "layers",
  "rocket",
  "sparkles",
  "support",
  "terminal",
  "workflow",
]);
const requiredText = z.string().trim().min(1);
const optionalHttpsUrl = z.union([
  z.literal(""),
  z
    .string()
    .url()
    .refine((value) => value.startsWith("https://"), "La URL debe usar HTTPS"),
]);

export const siteDocumentSchema = z
  .object({
    schemaVersion: z.literal(1),
    navigation: z.object({
      home: requiredText,
      services: requiredText,
      portfolio: requiredText,
      contact: requiredText,
      whatsapp: requiredText,
    }),
    hero: z.object({
      eyebrow: requiredText,
      title: requiredText,
      subtitle: requiredText,
      primaryCta: requiredText,
      secondaryCta: requiredText,
      stats: z
        .array(
          z.object({
            id: requiredText,
            value: requiredText,
            label: requiredText,
          }),
        )
        .min(1)
        .max(6),
    }),
    services: z.object({
      eyebrow: requiredText,
      title: requiredText,
      highlight: requiredText,
      description: requiredText,
      items: z
        .array(
          z.object({
            id: requiredText,
            icon: iconKeySchema,
            title: requiredText,
            body: requiredText,
            proof: requiredText,
          }),
        )
        .min(1)
        .max(16),
    }),
    about: z.object({
      title: requiredText,
      highlight: requiredText,
      paragraphs: z.array(requiredText).min(1).max(8),
      methodEyebrow: requiredText,
      methodTitle: requiredText,
      steps: z
        .array(z.object({ id: requiredText, text: requiredText }))
        .min(1)
        .max(12),
    }),
    values: z.object({
      title: requiredText,
      highlight: requiredText,
      items: z
        .array(
          z.object({
            id: requiredText,
            icon: iconKeySchema,
            title: requiredText,
            body: requiredText,
          }),
        )
        .min(1)
        .max(12),
    }),
    portfolio: z.object({
      eyebrow: requiredText,
      title: requiredText,
      highlight: requiredText,
      ctaLabel: requiredText,
      items: z
        .array(
          z.object({
            id: requiredText,
            name: requiredText,
            industry: requiredText,
            metric: requiredText,
            result: requiredText,
            imagePath: z.string().nullable(),
            link: optionalHttpsUrl.nullable(),
          }),
        )
        .max(24),
    }),
    faq: z.object({
      title: requiredText,
      highlight: requiredText,
      items: z
        .array(
          z.object({
            id: requiredText,
            question: requiredText,
            answer: requiredText,
          }),
        )
        .min(1)
        .max(24),
    }),
    contact: z.object({
      eyebrow: requiredText,
      title: requiredText,
      highlight: requiredText,
      description: requiredText,
      email: z.string().email(),
      phoneLabel: requiredText,
      whatsappNumber: z.string().regex(/^\d{8,18}$/),
      directWhatsappLabel: requiredText,
      nextStepsTitle: requiredText,
      nextSteps: z
        .array(z.object({ id: requiredText, text: requiredText }))
        .min(1)
        .max(8),
      projectTypes: z
        .array(
          z.object({
            id: requiredText.regex(/^[a-z0-9-]+$/),
            label: requiredText,
          }),
        )
        .min(1)
        .max(16),
    }),
    footer: z.object({
      description: requiredText,
      servicesTitle: requiredText,
      contactTitle: requiredText,
      tagline: requiredText,
    }),
  })
  .superRefine((document, context) => {
    const collections = [
      document.hero.stats,
      document.services.items,
      document.about.steps,
      document.values.items,
      document.portfolio.items,
      document.faq.items,
      document.contact.nextSteps,
      document.contact.projectTypes,
    ];
    for (const collection of collections) {
      if (new Set(collection.map((item) => item.id)).size !== collection.length)
        context.addIssue({
          code: "custom",
          message: "Los IDs deben ser únicos dentro de cada lista.",
        });
    }
  });

export type SiteDocument = z.infer<typeof siteDocumentSchema>;
export type IconKey = z.infer<typeof iconKeySchema>;
export type ServiceItem = SiteDocument["services"]["items"][number];
export type PortfolioItem = SiteDocument["portfolio"]["items"][number];
export type FaqItem = SiteDocument["faq"]["items"][number];
export type DraftRecord = {
  content: SiteDocument;
  revision: number;
  baseVersion: number;
  updatedAt: string;
};
export type ContentVersion = {
  version: number;
  content: SiteDocument;
  publishedAt: string;
};

export const defaultSiteDocument: SiteDocument = {
  schemaVersion: 1,
  navigation: {
    home: "Inicio",
    services: "Servicios",
    portfolio: "Portafolio",
    contact: "Contacto",
    whatsapp: "WhatsApp",
  },
  hero: {
    eyebrow: "Desarrollo web, software y automatización",
    title: "Soluciones de software a la velocidad del código",
    subtitle:
      "Acelera tu visión digital con un equipo de desarrollo enfocado en rendimiento, escalabilidad y arquitecturas de alto nivel.",
    primaryCta: "Solicitar presupuesto",
    secondaryCta: "Ver servicios",
    stats: [
      { id: "primer-avance", value: "1-2 sem", label: "primer avance visible" },
      {
        id: "rendimiento",
        value: "Web rápida",
        label: "carga y navegación fluidas",
      },
      { id: "mobile", value: "Mobile first", label: "lista para celulares" },
    ],
  },
  services: {
    eyebrow: "Qué construimos",
    title: "Soluciones de software",
    highlight: "a la velocidad del código",
    description:
      "Aceleramos tu visión digital con un equipo enfocado en rendimiento, escalabilidad y diseño que convierte.",
    items: [
      {
        id: "automatizacion",
        icon: "bot",
        title: "Automatización",
        body: "Flujos inteligentes para responder clientes potenciales, conectar herramientas y reducir trabajo manual repetitivo.",
        proof: "Menos tareas repetidas",
      },
      {
        id: "desarrollo-web",
        icon: "code",
        title: "Desarrollo Web",
        body: "Páginas de aterrizaje y sitios corporativos con diseño premium, texto claro y velocidad lista para convertir.",
        proof: "Base comercial sólida",
      },
      {
        id: "apps-escritorio",
        icon: "desktop",
        title: "Apps de Escritorio",
        body: "Aplicaciones internas para operaciones, inventario, reportes y procesos que necesitan estabilidad local.",
        proof: "Herramientas internas",
      },
      {
        id: "analisis-datos",
        icon: "database",
        title: "Análisis de Datos",
        body: "Dashboards, métricas y reportes claros para tomar decisiones con información real del negocio.",
        proof: "Decisiones medibles",
      },
      {
        id: "consultoria-tecnologica",
        icon: "sparkles",
        title: "Consultoría Tecnológica",
        body: "Diagnóstico, arquitectura y plan técnico para elegir bien antes de invertir tiempo y presupuesto.",
        proof: "Ruta técnica clara",
      },
      {
        id: "productos-saas",
        icon: "rocket",
        title: "Productos SaaS",
        body: "MVPs y plataformas listas para usuarios, pagos, paneles, roles y crecimiento progresivo.",
        proof: "Producto escalable",
      },
      {
        id: "soporte-mantenimiento",
        icon: "support",
        title: "Soporte y Mantenimiento",
        body: "Mejoras, monitoreo, correcciones y soporte continuo para que tu producto siga funcionando bien.",
        proof: "Continuidad operativa",
      },
      {
        id: "proyecto-medida",
        icon: "workflow",
        title: "Proyecto a Medida",
        body: "Si tu necesidad combina web, datos, automatización o soporte, armamos un alcance específico.",
        proof: "Alcance flexible",
      },
    ],
  },
  about: {
    title: "Sobre nuestro",
    highlight: "laboratorio",
    paragraphs: [
      "SPEEDCODE Lab nació de la necesidad de transformar ideas complejas en realidades técnicas tangibles con una velocidad sin precedentes. No somos solo una agencia: somos un equipo de ingenieros obsesionados con la optimización.",
      "Nuestro enfoque combina la agilidad de los últimos frameworks de desarrollo con la robustez de arquitecturas de nivel empresarial. En nuestro laboratorio, cada línea de código se somete a rigurosas pruebas de rendimiento y escalabilidad.",
    ],
    methodEyebrow: "Método Speedcode",
    methodTitle: "Ejecución técnica con foco comercial",
    steps: [
      { id: "discovery", text: "Discovery de negocio y objetivos concretos" },
      {
        id: "diseno",
        text: "Diseño visual, estructura y propuesta de conversión",
      },
      {
        id: "desarrollo",
        text: "Desarrollo iterativo con control de calidad y rendimiento desde el inicio",
      },
      { id: "lanzamiento", text: "Lanzamiento, medición y mejoras continuas" },
    ],
  },
  values: {
    title: "Nuestra misión y",
    highlight: "valores positivos",
    items: [
      {
        id: "agil",
        icon: "cpu",
        title: "Desarrollo Ágil",
        body: "Entregas rápidas y continuas. Nos adaptamos a los cambios para que tu producto nunca se detenga.",
      },
      {
        id: "escalable",
        icon: "layers",
        title: "Arquitectura Escalable",
        body: "Diseñamos sistemas que crecen contigo. Infraestructura sólida preparada para más usuarios.",
      },
      {
        id: "limpio",
        icon: "terminal",
        title: "Código Limpio",
        body: "Legibilidad, mantenibilidad y rendimiento extremo. Escribimos código que dura.",
      },
    ],
  },
  portfolio: {
    eyebrow: "Portafolio",
    title: "Proyectos pensados",
    highlight: "para vender y operar mejor",
    ctaLabel: "Consultar disponibilidad",
    items: [
      {
        id: "demo-1",
        name: "Página comercial",
        industry: "Servicios B2B",
        metric: "+38% intención de contacto",
        result:
          "Estructura clara para captación de clientes potenciales, texto directo y WhatsApp como canal principal.",
        imagePath: null,
        link: null,
      },
      {
        id: "demo-2",
        name: "Panel operativo",
        industry: "Operaciones internas",
        metric: "-12 h semanales manuales",
        result:
          "Automatización de tareas internas, reportes y control de procesos críticos.",
        imagePath: null,
        link: null,
      },
      {
        id: "demo-3",
        name: "Producto SaaS",
        industry: "Plataforma digital",
        metric: "Base lista para escalar",
        result:
          "Usuarios, dashboards, permisos, integraciones y arquitectura preparada para crecer.",
        imagePath: null,
        link: null,
      },
    ],
  },
  faq: {
    title: "Preguntas",
    highlight: "frecuentes",
    items: [
      {
        id: "precio",
        question: "¿Cuánto cuesta desarrollar un sitio web?",
        answer:
          "El costo varía según la complejidad y las funcionalidades requeridas. Realizamos presupuestos a medida tras una consultoría inicial.",
      },
      {
        id: "tiempo",
        question: "¿Cuánto tiempo toma tener mi web lista?",
        answer:
          "Una landing page puede estar lista en 1-2 semanas; un sistema complejo puede tomar de 4 a 8 semanas según sus integraciones.",
      },
      {
        id: "celulares",
        question: "¿El sitio va a funcionar bien en celulares?",
        answer:
          "Sí. Todos nuestros desarrollos son Mobile First y se prueban en múltiples tamaños de pantalla.",
      },
      {
        id: "hosting",
        question: "¿Incluyen hosting y dominio?",
        answer:
          "Asesoramos en la compra del dominio y configuramos el hosting. Los servicios de terceros se presupuestan por separado.",
      },
      {
        id: "contenido",
        question: "¿Puedo actualizar el contenido después?",
        answer:
          "Sí. El panel permite gestionar el contenido principal sin modificar código.",
      },
    ],
  },
  contact: {
    eyebrow: "Contacto",
    title: "Trabajemos",
    highlight: "juntos",
    description:
      "Cuéntanos qué necesitas construir. Te respondemos con alcance, tiempos y una ruta clara para avanzar.",
    email: "soluciones@speedcodelab.com",
    phoneLabel: "0994 381 638",
    whatsappNumber: "595994381638",
    directWhatsappLabel: "WhatsApp directo",
    nextStepsTitle: "Qué pasa después",
    nextSteps: [
      {
        id: "revision",
        text: "Revisamos tu objetivo y el estado actual del negocio.",
      },
      {
        id: "alcance",
        text: "Definimos alcance, tecnología y prioridades de lanzamiento.",
      },
      {
        id: "propuesta",
        text: "Te enviamos una propuesta clara con tiempos y entregables.",
      },
    ],
    projectTypes: [
      { id: "automation", label: "Automatización" },
      { id: "web-development", label: "Desarrollo Web" },
      { id: "desktop-app", label: "Apps de Escritorio" },
      { id: "data-analysis", label: "Análisis de datos" },
      { id: "consulting", label: "Consultoría tecnológica" },
      { id: "saas", label: "Productos SaaS" },
      { id: "maintenance", label: "Soporte y Mantenimiento" },
    ],
  },
  footer: {
    description:
      "Desarrollo web, automatización y productos digitales para empresas que necesitan moverse rápido sin sacrificar arquitectura.",
    servicesTitle: "Servicios",
    contactTitle: "Contacto",
    tagline: "Software, automatización y estrategia técnica desde Paraguay.",
  },
};

export function parseSiteDocument(value: unknown): SiteDocument {
  return siteDocumentSchema.parse(value);
}

export async function fetchPublishedDocument(): Promise<SiteDocument> {
  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    console.warn(
      "Supabase público no está configurado; se usará la copia base.",
    );
    return defaultSiteDocument;
  }
  try {
    const response = await fetch(
      `${publicSupabaseUrl}/rest/v1/site_content?id=eq.1&select=content`,
      {
        headers: {
          apikey: publicSupabaseAnonKey,
          Authorization: `Bearer ${publicSupabaseAnonKey}`,
          Accept: "application/json",
        },
      },
    );
    if (!response.ok) throw new Error(`Supabase respondió ${response.status}.`);
    const rows = (await response.json()) as Array<{ content?: unknown }>;
    const parsed = siteDocumentSchema.safeParse(rows[0]?.content);
    if (!parsed.success) throw parsed.error;
    return parsed.data;
  } catch (error) {
    console.error("No se pudo cargar el contenido publicado", error);
    return defaultSiteDocument;
  }
}

export function getPublicMediaUrl(path: string | null): string | null {
  if (!path || !publicSupabaseUrl) return null;
  const safePath = path.split("/").map(encodeURIComponent).join("/");
  return `${publicSupabaseUrl}/storage/v1/object/public/site-media/${safePath}`;
}

export function getWhatsappUrl(
  whatsappNumber: string,
  message: string,
): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
