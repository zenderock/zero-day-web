'use client';

import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { FloorData } from '@/lib/architect';
import { Volume2, VolumeX } from 'lucide-react';

interface SynthCodeProps {
  data: FloorData[];
}

export const SynthCode = ({ data }: SynthCodeProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const droneRef = useRef<Tone.Player | null>(null);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);

  // Initialize Audio Engine
  const initAudio = async () => {
    await Tone.start();
    Tone.context.lookAhead = 0.1;

    // 1. Dark Ambient Drone
    // Fallback if no sample: use an Oscillator
    const drone = new Tone.Oscillator(50, "sawtooth").toDestination();
    drone.volume.value = -20;
    const filter = new Tone.Filter(200, "lowpass").toDestination();
    drone.connect(filter);
    
    // Auto-filter for movement
    const autoFilter = new Tone.AutoFilter("0.1hz").connect(filter);
    autoFilter.start();
    
    // 2. Data Sornification Synth
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "fmsquare" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 1 }
    }).toDestination();
    synth.volume.value = -10;
    
    // Reverb for space
    const reverb = new Tone.Reverb({ decay: 10, preDelay: 0.2 }).toDestination();
    synth.connect(reverb);

    // 3. Generative Sequence based on Data
    // Map floors to notes. High activity = High pitch or faster rhythm?
    // Let's keep it ambient: Randomly pick floors to play.
    const activeFloors = data.filter(f => f.height > 0.2); // Only significant weeks
    const notes = activeFloors.map(f => {
      // Simple mapping: more height = higher note in a minor scale
      const scale = ["C3", "D3", "Eb3", "F3", "G3", "Ab3", "Bb3", "C4"];
      const index = Math.min(Math.floor(f.height * 2), scale.length - 1);
      return scale[index];
    });

    // Create a repeating sequence
    const seq = new Tone.Sequence((time, note) => {
      if (Math.random() > 0.5) { // 50% chance to play
        synth.triggerAttackRelease(note, "8n", time);
      }
    }, notes.slice(0, 16), "8n"); // Only take first 16 relevant weeks for the loop

    droneRef.current = drone as any; 
    synthRef.current = synth;
    sequenceRef.current = seq;

    setIsReady(true);
    togglePlay(drone as any, seq);
  };

  const togglePlay = (drone: Tone.Oscillator, seq: Tone.Sequence) => {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.stop();
      drone.stop();
      seq.stop();
      setIsPlaying(false);
    } else {
      Tone.Transport.start();
      drone.start();
      seq.start(0);
      setIsPlaying(true);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      droneRef.current?.stop();
      sequenceRef.current?.dispose();
      synthRef.current?.dispose();
      Tone.Transport.stop();
    };
  }, []);

  const handleToggle = async () => {
    if (!isReady) {
      await initAudio();
    } else if (droneRef.current && sequenceRef.current) {
      togglePlay(droneRef.current as any, sequenceRef.current);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 px-3 py-1 border border-white/20 hover:bg-white/10 hover:border-[#00f3ff] transition-colors group"
      title={isReady ? (isPlaying ? "MUTE SYSTEM AUDIO" : "RESUME SYSTEM AUDIO") : "INITIALIZE AUDIO SYSTEMS"}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-[#00f3ff] animate-pulse" />
          <span className="text-[10px] text-[#00f3ff] hidden group-hover:inline">AUDIO: ON</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-white/50" />
          <span className="text-[10px] text-white/50 hidden group-hover:inline">AUDIO: OFF</span>
        </>
      )}
    </button>
  );
};
