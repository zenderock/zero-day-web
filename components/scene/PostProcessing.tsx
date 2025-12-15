'use client';

import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const PostProcessing = () => {
  return (
    <EffectComposer>
      <group>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.7}
        />
        <Noise opacity={0.10} blendFunction={BlendFunction.OVERLAY} />
        <ChromaticAberration 
          offset={[0.002, 0.002]} 
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </group>
    </EffectComposer>
  );
};
