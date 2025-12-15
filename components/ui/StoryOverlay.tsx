'use client';

import { Chapter, useDirector } from '@/lib/director';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UserStats } from '@/lib/architect';

interface StoryOverlayProps {
  stats: UserStats;
}

const texts: Record<Chapter, { title: string; subtitle: string; description?: string }> = {
  IDLE: { title: "SYSTEM_OFFLINE", subtitle: "WAITING_FOR_UPLINK" },
  INTRO: { title: "INITIALIZING...", subtitle: "CONNECTING TO GITHUB MAINFRAME", description: "ACCESSING NEURAL LINK..." },
  TOTAL_FLUX: { title: "FLUX DETECTED", subtitle: "RAW DATA INPUT RECEIVED", description: "Every commit you pushed this year created a ripple in the network." },
  CHRONO: { title: "TEMPORAL SCAN", subtitle: "BUILDING TIMELINE ARCHITECTURE", description: "Visualizing your activity week by week. Each floor is a cycle of code." },
  SPIRE_REVEAL: { title: "THE SPIRE", subtitle: "STRUCTURAL INTEGRITY 100%", description: "This is your digital footprint. A monument to your logic and creativity." },
  OUTRO: { title: "SEQUENCE COMPLETE", subtitle: "OUTPUT GENERATED", description: "Ready for export." },
};

