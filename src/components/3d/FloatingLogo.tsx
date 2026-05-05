import { Float, useGLTF } from '@react-three/drei';
import { Group } from 'three';

const MODEL_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CompareDispersion/glTF-Binary/CompareDispersion.glb';

export default function FloatingLogo() {
  const gltf = useGLTF(MODEL_URL);

  return (
    <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.18}>
      <group position={[0.2, -0.2, 0]} rotation={[0.15, -0.45, 0]} scale={1.05}>
        {/* Geometric GLB from Khronos Sample Assets (public repository). */}
        <primitive object={gltf.scene as Group} />
      </group>
    </Float>
  );
}

useGLTF.preload(MODEL_URL);
