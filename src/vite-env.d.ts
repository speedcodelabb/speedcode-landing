/// <reference types="vite/client" />

interface TurnstileOptions {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  /** "interaction-only": invisible salvo que Cloudflare pida interacción. */
  appearance?: "always" | "execute" | "interaction-only";
  callback?: (token: string) => void;
  "before-interactive-callback"?: () => void;
  "after-interactive-callback"?: () => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
}

interface Window {
  turnstile?: {
    render: (container: HTMLElement, options: TurnstileOptions) => string;
    reset: (widgetId: string) => void;
    remove: (widgetId: string) => void;
  };
}
