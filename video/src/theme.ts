import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

// Mismos colores y tipografías que la landing (src/index.css y Tailwind).
export const colors = {
  background: "#020614",
  card: "#071126",
  cardDeep: "#030918",
  sky100: "#e0f2fe",
  sky200: "#bae6fd",
  sky300: "#7dd3fc",
  sky400: "#38bdf8",
  blue500: "#3b82f6",
  blue600: "#2563eb",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  slate500: "#64748b",
  white: "#ffffff",
  border: "rgba(125, 211, 252, 0.16)",
  emerald: "#34d399",
};

export const fonts = {
  heading: loadGrotesk("normal", {
    weights: ["500", "700"],
    subsets: ["latin"],
  }).fontFamily,
  body: loadJakarta("normal", {
    weights: ["400", "600", "800"],
    subsets: ["latin", "latin-ext"],
  }).fontFamily,
  mono: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
};

export const gradientText = {
  backgroundImage: `linear-gradient(90deg, ${colors.sky100}, ${colors.sky300}, ${colors.blue500})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;
