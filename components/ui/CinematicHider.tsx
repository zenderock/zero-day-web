'use client';

import { useDirector } from '@/lib/director';
import { motion } from 'framer-motion';

interface CinematicHiderProps {
  children: React.ReactNode;
  showDuring?: string[];
}

export const CinematicHider = ({ children, showDuring = [] }: CinematicHiderProps) => {
  const { currentChapter, isExploring } = useDirector();
  
  const shouldHide = currentChapter !== 'IDLE' && currentChapter !== 'OUTRO' && !showDuring.includes(currentChapter);
  const isHidden = shouldHide && !isExploring;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isHidden ? 0 : 1,
        y: isHidden ? -10 : 0
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ pointerEvents: isHidden ? 'none' : 'auto' }}
    >
      {children}
    </motion.div>
  );
};
