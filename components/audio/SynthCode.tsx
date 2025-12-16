'use client';

import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { FloorData } from '@/lib/architect';
import { Volume2, VolumeX, Music, ChevronDown } from 'lucide-react';
import { useDirector } from '@/lib/director';

interface SynthCodeProps {
  data: FloorData[];
}

const TRACKS = [
  { 
    id: 'cyberpunk', 
    name: 'CYBERPUNK_IMPLANT', 
    file: '/audio/brain-implant-cyberpunk-sci-fi-trailer-action-intro-330416.mp3' 
  },
  { 
    id: 'losangeles', 
    name: 'LOS_ANGELES', 
    file: '/audio/los-angeles-cinematic-electronic-dance-music-344495.mp3' 
  },
];

export const SynthCode = ({ data }: SynthCodeProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [volume, setVolume] = useState(-10);
  
  const playerRef = useRef<Tone.Player | null>(null);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  
  const { currentChapter } = useDirector();

  const initAudio = async (track: typeof TRACKS[0]) => {
    await Tone.start();
    Tone.context.lookAhead = 0.1;

    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.dispose();
    }
    if (sequenceRef.current) {
      sequenceRef.current.stop();
      sequenceRef.current.dispose();
    }
    if (synthRef.current) {
      synthRef.current.dispose();
    }
    if (reverbRef.current) {
      reverbRef.current.dispose();
    }

    const reverb = new Tone.Reverb({ decay: 8, preDelay: 0.1 }).toDestination();
    await reverb.generate();
    reverbRef.current = reverb;

    const player = new Tone.Player({
      url: track.file,
      loop: true,
      autostart: false,
      volume: volume,
      fadeIn: 2,
      fadeOut: 2,
    }).connect(reverb);

    await Tone.loaded();

    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.5, decay: 0.3, sustain: 0.2, release: 2 }
    }).toDestination();
    synth.volume.value = -25;
    synth.connect(reverb);

    const activeFloors = data.filter(f => f.height > 0.3);
    const scale = ["C2", "E2", "G2", "B2", "C3", "E3", "G3", "B3"];
    const notes = activeFloors.slice(0, 8).map(f => {
      const index = Math.min(Math.floor(f.height * 1.5), scale.length - 1);
      return scale[index];
    });

    const seq = new Tone.Sequence((time, note) => {
      if (Math.random() > 0.7 && currentChapter !== 'IDLE') {
        synth.triggerAttackRelease(note, "2n", time, 0.3);
      }
    }, notes.length > 0 ? notes : ["C2"], "2n");

    playerRef.current = player;
    synthRef.current = synth;
    sequenceRef.current = seq;

    setIsReady(true);
    
    const offset = track.id === 'losangeles' ? 30 : 0;
    player.start(0, offset);
    Tone.Transport.start();
    seq.start(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.stop();
      Tone.Transport.stop();
      sequenceRef.current?.stop();
      setIsPlaying(false);
    } else {
      const offset = currentTrack.id === 'losangeles' ? 30 : 0;
      playerRef.current.start(0, offset);
      Tone.Transport.start();
      sequenceRef.current?.start(0);
      setIsPlaying(true);
    }
  };

  const changeTrack = async (track: typeof TRACKS[0]) => {
    setCurrentTrack(track);
    setShowMenu(false);
    if (isReady) {
      await initAudio(track);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.volume.value = newVolume;
    }
  };

  useEffect(() => {
    return () => {
      playerRef.current?.stop();
      playerRef.current?.dispose();
      sequenceRef.current?.dispose();
      synthRef.current?.dispose();
      reverbRef.current?.dispose();
      Tone.Transport.stop();
    };
  }, []);

  useEffect(() => {
    if (currentChapter === 'OUTRO') {
      const timer = setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.stop();
          Tone.Transport.stop();
          sequenceRef.current?.stop();
          setIsPlaying(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentChapter]);

  useEffect(() => {
    if (currentChapter === 'INTRO' && !isReady && !isPlaying) {
      initAudio(currentTrack);
    }
  }, [currentChapter, isReady, isPlaying, currentTrack]);

  const handleToggle = async () => {
    if (!isReady) {
      await initAudio(currentTrack);
    } else {
      togglePlay();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 px-3 py-1.5 border border-white/20 hover:bg-white/10 hover:border-[#00f3ff] transition-colors group"
          title={isReady ? (isPlaying ? "PAUSE" : "PLAY") : "INITIALIZE AUDIO"}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-[#00f3ff] animate-pulse" />
              <span className="text-[10px] text-[#00f3ff] font-mono hidden md:inline">ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-white/50" />
              <span className="text-[10px] text-white/50 font-mono hidden md:inline">OFF</span>
            </>
          )}
        </button>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-1 px-2 py-1.5 border border-white/20 hover:bg-white/10 hover:border-[#00f3ff] transition-colors"
          title="SELECT TRACK"
        >
          <Music className="w-3 h-3 text-white/50" />
          <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showMenu && (
        <div className="absolute bottom-full right-0 mb-2 w-56 bg-black/95 border border-white/20 backdrop-blur-xl">
          <div className="p-2 border-b border-white/10">
            <div className="text-[10px] font-mono text-white/40 tracking-widest mb-2">TRACK</div>
            {TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => changeTrack(track)}
                className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                  currentTrack.id === track.id 
                    ? 'bg-[#00f3ff]/20 text-[#00f3ff] border-l-2 border-[#00f3ff]' 
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {track.name}
              </button>
            ))}
          </div>
          
          <div className="p-3">
            <div className="text-[10px] font-mono text-white/40 tracking-widest mb-2">VOLUME</div>
            <input
              type="range"
              min="-30"
              max="0"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-none appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:bg-[#00f3ff]
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-3
                [&::-moz-range-thumb]:h-3
                [&::-moz-range-thumb]:bg-[#00f3ff]
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-white/30 mt-1">
              <span>-30dB</span>
              <span>{volume}dB</span>
              <span>0dB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
