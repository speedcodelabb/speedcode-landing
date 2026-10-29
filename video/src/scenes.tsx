import {
  Check,
  FileText,
  Gauge,
  Lock,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import logo from "../../src/assets/speedcode-logo-mark.webp";
import { colors, fonts, gradientText } from "./theme";
import {
  Background,
  BrowserFrame,
  Card,
  Reveal,
  StepLayout,
  useEnter,
  useVertical,
} from "./ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function Logo({ size }: { size: number }) {
  return (
    <Img
      src={logo}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        objectFit: "cover",
      }}
    />
  );
}

export function IntroScene() {
  const pop = useEnter(0, { damping: 14, stiffness: 120 });
  const vertical = useVertical();
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div style={{ transform: `scale(${0.6 + pop * 0.4})`, opacity: pop }}>
          <Logo size={170} />
        </div>
        <Reveal delay={10}>
          <p
            style={{
              margin: "46px 0 0",
              padding: "12px 30px",
              borderRadius: 999,
              border: `1.5px solid rgba(125,211,252,0.3)`,
              background: "rgba(6,17,38,0.8)",
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: colors.sky100,
            }}
          >
            Cómo creamos tu web
          </p>
        </Reveal>
        <Reveal delay={18}>
          <h1
            style={{
              margin: "34px 0 0",
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: vertical ? 116 : 128,
              lineHeight: 1,
              letterSpacing: -4,
              padding: vertical ? "0 70px" : 0,
              textTransform: "uppercase",
              ...gradientText,
            }}
          >
            De la idea al lanzamiento
          </h1>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

const REQUIREMENTS = [
  "Objetivo del sitio",
  "Público y mensajes clave",
  "Funciones necesarias",
  "Plazos y prioridades",
];

export function RequisitosScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <StepLayout
      index={0}
      title="Requisitos"
      subtitle="Escuchamos y entendemos tu negocio antes de escribir código."
    >
      <Card style={{ width: 760, padding: "44px 52px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 34,
          }}
        >
          <FileText size={40} color={colors.sky300} />
          <p
            style={{
              margin: 0,
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: 40,
              color: colors.white,
            }}
          >
            Brief del proyecto
          </p>
        </div>
        {REQUIREMENTS.map((item, index) => {
          const start = 22 + index * 22;
          const appear = enterAt(frame, fps, start);
          const checked = interpolate(
            frame,
            [start + 12, start + 20],
            [0, 1],
            clamp,
          );
          return (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "20px 0",
                borderTop: index ? `1.5px solid ${colors.border}` : "none",
                opacity: appear,
                transform: `translateX(${(1 - appear) * 40}px)`,
              }}
            >
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  display: "grid",
                  placeItems: "center",
                  border: `2px solid ${colors.sky300}`,
                  background: `rgba(125,211,252,${0.18 * checked})`,
                }}
              >
                <Check
                  size={30}
                  color={colors.sky200}
                  style={{ opacity: checked }}
                />
              </span>
              <span
                style={{
                  fontFamily: fonts.body,
                  fontWeight: 600,
                  fontSize: 36,
                  color: colors.slate300,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </Card>
    </StepLayout>
  );
}

/** Entrada suave sin hooks, para usar dentro de bucles. */
function enterAt(frame: number, fps: number, delay: number) {
  return spring({ frame: frame - delay, fps, config: { damping: 200 } });
}

const PROPOSAL = [
  ["Alcance", "Landing + panel de contenido"],
  ["Tiempos", "Primer avance en 1-2 semanas"],
  ["Inversión", "Presupuesto cerrado por escrito"],
];

export function PropuestaScene() {
  const stamp = useEnter(70, { damping: 12, stiffness: 160 });
  return (
    <StepLayout
      index={1}
      title="Propuesta"
      subtitle="Alcance, tiempos e inversión claros, sin sorpresas."
    >
      <div style={{ position: "relative" }}>
        <Card style={{ width: 760, padding: "48px 54px" }}>
          {PROPOSAL.map(([label, value], index) => (
            <Reveal key={label} delay={14 + index * 14} distance={20}>
              <div
                style={{
                  padding: "22px 0",
                  borderTop: index ? `1.5px solid ${colors.border}` : "none",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: fonts.body,
                    fontWeight: 800,
                    fontSize: 22,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: colors.sky300,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    margin: "10px 0 0",
                    fontFamily: fonts.body,
                    fontWeight: 600,
                    fontSize: 38,
                    color: colors.white,
                  }}
                >
                  {value}
                </p>
              </div>
            </Reveal>
          ))}
        </Card>
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -40,
            padding: "16px 30px",
            borderRadius: 18,
            border: `3px solid ${colors.emerald}`,
            color: colors.emerald,
            background: "rgba(2,6,20,0.9)",
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 38,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: stamp,
            transform: `rotate(-8deg) scale(${1.6 - stamp * 0.6})`,
          }}
        >
          Aprobado
        </div>
      </div>
    </StepLayout>
  );
}

