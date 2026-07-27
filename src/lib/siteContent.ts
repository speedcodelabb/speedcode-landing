import { supabase, isSupabaseConfigured } from './supabase';

export type FaqItem = {
  question: string;
  answer: string;
};

export type SiteContent = {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  faqItems: FaqItem[];
};

export type PortfolioItem = {
  id: string;
  name: string;
  industry: string;
  metric: string;
  result: string;
  imageUrl: string | null;
  sortOrder: number;
};

// Mismos textos que hoy están hardcodeados en src/data/landing.ts.
// Sirven de valor por defecto hasta que se conecte Supabase y/o se
// edite algo desde /admin.
export const defaultSiteContent: SiteContent = {
  heroTitle: 'Soluciones de software a la velocidad del código',
  heroSubtitle:
    'Acelera tu visión digital con un equipo de desarrollo enfocado en el laboratorio. Expertos en agilidad, escalabilidad y arquitecturas de alto rendimiento.',
  aboutText:
    'SPEEDCODE Lab nació de la necesidad de transformar ideas complejas en realidades técnicas tangibles con una velocidad sin precedentes. No somos solo una agencia: somos un equipo de ingenieros obsesionados con la optimización.\n\nNuestro enfoque combina la agilidad de los últimos frameworks de desarrollo con la robustez de arquitecturas de nivel empresarial. En nuestro laboratorio, cada línea de código se somete a rigurosas pruebas de rendimiento y escalabilidad.',
  contactEmail: 'soluciones@speedcodelab.com',
  contactPhone: '0994 381 638',
  whatsappNumber: '595994381638',
  faqItems: [
    {
      question: '¿Cuánto cuesta desarrollar un sitio web?',
      answer:
        'El costo varía según la complejidad y las funcionalidades requeridas. Realizamos presupuestos a medida tras una fase de consultoría inicial para asegurar que pagas solo por lo que necesitas.',
    },
    {
      question: '¿Cuánto tiempo toma tener mi web lista?',
      answer:
        'Una landing page puede estar lista en 1-2 semanas, mientras que un sistema complejo o un e-commerce puede tomar de 4 a 8 semanas dependiendo de las integraciones.',
    },
    {
      question: '¿El sitio va a funcionar bien en celulares?',
      answer:
        'Absolutamente. Todos nuestros desarrollos son Mobile First por defecto, garantizando una experiencia perfecta en cualquier dispositivo.',
    },
    {
      question: '¿Incluyen hosting y dominio?',
      answer:
        'Te asesoramos en la compra del dominio y configuramos el hosting más eficiente, usualmente Vercel o AWS para máxima velocidad. El costo del servicio de terceros corre por cuenta del cliente.',
    },
    {
      question: '¿Puedo actualizar el contenido después?',
      answer:
        'Sí. Entregamos un panel de administración intuitivo para que puedas gestionar textos, imágenes y productos sin depender de nosotros.',
    },
  ],
};

export const defaultPortfolioItems: PortfolioItem[] = [
  {
    id: 'demo-1',
    name: 'Página comercial',
    industry: 'Servicios B2B',
    metric: '+38% intención de contacto',
    result: 'Estructura clara para captación de clientes potenciales, texto directo y WhatsApp como canal principal.',
    imageUrl: null,
    sortOrder: 0,
  },
  {
    id: 'demo-2',
    name: 'Panel operativo',
    industry: 'Operaciones internas',
    metric: '-12 h semanales manuales',
    result: 'Automatización de tareas internas, reportes y control de procesos críticos.',
    imageUrl: null,
    sortOrder: 1,
  },
  {
    id: 'demo-3',
    name: 'Producto SaaS',
    industry: 'Plataforma digital',
    metric: 'Base lista para escalar',
    result: 'Usuarios, dashboards, permisos, integraciones y arquitectura preparada para crecer.',
    imageUrl: null,
    sortOrder: 2,
  },
];

function mapContentRow(row: Record<string, unknown>): SiteContent {
  return {
    heroTitle: (row.hero_title as string) || defaultSiteContent.heroTitle,
    heroSubtitle: (row.hero_subtitle as string) || defaultSiteContent.heroSubtitle,
    aboutText: (row.about_text as string) || defaultSiteContent.aboutText,
    contactEmail: (row.contact_email as string) || defaultSiteContent.contactEmail,
    contactPhone: (row.contact_phone as string) || defaultSiteContent.contactPhone,
    whatsappNumber: (row.whatsapp_number as string) || defaultSiteContent.whatsappNumber,
    faqItems: Array.isArray(row.faq_items) && row.faq_items.length > 0 ? (row.faq_items as FaqItem[]) : defaultSiteContent.faqItems,
  };
}

function mapPortfolioRow(row: Record<string, unknown>): PortfolioItem {
  return {
    id: row.id as string,
    name: (row.name as string) || '',
    industry: (row.industry as string) || '',
    metric: (row.metric as string) || '',
    result: (row.result as string) || '',
    imageUrl: (row.image_url as string) || null,
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

export async function fetchSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured || !supabase) return defaultSiteContent;

  const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).maybeSingle();
  if (error || !data) return defaultSiteContent;
  return mapContentRow(data);
}

export async function fetchPortfolioItems(): Promise<PortfolioItem[]> {
  if (!isSupabaseConfigured || !supabase) return defaultPortfolioItems;

  const { data, error } = await supabase.from('portfolio_items').select('*').order('sort_order', { ascending: true });
  if (error || !data) return defaultPortfolioItems;
  return data.map(mapPortfolioRow);
}
