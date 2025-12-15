'use client';

import { useDirector } from '@/lib/director';
import { CameraControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Cameraman = () => {
  const controlsRef = useRef<CameraControls>(null);
  const currentChapter = useDirector((state) => state.currentChapter);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    // Reset settings
    controls.smoothTime = 1.5;

    switch (currentChapter) {
      case 'IDLE':
        // Static view from afar
        controls.setLookAt(20, 20, 20, 0, 5, 0, true);
        break;
      
      case 'INTRO':
        // Dive into the fog
        controls.setLookAt(0, 2, 15, 0, 2, 0, true);
        break;

      case 'TOTAL_FLUX':
        // Look up from the base
        controls.setLookAt(5, 1, 5, 0, 5, 0, true);
        break;

      case 'CHRONO':
        // Spiral Up initiated by useFrame or just a high angle
        controls.setLookAt(15, 10, -15, 0, 8, 0, true);
        break;

      case 'SPIRE_REVEAL':
        // Top down view or cinematic wide shot
        controls.setLookAt(-20, 30, 20, 0, 10, 0, true);
        break;

      case 'OUTRO':
        // Back to stable view
        controls.setLookAt(25, 25, 25, 0, 7.5, 0, true);
        break;
    }
  }, [currentChapter]);

  // Optional: Continuous movement for specific chapters
  // Continuous movement for specific chapters
  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (currentChapter === 'CHRONO') {
        // Slow vertical scan + rotation
        // We use polar (vertical) and azimuth (horizontal) rotation
        const time = state.clock.getElapsedTime();
        
        // Gentle rotation
        controls.rotateAzimuthTo(time * 0.1, true);
        
        // We can also modify the target to scan up
        // But controls.setLookAt is easier to manage in the switch for initialization
        // Let's just do a slow orbit
    }

    if (currentChapter === 'SPIRE_REVEAL') {
        // Grand orbit
        const time = state.clock.getElapsedTime();
        controls.rotateAzimuthTo(time * 0.05 + 1, true); // Slower, expansive
    }
  });

  return (
    <CameraControls 
        ref={controlsRef} 
        makeDefault 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 1.5}
    />
  );
};