function Block({
  x,
  y,
  w,
  h,
  wire,
  color,
  radius = 12,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  wire: number;
  color: string;
  radius?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        border: `2px dashed rgba(148,163,184,${0.6 * (1 - wire)})`,
        background: color,
        opacity: 0.25 + wire * 0.75,
      }}
    />
  );
}

export function DisenoScene() {
  const frame = useCurrentFrame();
  const build = (start: number) =>
    interpolate(frame, [start, start + 14], [0, 1], clamp);
  const styled = interpolate(frame, [95, 125], [0, 1], clamp);
  const grey = "rgba(148,163,184,0.18)";
  const fill = (target: string) => (styled > 0 ? target : grey);
  return (
    <StepLayout
      index={2}
      title="Diseño"
      subtitle="Estructura, estilo y textos pensados para que te contacten."
    >
      <BrowserFrame url="tuempresa.com">
        <div style={{ position: "absolute", inset: 0, opacity: build(10) }}>
          <Block
            x={40}
            y={30}
            w={780}
            h={46}
            wire={styled}
            color={fill("rgba(4,16,36,0.95)")}
            radius={23}
          />
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: build(30) }}>
          <Block
            x={40}
            y={100}
            w={780}
            h={190}
            wire={styled}
            color={fill(
              `linear-gradient(120deg, ${colors.blue600}, ${colors.sky300})`,
            )}
            radius={22}
          />
          <p
            style={{
              position: "absolute",
              left: 80,
              top: 150,
              margin: 0,
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: 46,
              color: colors.white,
              opacity: styled,
            }}
          >
            Tu negocio, en línea
          </p>
          <div
            style={{
              position: "absolute",
              left: 80,
              top: 220,
              padding: "10px 26px",
              borderRadius: 999,
              background: colors.white,
              color: colors.background,
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 20,
              opacity: styled,
            }}
          >
            Contactanos
          </div>
        </div>
        {[0, 1, 2].map((column) => (
          <div
            key={column}
            style={{
              position: "absolute",
              inset: 0,
              opacity: build(50 + column * 10),
            }}
          >
            <Block
              x={40 + column * 266}
              y={314}
              w={248}
              h={160}
              wire={styled}
              color={fill("rgba(125,211,252,0.12)")}
              radius={18}
            />
          </div>
        ))}
      </BrowserFrame>
    </StepLayout>
  );
}

const CODE_LINES = [
  { text: '<Hero titulo="Tu negocio, en línea" />', color: colors.sky300 },
  { text: "<Servicios items={servicios} />", color: colors.sky200 },
  { text: "<Portafolio proyectos={casos} />", color: colors.sky200 },
  { text: "<Contacto whatsapp turnstile />", color: colors.sky200 },
  {
    text: 'deploy("vista-previa") // revisión semanal',
    color: colors.slate400,
  },
];
const WEEKS = [
  "Semana 1 · estructura",
  "Semana 2 · contenido",
  "Semana 3 · ajustes",
];

