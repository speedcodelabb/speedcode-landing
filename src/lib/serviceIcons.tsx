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
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "./siteContent";

export const serviceIcons: Record<IconKey, LucideIcon> = {
  bot: Bot,
  code: Code2,
  cpu: Cpu,
  database: Database,
  desktop: MonitorCog,
  layers: Layers3,
  rocket: Rocket,
  sparkles: Sparkles,
  support: Headphones,
  terminal: Terminal,
  workflow: Workflow,
};

export const serviceIconOptions = Object.keys(serviceIcons) as IconKey[];
export function getServiceIcon(key: IconKey): LucideIcon {
  return serviceIcons[key] ?? Sparkles;
}
