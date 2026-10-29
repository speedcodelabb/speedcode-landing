import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import type { FC } from "react";
import { interpolate, staticFile, useVideoConfig } from "remotion";
import {
  FPS,
  MUSIC_FADE_SECONDS,
  MUSIC_VOLUME,
  scenes,
  TRANSITION_FRAMES,
  type SceneId,
} from "./guion";
import {
  CierreScene,
  DesarrolloScene,
  DisenoScene,
  IntroScene,
  LanzamientoScene,
  PropuestaScene,
  PruebasScene,
  RequisitosScene,
} from "./scenes";

const SCENE_COMPONENTS: Record<SceneId, FC> = {
  intro: IntroScene,
  requisitos: RequisitosScene,
  propuesta: PropuestaScene,
  diseno: DisenoScene,
  desarrollo: DesarrolloScene,
  pruebas: PruebasScene,
  lanzamiento: LanzamientoScene,
  cierre: CierreScene,
};

const sceneFrames = scenes.map((scene) => Math.round(scene.seconds * FPS));

export const PROCESO_DURATION =
  sceneFrames.reduce((sum, value) => sum + value, 0) -
  TRANSITION_FRAMES * (sceneFrames.length - 1);

export type ProcesoProps = {
  /** Ruta (relativa a public/) de la música de fondo, o null para vídeo mudo. */
  music: string | null;
};

function Music({ src }: { src: string }) {
  const { durationInFrames, fps } = useVideoConfig();
  const fadeFrames = MUSIC_FADE_SECONDS * fps;
  return (
    <Audio
      src={staticFile(src)}
      volume={(frame) =>
        MUSIC_VOLUME *
        interpolate(
          frame,
          [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
  );
}

export const Proceso: FC<ProcesoProps> = ({ music }) => (
  <>
    <TransitionSeries>
      {scenes.flatMap((scene, index) => {
        const Scene = SCENE_COMPONENTS[scene.id];
        const items = [
          <TransitionSeries.Sequence
            key={scene.id}
            durationInFrames={sceneFrames[index]}
          >
            <Scene />
          </TransitionSeries.Sequence>,
        ];
        if (index < scenes.length - 1)
          items.push(
            <TransitionSeries.Transition
              key={`${scene.id}-fade`}
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
            />,
          );
        return items;
      })}
    </TransitionSeries>
    {music ? <Music src={music} /> : null}
  </>
);
