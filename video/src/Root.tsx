import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import type { FC } from "react";
import {
  AbsoluteFill,
  Composition,
  staticFile,
  type CalculateMetadataFunction,
} from "remotion";
import { FPS, MUSIC_PATH } from "./guion";
import { Proceso, PROCESO_DURATION, type ProcesoProps } from "./Proceso";
import { VerticalContext } from "./ui";

async function exists(path: string): Promise<boolean> {
  try {
    const input = new Input({
      formats: ALL_FORMATS,
      source: new UrlSource(staticFile(path), { getRetryDelay: () => null }),
    });
    await input.computeDuration();
    return true;
  } catch {
    return false;
  }
}

// Las escenas están diseñadas a 1920×1080. Para un vídeo más nítido se
// renderizan a 2560×1440 con zoom de CSS: el navegador vuelve a dibujar texto y
// bordes a la resolución final en lugar de escalar una imagen.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const OUTPUT_WIDTH = 2560;
const OUTPUT_HEIGHT = 1440;

const ProcesoHD: FC<ProcesoProps> = (props) => (
  <AbsoluteFill>
    <div
      style={{
        position: "relative",
        width: DESIGN_WIDTH,
        height: DESIGN_HEIGHT,
        overflow: "hidden",
        zoom: OUTPUT_WIDTH / DESIGN_WIDTH,
      }}
    >
      <Proceso {...props} />
    </div>
  </AbsoluteFill>
);

// Versión vertical para Instagram Reels, a la resolución nativa de la app.
const ProcesoReel: FC<ProcesoProps> = (props) => (
  <VerticalContext.Provider value>
    <Proceso {...props} />
  </VerticalContext.Provider>
);

// Incluye la música solo si el archivo existe en public/.
const calculateMetadata: CalculateMetadataFunction<
  ProcesoProps
> = async () => ({
  props: { music: (await exists(MUSIC_PATH)) ? MUSIC_PATH : null },
});

export const RemotionRoot = () => (
  <>
    <Composition
      id="Proceso"
      component={ProcesoHD}
      fps={FPS}
      width={OUTPUT_WIDTH}
      height={OUTPUT_HEIGHT}
      durationInFrames={PROCESO_DURATION}
      defaultProps={{ music: null }}
      calculateMetadata={calculateMetadata}
    />
    <Composition
      id="ProcesoReel"
      component={ProcesoReel}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={PROCESO_DURATION}
      defaultProps={{ music: null }}
      calculateMetadata={calculateMetadata}
    />
  </>
);
