import {
  Bot,
  Boxes,
  Code2,
  Cpu,
  Database,
  Globe,
  Headphones,
  Layers3,
  LineChart,
  MonitorCog,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type ServiceIconKey =
  | 'bot'
  | 'code'
  | 'desktop'
  | 'database'
  | 'sparkles'
  | 'rocket'
  | 'support'
  | 'workflow'
  | 'cpu'
  | 'layers'
  | 'terminal'
  | 'globe'
  | 'shield'
  | 'wrench'
  | 'chart'
  | 'boxes';

export const serviceIconOptions: { key: ServiceIconKey; label: string; Icon: LucideIcon }[] = [
  { key: 'bot', label: 'Automatización', Icon: Bot },
  { key: 'code', label: 'Desarrollo', Icon: Code2 },
  { key: 'desktop', label: 'Escritorio', Icon: MonitorCog },
  { key: 'database', label: 'Datos', Icon: Database },
  { key: 'sparkles', label: 'Consultoría', Icon: Sparkles },
  { key: 'rocket', label: 'SaaS', Icon: Rocket },
  { key: 'support', label: 'Soporte', Icon: Headphones },
  { key: 'workflow', label: 'Procesos', Icon: Workflow },
  { key: 'cpu', label: 'Rendimiento', Icon: Cpu },
  { key: 'layers', label: 'Arquitectura', Icon: Layers3 },
  { key: 'terminal', label: 'Código', Icon: Terminal },
  { key: 'globe', label: 'Web', Icon: Globe },
  { key: 'shield', label: 'Seguridad', Icon: ShieldCheck },
  { key: 'wrench', label: 'Mantenimiento', Icon: Wrench },
  { key: 'chart', label: 'Métricas', Icon: LineChart },
  { key: 'boxes', label: 'Producto', Icon: Boxes },
];

const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  serviceIconOptions.map(({ key, Icon }) => [key, Icon]),
);

export function getServiceIcon(key: string): LucideIcon {
  return iconMap[key] ?? Sparkles;
}
