'use client';

import { useDirector } from '@/lib/director';
import { motion } from 'framer-motion';

export const CinematicHider = ({ children }: { children: React.ReactNode }) => {
  const { currentChapter } = useDirector();
  const isCinematic = currentChapter !== 'IDLE';

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isCinematic ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: isCinematic ? 'none' : 'auto' }}
    >
      {children}
    </motion.div>
  );
};