export const StoryOverlay = ({ stats }: StoryOverlayProps) => {
  const { currentChapter, nextChapter, setChapter } = useDirector();
  const [timeLeft, setTimeLeft] = useState(0);

  // Auto-progress logic
  // Chapter keyframes (Duration in ms)
  const CHAPTER_DURATIONS: Partial<Record<Chapter, number>> = {
    INTRO: 8000,
    TOTAL_FLUX: 8000,
    CHRONO: 12000,
    SPIRE_REVEAL: 12000,
  };

  // Auto-progress logic
  useEffect(() => {
    if (currentChapter === 'IDLE' || currentChapter === 'OUTRO') return;
    
    const duration = CHAPTER_DURATIONS[currentChapter] || 6000;
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setTimeLeft((1 - progress) * 100);

      if (elapsed >= duration) {
        nextChapter();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentChapter, nextChapter]);

  const handleStart = () => {
    setChapter('INTRO');
  };

  if (currentChapter === 'IDLE') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <button 
          onClick={handleStart}
          className="pointer-events-auto group flex items-center gap-4 px-8 py-4 bg-black/50 backdrop-blur-md border border-[#00f3ff]/30 text-[#00f3ff] hover:bg-[#00f3ff]/10 hover:border-[#00f3ff] transition-all"
        >
          <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
          <span className="font-mono tracking-widest text-lg">ENTER_THE_VOID</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-12 pointer-events-none select-none">
      {/* Top Header */}
      <div className="flex justify-between items-start max-w-2xl">
        <div className="flex flex-col gap-4">
          <motion.div
            key={currentChapter + "-header"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white mix-blend-difference tracking-tighter leading-none">
              {texts[currentChapter].title}
            </h1>
            <p className="text-xl font-mono text-[#00f3ff] mt-2 tracking-widest">
              // {texts[currentChapter].subtitle}
            </p>
          </motion.div>
          
          <motion.p 
            key={currentChapter + "-desc"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/60 font-mono text-sm max-w-md border-l-2 border-[#00f3ff]/30 pl-4 py-2 bg-black/50 backdrop-blur-sm"
          >
            {texts[currentChapter].description}
          </motion.p>
        </div>
      </div>

      {/* Central Stats (Conditional Layers) */}
      <AnimatePresence mode='wait'>
        {currentChapter === 'TOTAL_FLUX' && (
          <motion.div 
            key="flux"
            initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
            className="absolute inset-0 flex items-center justify-center gap-16"
          >
            <div className="text-center relative">
               <div className="absolute -inset-10 bg-[#00f3ff]/5 blur-3xl rounded-full" />
              <span className="text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-black leading-none relative z-10">
                {stats.totalContributions}
              </span>
              <p className="text-xl font-mono text-white/50 tracking-[1em] relative z-10">TOTAL_COMMITS</p>
            </div>
          </motion.div>
        )}

        {currentChapter === 'CHRONO' && (
             <motion.div 
                key="chrono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-end gap-6 text-right"
              >
                <div className="flex flex-col gap-6">
                   <div className="flex justify-between items-end gap-12">
                      <div className="text-right">
                        <div className="text-6xl font-black text-white">{stats.maxStreak}</div>
                        <div className="text-sm font-mono text-[#00f3ff] tracking-widest">DAY STREAK</div>
                      </div>
                      <div className="text-right">
                        <div className="text-6xl font-black text-white">{stats.bestMonth.name.substring(0, 3).toUpperCase()}</div>
                        <div className="text-sm font-mono text-[#ff00ff] tracking-widest">POWER MONTH</div>
                      </div>
                   </div>

                   <div className="w-full h-px bg-white/20 my-2" />

                   <div className="flex justify-between text-right">
                      <div>
                         <div className="text-2xl font-bold text-white/80">{stats.weekendRatio > 30 ? "MERCENARY" : "CORP_DRONE"}</div>
                         <div className="text-xs font-mono text-white/40 tracking-widest">WORK_PATTERN</div>
                         <div className="text-[10px] font-mono text-white/20">{stats.weekendRatio}% WEEKEND_OPS</div>
                      </div>
                      <div>
                         <div className="text-2xl font-bold text-white/80">{stats.busiestDay.count}</div>
                         <div className="text-xs font-mono text-white/40 tracking-widest">MAX_OUTPUT</div>
                         <div className="text-[10px] font-mono text-white/20">{stats.busiestDay.date}</div>
                      </div>
                   </div>
                </div>
              </motion.div>
        )}

        {/* Final Ranking Reveal during Outro or Spire Reveal */}
        {/* Final Ranking Reveal during Outro or Spire Reveal */}
        {currentChapter === 'SPIRE_REVEAL' && (
            <motion.div 
                key="ranking"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-32 left-12"
            >
                <div className="font-mono text-xs text-white/40 mb-2">CLASS_DETECTED</div>
                <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] tracking-tighter">
                    {stats.ranking}
                </div>
            </motion.div>
        )}

        {currentChapter === 'OUTRO' && (
            <motion.div 
               key="outro-card"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="absolute inset-0 flex items-center justify-center p-8 backdrop-blur-sm bg-black/80"
            >
              <div className="w-full max-w-lg bg-black border border-white/20 p-8 flex flex-col gap-6 relative overflow-hidden">
                 {/* Card Decoration */}
                 <div className="absolute top-0 left-0 w-2 h-2 bg-white" />
                 <div className="absolute top-0 right-0 w-2 h-2 bg-white" />
                 <div className="absolute bottom-0 left-0 w-2 h-2 bg-white" />
                 <div className="absolute bottom-0 right-0 w-2 h-2 bg-white" />
                 
                 {/* Header */}
                 <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-2xl font-black text-white">ZERO_DAY</h2>
                      <div className="text-xs font-mono text-white/40">{new Date().getFullYear()} REPORT</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#00f3ff]">{stats.ranking}</div>
                      <div className="text-xs font-mono text-white/40">CLASS</div>
                    </div>
                 </div>

                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4">
                       <div className="text-2xl font-bold text-white">{stats.totalContributions}</div>
                       <div className="text-[10px] font-mono text-white/40">TOTAL_COMMITS</div>
                    </div>
                    <div className="bg-white/5 p-4">
                       <div className="text-2xl font-bold text-white">{stats.maxStreak}</div>
                       <div className="text-[10px] font-mono text-white/40">MAX_STREAK</div>
                    </div>
                 </div>

                 {/* Heatmap */}
                 {stats.calendar && (
                    <div className="flex flex-col gap-2">
                      <div className="text-[10px] font-mono text-white/40 mb-1">CONTRIBUTION_MAP</div>
                      <div className="flex gap-[2px] flex-wrap justify-center opacity-80">
                         {stats.calendar.map((week, w) => (
                            <div key={w} className="flex flex-col gap-[2px]">
                               {week.contributionDays.map((day, d) => (
                                  <div 
                                    key={d} 
                                    className="w-[3px] h-[3px]"
                                    style={{ 
                                      backgroundColor: day.contributionCount > 0 
                                        ? day.contributionCount > 5 ? '#ff00ff' : '#00f3ff' 
                                        : '#1a1a1a' 
                                    }}
                                  />
                               ))}
                            </div>
                         ))}
                      </div>
                    </div>
                 )}

                 {/* Footer / Export */}
                 <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <div className="font-mono text-[10px] text-white/20">ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
                    <button className="bg-white text-black font-bold text-xs px-4 py-2 hover:bg-[#00f3ff] transition-colors">
                       EXPORT_IMAGE
                    </button>
                 </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="flex justify-between items-end w-full">
        {/* Progress Bar for Current Slide */}
        <div className="flex flex-col gap-2 w-full max-w-md">
            <div className="flex gap-1 mb-2">
                {['INTRO', 'TOTAL_FLUX', 'CHRONO', 'SPIRE_REVEAL', 'OUTRO'].map((c, i) => (
                    <div 
                        key={c} 
                        className={`h-1 flex-1 transition-colors duration-500 ${
                            ['IDLE', 'INTRO', 'TOTAL_FLUX', 'CHRONO', 'SPIRE_REVEAL', 'OUTRO'].indexOf(currentChapter) > i 
                            ? 'bg-[#00f3ff]' 
                            : ['IDLE', 'INTRO', 'TOTAL_FLUX', 'CHRONO', 'SPIRE_REVEAL', 'OUTRO'].indexOf(currentChapter) === i+1 
                                ? 'bg-[#00f3ff]/50' // Active
                                : 'bg-white/10'
                        }`}
                    >
                         {['IDLE', 'INTRO', 'TOTAL_FLUX', 'CHRONO', 'SPIRE_REVEAL', 'OUTRO'].indexOf(currentChapter) === i + 1 && (
                             <motion.div 
                                className="h-full bg-[#00f3ff]" 
                                initial={{ width: "0%" }}
                                animate={{ width: `${100 - timeLeft}%` }}
                                transition={{ type: "tween", ease: "linear", duration: 0.1 }}
                             />
                         )}
                    </div>
                ))}
            </div>
            <div className="font-mono text-xs text-white/30">AUTO_SEQUENCE_ENGAGED // [ESC] TO ABORT</div>
        </div>
        
        <button 
          onClick={nextChapter}
          className="pointer-events-auto flex items-center gap-2 px-6 py-3 border border-white/10 hover:bg-white/5 hover:border-white/30 transition-all font-mono text-sm group"
        >
          <span className="text-white/50 group-hover:text-white transition-colors">SKIP_SEGMENT</span>
          <ChevronRight className="w-4 h-4 text-[#00f3ff]" />
        </button>
      </div>
    </div>
  );
};
