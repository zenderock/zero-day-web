'use client';

import { useDirector } from '@/lib/director';
import { CameraControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

interface CameramanProps {
  totalHeight?: number;
}

export const Cameraman = ({ totalHeight = 50 }: CameramanProps) => {
  const controlsRef = useRef<CameraControls>(null);
  const { currentChapter, selectedFloor, isExploring } = useDirector();

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    controls.smoothTime = 1.5;

    if (isExploring && selectedFloor) {
      const floorY = selectedFloor.id * 0.5;
      controls.setLookAt(8, floorY + 5, 8, 0, floorY, 0, true);
      return;
    }

    switch (currentChapter) {
      case 'IDLE':
        controls.setLookAt(25, 20, 25, 0, 5, 0, true);
        break;
      
      case 'INTRO':
        controls.setLookAt(0, 2, 20, 0, 2, 0, true);
        break;

      case 'PROFILE':
        controls.setLookAt(15, 5, 15, 0, 3, 0, true);
        break;

      case 'TOTAL_FLUX':
        controls.setLookAt(5, 1, 5, 0, 8, 0, true);
        break;

      case 'BREAKDOWN':
        controls.setLookAt(-10, 8, 10, 0, 5, 0, true);
        break;

      case 'CHRONO':
        controls.setLookAt(15, 15, -15, 0, 10, 0, true);
        break;

      case 'LANGUAGES':
        controls.setLookAt(-15, 12, 15, 0, 8, 0, true);
        break;

      case 'REPOS':
        controls.setLookAt(18, 8, 18, 0, 6, 0, true);
        break;

      case 'TOWER_ASCENT':
        controls.smoothTime = 12;
        controls.setLookAt(30, totalHeight, 30, 0, totalHeight * 0.8, 0, true);
        break;

      case 'SPIRE_REVEAL':
        controls.smoothTime = 2;
        controls.setLookAt(-25, totalHeight + 10, 25, 0, totalHeight, 0, true);
        break;

      case 'OUTRO':
        controls.setLookAt(30, 25, 30, 0, 10, 0, true);
        break;
    }
  }, [currentChapter, selectedFloor, isExploring, totalHeight]);

  useFrame((state) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const time = state.clock.getElapsedTime();

    if (currentChapter === 'CHRONO') {
      controls.rotateAzimuthTo(time * 0.08, true);
    }

    if (currentChapter === 'SPIRE_REVEAL') {
      controls.rotateAzimuthTo(time * 0.04 + 1, true);
    }

    if (currentChapter === 'INTRO') {
      const progress = Math.min(time * 0.1, 1);
      controls.dolly(progress * 0.01, true);
    }
  });

  return (
    <CameraControls 
      ref={controlsRef} 
      makeDefault 
      minPolarAngle={0.2} 
      maxPolarAngle={Math.PI / 1.8}
      minDistance={5}
      maxDistance={60}
    />
  );
};
