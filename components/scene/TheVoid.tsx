'use client';

import { Canvas } from '@react-three/fiber';
import { PostProcessing } from './PostProcessing';
import { Spire } from './Spire';
import { FloorData, RemarkableEvent } from '@/lib/architect';
import { Cameraman } from './Cameraman';
import { Artifacts } from './Artifacts';
import { Environment, Stars } from '@react-three/drei';

interface TheVoidProps {
  data?: FloorData[];
  events?: RemarkableEvent[];
}

export const TheVoid = ({ data = [], events = [] }: TheVoidProps) => {
  const totalHeight = data.reduce((acc, f) => acc + f.height + 0.05, 0);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [20, 20, 20], fov: 50 }}
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#030303']} />
        
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 20, 10]} intensity={2} color="#00f3ff" />
        <pointLight position={[-10, 10, -10]} intensity={1.5} color="#ff00ff" />
        <pointLight position={[0, -5, 0]} intensity={0.5} color="#eaff00" />
        <directionalLight position={[0, 50, 0]} intensity={0.3} color="#ffffff" />
      
        <fog attach="fog" args={['#030303', 10, 50]} />

        <Stars 
          radius={100} 
          depth={50} 
          count={2000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={0.5}
        />

        <Cameraman />

        <gridHelper args={[100, 100, '#0a0a0a', '#050505']} position={[0, -10, 0]} />

        {data && data.length > 0 ? (
          <>
            <Spire data={data} />
            <Artifacts events={events} totalHeight={totalHeight} />
          </>
        ) : (
          <FallbackObject />
        )}
        
        <PostProcessing />
      </Canvas>
    </div>
  );
};

function FallbackObject() {
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[3, 0.5, 16, 100]} />
        <meshStandardMaterial 
          color="#00f3ff" 
          emissive="#00f3ff" 
          emissiveIntensity={0.5}
          wireframe 
        />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.5, 16, 100]} />
        <meshStandardMaterial 
          color="#ff00ff" 
          emissive="#ff00ff" 
          emissiveIntensity={0.5}
          wireframe 
        />
      </mesh>
    </group>
  );
}
