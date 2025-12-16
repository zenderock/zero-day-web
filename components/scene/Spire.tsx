'use client';

import { useMemo, useRef } from 'react';
import { FloorData } from '@/lib/architect';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { InteractiveFloor } from './InteractiveFloor';

interface SpireProps {
  data: FloorData[];
}

export const Spire = ({ data }: SpireProps) => {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001; 
    }
  });

  const floors = useMemo(() => {
    let currentY = 0;
    return data.map((floor, i) => {
      const y = currentY + floor.height / 2;
      currentY += floor.height + 0.05; 
      
      const offset = Math.sin(i * 0.5) * 0.2;
      const rotation = Math.cos(i * 0.3) * 0.1;
      
      return { ...floor, y, offset, rotation };
    });
  }, [data]);

  const totalHeight = useMemo(() => {
    return floors.reduce((acc, f) => acc + f.height + 0.05, 0);
  }, [floors]);

  return (
    <group ref={groupRef} position={[0, -10, 0]}>
      <mesh position={[0, totalHeight / 2, 0]}>
        <cylinderGeometry args={[0.3, 0.5, totalHeight + 10, 8]} />
        <meshStandardMaterial 
          color="#080808" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#111"
          emissiveIntensity={0.1}
        />
      </mesh>

      {floors.map((floor) => (
        <InteractiveFloor
          key={floor.id}
          floor={floor}
          position={[floor.offset, floor.y, floor.offset]}
          rotation={floor.rotation}
        />
      ))}

      <DataStreams floors={floors} />
    </group>
  );
};

function DataStreams({ floors }: { floors: Array<FloorData & { y: number }> }) {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const speed = 0.5 + (i % 3) * 0.2;
        const offset = (state.clock.elapsedTime * speed + i * 0.5) % 1;
        const startY = floors[0]?.y || 0;
        const endY = floors[floors.length - 1]?.y || 20;
        child.position.y = startY + (endY - startY) * offset;
        
        const mat = (child as any).material;
        if (mat) {
          mat.opacity = Math.sin(offset * Math.PI) * 0.5;
        }
      });
    }
  });

  const streams = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      radius: 1.5 + Math.random() * 0.5,
      color: i % 2 === 0 ? '#00f3ff' : '#ff00ff'
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {streams.map((stream, i) => (
        <mesh 
          key={i}
          position={[
            Math.cos(stream.angle) * stream.radius,
            0,
            Math.sin(stream.angle) * stream.radius
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial 
            color={stream.color}
            emissive={stream.color}
            emissiveIntensity={2}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
