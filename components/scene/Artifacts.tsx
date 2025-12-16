'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Points, BufferGeometry, Float32BufferAttribute } from 'three';
import { RemarkableEvent } from '@/lib/architect';

interface ArtifactsProps {
  events: RemarkableEvent[];
  totalHeight: number;
}

export const Artifacts = ({ events, totalHeight }: ArtifactsProps) => {
  return (
    <group>
      <ParticleField count={500} height={totalHeight} />
      <DataRings totalHeight={totalHeight} />
      <EventMarkers events={events} />
    </group>
  );
};

function ParticleField({ count, height }: { count: number; height: number }) {
  const pointsRef = useRef<Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 20;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * height * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.9) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      }
    }
    
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    
    return geometry;
  }, [count, height]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={particles}>
      <pointsMaterial 
        size={0.15}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function DataRings({ totalHeight }: { totalHeight: number }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((ring, i) => {
        ring.rotation.z = state.clock.elapsedTime * (0.1 + i * 0.05);
        const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.1;
        ring.scale.set(scale, scale, 1);
      });
    }
  });

  const rings = useMemo(() => {
    return [
      { y: totalHeight * 0.25, radius: 12, color: '#00f3ff' },
      { y: totalHeight * 0.5, radius: 15, color: '#ff00ff' },
      { y: totalHeight * 0.75, radius: 10, color: '#00f3ff' },
    ];
  }, [totalHeight]);

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, ring.y - 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring.radius - 0.1, ring.radius, 64]} />
          <meshStandardMaterial 
            color={ring.color}
            emissive={ring.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
            side={2}
          />
        </mesh>
      ))}
    </group>
  );
}

function EventMarkers({ events }: { events: RemarkableEvent[] }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((marker, i) => {
        marker.rotation.y = state.clock.elapsedTime * 2;
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.2;
        marker.scale.setScalar(pulse);
      });
    }
  });

  const peakEvents = events.filter(e => e.type === 'PEAK' || e.type === 'MILESTONE').slice(0, 5);

  return (
    <group ref={groupRef}>
      {peakEvents.map((event, i) => {
        const angle = (i / peakEvents.length) * Math.PI * 2;
        const radius = 18;
        const height = (event.weekIndex / 52) * 40;
        const color = event.type === 'PEAK' ? '#ff00ff' : '#eaff00';
        
        return (
          <group 
            key={i} 
            position={[
              Math.cos(angle) * radius,
              height - 10,
              Math.sin(angle) * radius
            ]}
          >
            <mesh>
              <octahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial 
                color={color}
                emissive={color}
                emissiveIntensity={2}
                transparent
                opacity={0.8}
              />
            </mesh>
            <pointLight color={color} intensity={1} distance={8} />
          </group>
        );
      })}
    </group>
  );
}

