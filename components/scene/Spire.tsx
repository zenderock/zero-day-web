'use client';

import { useMemo, useRef } from 'react';
import { FloorData } from '@/lib/architect';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { QuadraticBezierLine } from '@react-three/drei';

interface SpireProps {
  data: FloorData[];
}

export const Spire = ({ data }: SpireProps) => {
  const groupRef = useRef<Group>(null);

  // Rotation lente de la tour
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001; 
    }
  });

  const floors = useMemo(() => {
    let currentY = 0;
    return data.map((floor, i) => {
      const y = currentY + floor.height / 2;
      currentY += floor.height + 0.05; 
      
      // Add slight organic imperfection
      const offset = Math.sin(i * 0.5) * 0.2;
      const rotation = Math.cos(i * 0.3) * 0.1;
      
      return { ...floor, y, offset, rotation };
    });
  }, [data]);

  return (
    <group ref={groupRef} position={[0, -10, 0]}>
      {/* Central Core Spine */}
      <mesh position={[0, 25, 0]}>
         <cylinderGeometry args={[0.5, 0.5, 60, 8]} />
         <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>

      {floors.map((floor, i) => (
        <group key={floor.id} position={[floor.offset, floor.y, floor.offset]} rotation={[0, floor.rotation, 0]}>
          {/* Main Floor Block */}
          <mesh>
            <boxGeometry args={[floor.width, floor.height, floor.width]} />
            {floor.type === 'VOID' ? (
                <meshPhysicalMaterial 
                    color="#000" 
                    transmission={0.9} // Glass effect
                    thickness={1}
                    roughness={0.1}
                    metalness={0.1}
                    opacity={0.3}
                    transparent
                />
            ) : (
                <meshStandardMaterial
                    color="#0a0a0a"
                    emissive={floor.color}
                    emissiveIntensity={floor.type === 'WIREFRAME' ? 0.5 : 2}
                    roughness={0.3}
                    metalness={0.8}
                    wireframe={floor.type === 'WIREFRAME'}
                />
            )}
          </mesh>

          {/* Greebles / Surface Details for Solid Floors */}
          {floor.type === 'SOLID' && floor.width > 3 && (
             <group>
                {/* Random Tech Boxes attached to sides */}
                <mesh position={[floor.width/2 + 0.2, 0, 0]}>
                    <boxGeometry args={[0.4, floor.height * 0.8, 0.5]} />
                    <meshStandardMaterial color="#222" metalness={0.8} />
                </mesh>
                <mesh position={[-floor.width/2 - 0.2, 0, 0]}>
                    <boxGeometry args={[0.4, floor.height * 0.4, 0.5]} />
                    <meshStandardMaterial color="#222" metalness={0.8} />
                </mesh>
             </group>
          )}

          {/* Hanging Cables (Bezier Curves) */}
          {floor.type === 'SOLID' && floor.width > 4 && i < floors.length - 1 && (
             <group>
               {/* Cable hanging from this floor to a lower point */}
               <QuadraticBezierLine 
                  start={[floor.width/2, -floor.height/2, floor.width/2]} 
                  end={[floor.width/2 + 2, -floor.height*2, floor.width/2 + 1]} 
                  mid={[floor.width/2 + 1.5, -floor.height, floor.width/2 + 0.5]}
                  color={floor.color}
                  lineWidth={2}
                  transparent
                  opacity={0.6}
               />
               <QuadraticBezierLine 
                  start={[-floor.width/2, -floor.height/2, -floor.width/2]} 
                  end={[-floor.width/2 - 1, -floor.height*3, -floor.width/2 - 1]} 
                  mid={[-floor.width/2 - 1.5, -floor.height, -floor.width/2 - 0.5]}
                  color="#333"
                  lineWidth={1}
               />
             </group>
          )}
        </group>
      ))}
    </group>
  );
};
