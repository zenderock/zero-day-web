'use client';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { PostProcessing } from './PostProcessing';
import { Spire } from './Spire';
import { FloorData } from '@/lib/architect';
import { Cameraman } from './Cameraman';

interface TheVoidProps {
  data?: FloorData[];
}

export const TheVoid = ({ data = [] }: TheVoidProps) => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [20, 20, 20], fov: 50 }}
        gl={{ 
             antialias: false,
             powerPreference: "high-performance",
        }}
        dpr={[1, 2]} // dpr handles pixelRatio in R3F
      >
        {/* Sky / Space */}
        <color attach="background" args={['#030303']} />
        
        {/* Lights */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f3ff" />
        <pointLight position={[-10, 5, -10]} intensity={1} color="#ff00ff" />
      
        {/* Fog for depth */}
        <fog attach="fog" args={['#030303', 5, 30]} />

        <Cameraman />

        {/* Reference Grid */}
        <gridHelper args={[50, 50, '#1a1a1a', '#0a0a0a']} />

        {/* The Spire or Fallback */}
        {data && data.length > 0 ? (
          <Spire data={data} />
        ) : (
          <FallbackObject />
        )}
        
        {/* VFX */}
        <PostProcessing />
      </Canvas>
    </div>
  );
};

function FallbackObject() {
  return (
    <mesh position={[0, 2.5, 0]}>
      <boxGeometry args={[1, 5, 1]} />
      <meshStandardMaterial color="red" wireframe emissive="red" emissiveIntensity={0.5} />
    </mesh>
  );
}
