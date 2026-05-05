import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uMotion;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotate = mat2(0.80, -0.60, 0.60, 0.80);

    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p = rotate * p * 2.03;
      amplitude *= 0.5;
    }

    return value;
  }

  float band(vec2 uv, float offset, float width, float softness) {
    float curve = sin((uv.x + offset) * 2.25) * 0.17;
    curve += sin((uv.x * 3.1 - offset) + uv.y) * 0.055;
    return smoothstep(width + softness, width, abs(uv.y - curve));
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
    float t = uTime * uMotion;

    vec3 deep = vec3(0.006, 0.010, 0.030);
    vec3 ink = vec3(0.018, 0.035, 0.075);
    vec3 teal = vec3(0.02, 0.78, 0.95);
    vec3 cobalt = vec3(0.04, 0.28, 1.00);
    vec3 indigo = vec3(0.28, 0.10, 0.95);
    vec3 pearl = vec3(0.72, 0.90, 1.00);

    float flow = fbm(p * 1.35 + vec2(t * 0.035, -t * 0.025));
    float silk = fbm(p * 2.6 + vec2(-t * 0.055, t * 0.04));
    float micro = fbm(p * 7.5 + t * 0.025);

    vec2 warped = p;
    warped.x += (flow - 0.5) * 0.52;
    warped.y += (silk - 0.5) * 0.34;

    float auroraA = band(warped + vec2(0.15, -0.05), t * 0.095, 0.055, 0.30);
    float auroraB = band(warped * 0.92 + vec2(-0.25, 0.20), -t * 0.075, 0.045, 0.24);
    float auroraC = band(warped * 1.18 + vec2(0.35, -0.28), t * 0.045, 0.035, 0.20);

    float halo = 0.42 / (length(p - vec2(-0.76, 0.38)) + 0.40);
    float horizon = smoothstep(-0.72, 0.62, p.y) * smoothstep(1.25, -0.15, p.y);
    float vignette = smoothstep(2.85, 0.34, length(p * vec2(0.42, 1.02)));

    vec3 color = mix(deep, ink, horizon);
    color += teal * auroraA * (0.62 + flow * 0.55);
    color += cobalt * auroraB * 0.42;
    color += indigo * auroraC * 0.24;
    color += pearl * pow(max(auroraA + auroraB, 0.0), 2.7) * 0.36;
    color += vec3(0.02, 0.06, 0.18) * halo;

    float rays = pow(max(0.0, 1.0 - abs(p.x * 0.58 + p.y + 0.14)), 7.0);
    color += vec3(0.22, 0.68, 1.00) * rays * 0.18;

    float scan = sin((uv.y + micro * 0.012) * 900.0) * 0.012;
    float grain = hash(gl_FragCoord.xy + fract(t) * 97.0) - 0.5;

    color = color * vignette;
    color += scan;
    color += grain * 0.045;
    color = pow(max(color, 0.0), vec3(0.88));

    gl_FragColor = vec4(color, 1.0);
  }
`;

function AuroraPlane({ reducedMotion }: { reducedMotion: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMotion: { value: reducedMotion ? 0 : 1 },
    }),
    [reducedMotion, size.height, size.width],
  );

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size.height, size.width, uniforms]);

  useEffect(() => {
    uniforms.uMotion.value = reducedMotion ? 0 : 1;
  }, [reducedMotion, uniforms]);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

export default function PremiumAnimatedBackground() {
  const reducedMotion = useReducedMotionPreference();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.7]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      >
        <AuroraPlane reducedMotion={reducedMotion} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_46%,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_82%_42%,rgba(37,99,235,0.18),transparent_32%),radial-gradient(circle_at_50%_35%,rgba(119,211,255,0.12),transparent_22%),linear-gradient(180deg,rgba(2,5,18,0.76)_0%,rgba(3,10,32,0.18)_42%,rgba(2,5,18,0.88)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(78,194,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(78,194,255,0.07)_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );
}
