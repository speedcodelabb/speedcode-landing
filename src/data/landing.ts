import {
  Bot,
  Code2,
  Cpu,
  Database,
  Headphones,
  Layers3,
  MonitorCog,
  Rocket,
  Sparkles,
  Terminal,
  Workflow,
} from 'lucide-react';

export const maxMessageLength = 1600;
export const maxWhatsappMessageLength = 1200;

export const serviceNavItems = [
  { label: 'Automatización', href: '#automatizacion' },
  { label: 'Desarrollo Web', href: '#desarrollo-web' },
  { label: 'Apps de Escritorio', href: '#apps-escritorio' },
  { label: 'Análisis de datos', href: '#analisis-datos' },
  { label: 'Consultoría tecnológica', href: '#consultoria-tecnologica' },
  { label: 'Productos SaaS', href: '#productos-saas' },
  { label: 'Soporte y Mantenimiento', href: '#soporte-mantenimiento' },
];

export const services = [
  {
    id: 'automatizacion',
    icon: Bot,
    title: 'Automatización',
    body: 'Flujos inteligentes para responder clientes potenciales, conectar herramientas y reducir trabajo manual repetitivo.',
    proof: 'Menos tareas repetidas',
  },
  {
    id: 'desarrollo-web',
    icon: Code2,
    title: 'Desarrollo Web',
    body: 'Páginas de aterrizaje y sitios corporativos con diseño premium, texto claro y velocidad lista para convertir.',
    proof: 'Base comercial sólida',
  },
  {
    id: 'apps-escritorio',
    icon: MonitorCog,
    title: 'Apps de Escritorio',
    body: 'Aplicaciones internas para operaciones, inventario, reportes y procesos que necesitan estabilidad local.',
    proof: 'Herramientas internas',
  },
  {
    id: 'analisis-datos',
    icon: Database,
    title: 'Análisis de Datos',
    body: 'Dashboards, métricas y reportes claros para tomar decisiones con información real del negocio.',
    proof: 'Decisiones medibles',
  },
  {
    id: 'consultoria-tecnologica',
    icon: Sparkles,
    title: 'Consultoría Tecnológica',
    body: 'Diagnóstico, arquitectura y plan técnico para elegir bien antes de invertir tiempo y presupuesto.',
    proof: 'Ruta técnica clara',
  },
  {
    id: 'productos-saas',
    icon: Rocket,
    title: 'Productos SaaS',
    body: 'MVPs y plataformas listas para usuarios, pagos, paneles, roles y crecimiento progresivo.',
    proof: 'Producto escalable',
  },
  {
    id: 'soporte-mantenimiento',
    icon: Headphones,
    title: 'Soporte y Mantenimiento',
    body: 'Mejoras, monitoreo, correcciones y soporte continuo para que tu producto siga funcionando bien.',
    proof: 'Continuidad operativa',
  },
  {
    id: 'proyecto-medida',
    icon: Workflow,
    title: 'Proyecto a Medida',
    body: 'Si tu necesidad combina web, datos, automatización o soporte, armamos un alcance específico.',
    proof: 'Alcance flexible',
  },
];

export const values = [
  {
    icon: Cpu,
    title: 'Desarrollo Ágil',
    body: 'Entregas rápidas y continuas. Nos adaptamos a los cambios para que tu producto nunca se detenga.',
  },
  {
    icon: Layers3,
    title: 'Arquitectura Escalable',
    body: 'Diseñamos sistemas que crecen contigo. Infraestructura sólida preparada para más usuarios.',
  },
  {
    icon: Terminal,
    title: 'Código Limpio',
    body: 'Legibilidad, mantenibilidad y rendimiento extremo. Escribimos código que dura.',
  },
];

export const processSteps = [
  'Discovery de negocio y objetivos concretos',
  'Diseño visual, estructura y propuesta de conversión',
  'Desarrollo iterativo con control de calidad y rendimiento desde el inicio',
  'Lanzamiento, medición y mejoras continuas',
];

export const heroStats = [
  { value: '1-2 sem', label: 'primer avance visible' },
  { value: 'Web rápida', label: 'carga y navegación fluidas' },
  { value: 'Mobile first', label: 'lista para celulares' },
];

export const nextSteps = [
  'Revisamos tu objetivo y el estado actual del negocio.',
  'Definimos alcance, tecnología y prioridades de lanzamiento.',
  'Te enviamos una propuesta clara con tiempos y entregables.',
];

export function getWhatsappUrl(whatsappNumber: string, message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function truncateForWhatsapp(message: string) {
  if (message.length <= maxWhatsappMessageLength) return message;
  return `${message.slice(0, maxWhatsappMessageLength).trim()}...\n\nMensaje recortado para WhatsApp. La versión completa fue enviada por correo.`;
}
