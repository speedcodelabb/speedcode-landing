// Escenas del vídeo "Cómo creamos tu web" y cuánto dura cada una.

export type SceneId =
  | "intro"
  | "requisitos"
  | "propuesta"
  | "diseno"
  | "desarrollo"
  | "pruebas"
  | "lanzamiento"
  | "cierre";

export const scenes: Array<{ id: SceneId; seconds: number }> = [
  { id: "intro", seconds: 4 },
  { id: "requisitos", seconds: 6 },
  { id: "propuesta", seconds: 5 },
  { id: "diseno", seconds: 6 },
  { id: "desarrollo", seconds: 6 },
  { id: "pruebas", seconds: 5 },
  { id: "lanzamiento", seconds: 5 },
  { id: "cierre", seconds: 4 },
];

export const FPS = 30;
/** Fundido entre escenas, en frames. */
export const TRANSITION_FRAMES = 15;

/**
 * Música de fondo opcional. Si existe public/musica/fondo.mp3 se incluye con
 * entrada y salida suaves; si no, el vídeo se renderiza sin audio.
 */
export const MUSIC_PATH = "musica/fondo.mp3";
export const MUSIC_VOLUME = 1;
export const MUSIC_FADE_SECONDS = 1.5;