export function DesarrolloScene() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const typed = Math.max(0, (frame - 12) * 2.1);
  let remaining = typed;
  return (
    <StepLayout
      index={3}
      title="Desarrollo"
      subtitle="Por etapas, con avances visibles cada semana."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <Card style={{ width: 840, padding: "34px 40px", minHeight: 330 }}>
          {CODE_LINES.map((line, index) => {
            const shown = line.text.slice(
              0,
              Math.max(0, Math.floor(remaining)),
            );
            remaining -= line.text.length;
            const isCurrent =
              shown.length > 0 && shown.length < line.text.length;
            return (
              <p
                key={line.text}
                style={{
                  margin: "0 0 14px",
                  fontFamily: fonts.mono,
                  fontSize: 28,
                  whiteSpace: "pre",
                  color: line.color,
                }}
              >
                <span style={{ color: colors.slate500, marginRight: 26 }}>
                  {index + 1}
                </span>
                {shown}
                {isCurrent && Math.floor(frame / 8) % 2 === 0 ? "▍" : ""}
              </p>
            );
          })}
        </Card>
        <div style={{ display: "flex", gap: 18 }}>
          {WEEKS.map((week, index) => {
            const segment = durationInFrames / (WEEKS.length + 1);
            const progress = interpolate(
              frame,
              [segment * (index + 0.5), segment * (index + 1.4)],
              [0, 1],
              clamp,
            );
            return (
              <div key={week} style={{ flex: 1 }}>
                <div
                  style={{
                    height: 10,
                    borderRadius: 5,
                    background: "rgba(125,211,252,0.12)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress * 100}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${colors.blue600}, ${colors.sky300})`,
                    }}
                  />
                </div>
                <p
                  style={{
                    margin: "12px 0 0",
                    fontFamily: fonts.body,
                    fontWeight: 600,
                    fontSize: 22,
                    color: progress >= 1 ? colors.sky200 : colors.slate400,
                  }}
                >
                  {week}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </StepLayout>
  );
}

const CHECKS: Array<[LucideIcon, string]> = [
  [Smartphone, "Celulares y tablets"],
  [Gauge, "Velocidad de carga"],
  [ShieldCheck, "Seguridad"],
  [MessageCircle, "Formularios y contacto"],
];

export function PruebasScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <StepLayout
      index={4}
      title="Pruebas"
      subtitle="Calidad comprobada antes de publicar."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
          width: 820,
        }}
      >
        {CHECKS.map(([Icon, label], index) => {
          const start = 16 + index * 16;
          const appear = enterAt(frame, fps, start);
          const ok = interpolate(
            frame,
            [start + 18, start + 26],
            [0, 1],
            clamp,
          );
          return (
            <Card
              key={label}
              style={{
                padding: "38px 34px",
                opacity: appear,
                transform: `scale(${0.9 + appear * 0.1})`,
                borderColor: `rgba(52,211,153,${0.15 + ok * 0.5})`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Icon size={56} color={colors.sky300} />
                <span
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    display: "grid",
                    placeItems: "center",
                    background: `rgba(52,211,153,${0.2 * ok})`,
                    opacity: ok,
                    transform: `scale(${0.5 + ok * 0.5})`,
                  }}
                >
                  <Check size={32} color={colors.emerald} />
                </span>
              </div>
              <p
                style={{
                  margin: "28px 0 0",
                  fontFamily: fonts.body,
                  fontWeight: 600,
                  fontSize: 32,
                  color: colors.white,
                }}
              >
                {label}
              </p>
            </Card>
          );
        })}
      </div>
    </StepLayout>
  );
}

const CHART = [12, 18, 16, 28, 34, 31, 46, 52, 61, 72];

export function LanzamientoScene() {
  const frame = useCurrentFrame();
  const live = useEnter(16, { damping: 14, stiffness: 140 });
  const draw = interpolate(frame, [30, 110], [0, 1], clamp);
  const width = 700;
  const height = 230;
  const points = CHART.map(
    (value, index) =>
      `${(index / (CHART.length - 1)) * width},${height - (value / 80) * height}`,
  ).join(" ");
  return (
    <StepLayout
      index={5}
      title="Lanzamiento"
      subtitle="En línea, medimos resultados y seguimos mejorando."
    >
      <BrowserFrame url="https://tuempresa.com" height={540}>
        <div style={{ padding: "34px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Lock size={32} color={colors.emerald} />
            <span
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                background: "rgba(52,211,153,0.14)",
                color: colors.emerald,
                fontFamily: fonts.body,
                fontWeight: 800,
                fontSize: 26,
                opacity: live,
                transform: `scale(${0.7 + live * 0.3})`,
              }}
            >
              ● En línea
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: fonts.body,
                fontSize: 24,
                color: colors.slate400,
              }}
            >
              Visitas
            </span>
          </div>
          <svg
            width={width + 40}
            height={height + 40}
            style={{ marginTop: 40, overflow: "visible" }}
          >
            <defs>
              <linearGradient id="linea" x1="0" x2="1">
                <stop offset="0" stopColor={colors.blue600} />
                <stop offset="1" stopColor={colors.sky300} />
              </linearGradient>
            </defs>
            <polyline
              points={points}
              fill="none"
              stroke="url(#linea)"
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
            />
          </svg>
        </div>
      </BrowserFrame>
    </StepLayout>
  );
}

export function CierreScene() {
  const pop = useEnter(0, { damping: 14, stiffness: 120 });
  const vertical = useVertical();
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div style={{ opacity: pop, transform: `scale(${0.7 + pop * 0.3})` }}>
          <Logo size={130} />
        </div>
        <Reveal delay={8}>
          <h2
            style={{
              margin: "40px 0 0",
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: vertical ? 86 : 104,
              lineHeight: 1.05,
              letterSpacing: -3,
              textTransform: "uppercase",
              ...gradientText,
            }}
          >
            ¿Tenés un proyecto
            <br />
            en mente?
          </h2>
        </Reveal>
        <Reveal delay={18}>
          <div
            style={{
              marginTop: 48,
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              padding: "22px 46px",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${colors.blue600}, ${colors.sky300})`,
              color: colors.white,
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 36,
              textTransform: "uppercase",
            }}
          >
            Escribinos <MessageCircle size={38} />
          </div>
        </Reveal>
        <Reveal delay={26}>
          <p
            style={{
              margin: "34px 0 0",
              fontFamily: fonts.body,
              fontSize: 30,
              color: colors.slate300,
            }}
          >
            speedcodelab.com · WhatsApp 0994 381 638
          </p>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
