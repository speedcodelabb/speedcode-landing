import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 50;
const CYAN = new THREE.Color('#00f2ff');
const BLUE = new THREE.Color('#0066ff');

export default function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: COUNT }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5 - 2,
      ],
      rotationSpeed: Math.random() * 0.02 + 0.005,
      scale: Math.random() * 0.15 + 0.05,
      color: Math.random() > 0.5 ? CYAN : BLUE,
      initialRot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    }));
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      meshRef.current!.setColorAt(i, p.color);
    });
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [particles]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      dummy.position.set(p.position[0], p.position[1], p.position[2]);
      dummy.rotation.set(
        p.initialRot[0] + delta * 20 * p.rotationSpeed * i,
        p.initialRot[1] + delta * 20 * p.rotationSpeed * i,
        p.initialRot[2] + delta * 20 * p.rotationSpeed * i,
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <fog attach="fog" args={['#0a0b1e', 2, 8]} />
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial />
      </instancedMesh>
    </>
  );
}
