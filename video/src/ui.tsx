import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, gradientText } from "./theme";

/** true en la versión vertical (Reels, 1080×1920). */
export const VerticalContext = createContext(false);
export const useVertical = () => useContext(VerticalContext);

/** Progreso 0→1 de una entrada suave que empieza `delay` frames después. */
export function useEnter(
  delay = 0,
  config: { damping?: number; stiffness?: number } = { damping: 200 },
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
}

/** Aparece desde abajo con fundido. */
export function Reveal({
  delay = 0,
  distance = 28,
  children,
  style,
}: {
  delay?: number;
  distance?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const progress = useEnter(delay);
  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * distance}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Background() {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 30;
  return (
    <AbsoluteFill
      style={{ backgroundColor: colors.background, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${colors.border} 1px, transparent 1px), linear-gradient(90deg, ${colors.border} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.18,
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: -260 + drift,
          top: -320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14,165,233,0.30), transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          right: -240 - drift,
          bottom: -360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.26), transparent 65%)",
        }}
      />
    </AbsoluteFill>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: `linear-gradient(180deg, rgba(7,17,38,0.96), rgba(3,9,24,0.96))`,
        border: `1.5px solid ${colors.border}`,
        borderRadius: 28,
        boxShadow: "0 40px 120px rgba(0,0,0,0.45)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function BrowserFrame({
  url,
  children,
  width = 860,
  height = 560,
}: {
  url: string;
  children: ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <Card
      style={{
        width,
        height,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 22px",
          borderBottom: `1.5px solid ${colors.border}`,
        }}
      >
        {["#f87171", "#fbbf24", "#34d399"].map((dot) => (
          <span
            key={dot}
            style={{
              width: 13,
              height: 13,
              borderRadius: 7,
              background: dot,
              opacity: 0.8,
            }}
          />
        ))}
        <div
          style={{
            marginLeft: 18,
            flex: 1,
            padding: "8px 18px",
            borderRadius: 999,
            background: "rgba(125,211,252,0.07)",
            color: colors.slate300,
            fontFamily: fonts.body,
            fontSize: 20,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ position: "relative", flex: 1 }}>{children}</div>
    </Card>
  );
}

const STEP_LABELS = [
  "Requisitos",
  "Propuesta",
  "Diseño",
  "Desarrollo",
  "Pruebas",
  "Lanzamiento",
];

function ProgressRail({ active }: { active: number }) {
  const fill = useEnter(6);
  const vertical = useVertical();
  return (
    <div
      style={{
        position: "absolute",
        left: vertical ? 90 : 120,
        right: vertical ? 90 : 120,
        // En vertical queda por encima de la zona que tapa la descripción de Reels.
        bottom: vertical ? 420 : 70,
        display: "flex",
        gap: vertical ? 12 : 18,
      }}
    >
      {STEP_LABELS.map((label, index) => {
        const done = index < active;
        const current = index === active;
        const width = done ? 1 : current ? fill : 0;
        return (
          <div key={label} style={{ flex: 1 }}>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "rgba(125,211,252,0.12)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${width * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${colors.blue600}, ${colors.sky300})`,
                }}
              />
            </div>
            {vertical ? null : (
              <p
                style={{
                  margin: "12px 0 0",
                  fontFamily: fonts.body,
                  fontWeight: 800,
                  fontSize: vertical ? 14 : 18,
                  letterSpacing: vertical ? 1 : 2,
                  textTransform: "uppercase",
                  color: current
                    ? colors.sky200
                    : done
                      ? colors.slate400
                      : colors.slate500,
                }}
              >
                {label}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Maqueta común de los seis pasos: texto a la izquierda y visual a la derecha
 * (en vertical, texto arriba y visual debajo). */
export function StepLayout({
  index,
  title,
  subtitle,
  children,
}: {
  index: number;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const vertical = useVertical();
  const numberOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Background />
      <div
        style={{
          position: "absolute",
          left: vertical ? 90 : 120,
          top: vertical ? 250 : 150,
          width: vertical ? 900 : 700,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: vertical ? 160 : 150,
            lineHeight: 1,
            color: "rgba(125,211,252,0.14)",
            opacity: numberOpacity,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </p>
        <Reveal delay={4}>
          <h2
            style={{
              margin: "10px 0 0",
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: vertical ? 120 : 92,
              lineHeight: 1,
              letterSpacing: -2,
              textTransform: "uppercase",
              ...gradientText,
            }}
          >
            {title}
          </h2>
        </Reveal>
        <Reveal delay={10}>
          <p
            style={{
              margin: "30px 0 0",
              fontFamily: fonts.body,
              fontSize: vertical ? 44 : 36,
              lineHeight: 1.45,
              color: colors.slate300,
            }}
          >
            {subtitle}
          </p>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          right: vertical ? 0 : 120,
          top: vertical ? 720 : 150,
          width: vertical ? 1080 : 900,
          height: vertical ? 700 : 680,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* En móvil las ilustraciones se amplían para leerse mejor. */}
        <div style={{ transform: vertical ? "scale(1.12)" : undefined }}>
          {children}
        </div>
      </div>
      <ProgressRail active={index} />
    </AbsoluteFill>
  );
}
