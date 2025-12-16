'use client';

import { Vector2 } from 'three';
import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette, Glitch } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { useDirector } from '@/lib/director';

export const PostProcessing = () => {
  const { currentChapter } = useDirector();
  
  const isIntense = currentChapter === 'INTRO' || currentChapter === 'SPIRE_REVEAL';
  const isTransition = currentChapter === 'TOTAL_FLUX' || currentChapter === 'OUTRO';

  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.15} 
        mipmapBlur 
        intensity={isIntense ? 2.5 : 1.5} 
        radius={0.8}
      />
      <Noise 
        opacity={isIntense ? 0.15 : 0.08} 
        blendFunction={BlendFunction.OVERLAY} 
      />
      <ChromaticAberration 
        offset={isTransition ? [0.004, 0.004] : [0.002, 0.002]} 
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette 
        eskil={false} 
        offset={0.15} 
        darkness={isIntense ? 1.3 : 1.0} 
      />
      {currentChapter === 'INTRO' ? (
        <Glitch
          delay={new Vector2(1.5, 3.5)}
          duration={new Vector2(0.1, 0.3)}
          strength={new Vector2(0.1, 0.2)}
          mode={GlitchMode.SPORADIC}
          active
          ratio={0.85}
        />
      ) : <></>}
    </EffectComposer>
  );
};
