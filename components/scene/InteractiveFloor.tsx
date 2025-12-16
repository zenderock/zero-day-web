'use client';

import { useRef, useState } from 'react';
import { FloorData } from '@/lib/architect';
import { useDirector } from '@/lib/director';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { QuadraticBezierLine } from '@react-three/drei';

interface InteractiveFloorProps {
  floor: FloorData;
  position: [number, number, number];
  rotation: number;
}

export const InteractiveFloor = ({ floor, position, rotation }: InteractiveFloorProps) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { selectFloor, hoverFloor, selectedFloor, hoveredFloor, currentChapter } = useDirector();

  const isSelected = selectedFloor?.id === floor.id;
  const isOtherSelected = selectedFloor !== null && !isSelected;
  const isInteractive = currentChapter === 'OUTRO' || currentChapter === 'SPIRE_REVEAL';

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const targetScale = isHovered || isSelected ? 1.1 : 1;
    const targetEmissive = isHovered || isSelected ? 2 : floor.type === 'WIREFRAME' ? 0.5 : 1;
    
    meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * 0.1;
    meshRef.current.scale.z += (targetScale - meshRef.current.scale.z) * 0.1;
    
    const mat = meshRef.current.material as any;
    if (mat && mat.emissiveIntensity !== undefined) {
      mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.1;
    }

    if (floor.isRemarkable && groupRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3 + floor.id) * 0.1;
      groupRef.current.position.y = position[1] + pulse;
    }
  });

  const handlePointerOver = () => {
    if (!isInteractive) return;
    setIsHovered(true);
    hoverFloor(floor);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    hoverFloor(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = () => {
    if (!isInteractive) return;
    if (isSelected) {
      selectFloor(null);
    } else {
      selectFloor(floor);
    }
  };

  const baseColor = isSelected ? '#ffffff' : isHovered ? '#00f3ff' : '#0a0a0a';
  const emissiveColor = isSelected ? '#00f3ff' : floor.color;

  return (
    <group 
      ref={groupRef}
      position={position} 
      rotation={[0, rotation, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh ref={meshRef}>
        <boxGeometry args={[floor.width, floor.height, floor.width]} />
        {floor.type === 'VOID' ? (
          <meshPhysicalMaterial 
            color="#000" 
            transmission={0.9}
            thickness={1}
            roughness={0.1}
            metalness={0.1}
            opacity={isOtherSelected ? 0.1 : 0.3}
            transparent
          />
        ) : (
          <meshStandardMaterial
            color={baseColor}
            emissive={emissiveColor}
            emissiveIntensity={floor.type === 'WIREFRAME' ? 0.5 : isHovered ? 2 : 1}
            roughness={0.3}
            metalness={0.8}
            wireframe={floor.type === 'WIREFRAME'}
            opacity={isOtherSelected ? 0.3 : 1}
            transparent={isOtherSelected}
          />
        )}
      </mesh>

      {floor.type === 'SOLID' && floor.width > 3 && (
        <group>
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

      {floor.type === 'SOLID' && floor.width > 4 && (
        <group>
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

      {floor.isRemarkable && (
        <Beacon type={floor.remarkableType || 'PEAK'} height={floor.height} />
      )}

      {isSelected && (
        <SelectionRing width={floor.width} height={floor.height} />
      )}
    </group>
  );
};

function Beacon({ type, height }: { type: 'PEAK' | 'DROUGHT' | 'STREAK'; height: number }) {
  const beaconRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  const color = type === 'PEAK' ? '#ff00ff' : type === 'DROUGHT' ? '#ff3333' : '#00ff88';
  
  return (
    <group position={[0, height / 2 + 1, 0]}>
      <mesh ref={beaconRef}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <pointLight color={color} intensity={0.5} distance={5} />
    </group>
  );
}

function SelectionRing({ width, height }: { width: number; height: number }) {
  const ringRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      ringRef.current.scale.set(scale, 1, scale);
    }
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -height/2 - 0.1, 0]}>
      <ringGeometry args={[width * 0.6, width * 0.7, 32]} />
      <meshStandardMaterial 
        color="#00f3ff" 
        emissive="#00f3ff" 
        emissiveIntensity={2}
        transparent
        opacity={0.8}
        side={2}
      />
    </mesh>
  );
}

