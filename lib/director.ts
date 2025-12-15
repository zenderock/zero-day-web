import { create } from 'zustand';

export type Chapter = 
  | 'IDLE' 
  | 'INTRO' 
  | 'TOTAL_FLUX' 
  | 'CHRONO' 
  | 'SPIRE_REVEAL' 
  | 'OUTRO';

interface DirectorState {
  currentChapter: Chapter;
  setChapter: (chapter: Chapter) => void;
  nextChapter: () => void;
  prevChapter: () => void;
}

const CHAPTER_SEQUENCE: Chapter[] = [
  'IDLE',
  'INTRO',
  'TOTAL_FLUX',
  'CHRONO',
  'SPIRE_REVEAL',
  'OUTRO',
];

export const useDirector = create<DirectorState>((set, get) => ({
  currentChapter: 'IDLE',
  setChapter: (chapter) => set({ currentChapter: chapter }),
  nextChapter: () => {
    const current = get().currentChapter;
    const currentIndex = CHAPTER_SEQUENCE.indexOf(current);
    const nextIndex = Math.min(currentIndex + 1, CHAPTER_SEQUENCE.length - 1);
    set({ currentChapter: CHAPTER_SEQUENCE[nextIndex] });
  },
  prevChapter: () => {
    const current = get().currentChapter;
    const currentIndex = CHAPTER_SEQUENCE.indexOf(current);
    const prevIndex = Math.max(currentIndex - 1, 0);
    set({ currentChapter: CHAPTER_SEQUENCE[prevIndex] });
  },
}));
