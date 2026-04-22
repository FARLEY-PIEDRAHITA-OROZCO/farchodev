import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

function WireShield() {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.25;
      ref.current.rotation.x += delta * 0.1;
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial
          color="#22D3EE"
          wireframe
          emissive="#3B82F6"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color="#3B82F6"
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

function OrbitingRing({ radius = 2.6, speed = 0.4, tilt = 0.5, color = "#22D3EE" }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
    }
  });
  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.015, 8, 96]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

function FloatingDot({ position, speed }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.y = position[1] + Math.sin(t) * 0.35;
      ref.current.position.x = position[0] + Math.cos(t * 0.6) * 0.2;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color="#60A5FA" transparent opacity={0.8} />
    </mesh>
  );
}

function Particles({ count = 40 }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 4,
        ],
        speed: 0.3 + Math.random() * 0.8,
      })),
    [count]
  );
  return (
    <>
      {dots.map((d, i) => (
        <FloatingDot key={i} position={d.position} speed={d.speed} />
      ))}
    </>
  );
}

function StarField({ count = 300 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#94A3B8"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 55 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#22D3EE" />
        <pointLight position={[-5, -3, 2]} intensity={0.8} color="#3B82F6" />
        <Float speed={1.2} rotationIntensity={0.8} floatIntensity={0.6}>
          <WireShield />
        </Float>
        <OrbitingRing radius={2.4} speed={0.35} tilt={0.4} color="#22D3EE" />
        <OrbitingRing radius={2.9} speed={-0.22} tilt={-0.6} color="#3B82F6" />
        <Particles count={35} />
        <StarField count={250} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Suspense>
    </Canvas>
  );
}
