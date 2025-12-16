import { create } from 'zustand';
import { FloorData } from './architect';

export type Chapter = 
  | 'IDLE' 
  | 'INTRO' 
  | 'PROFILE'
  | 'TOTAL_FLUX' 
  | 'BREAKDOWN'
  | 'CHRONO' 
  | 'LANGUAGES'
  | 'REPOS'
  | 'SPIRE_REVEAL' 
  | 'OUTRO';

interface DirectorState {
  currentChapter: Chapter;
  selectedFloor: FloorData | null;
  hoveredFloor: FloorData | null;
  isExploring: boolean;
  isPaused: boolean;
  
  setChapter: (chapter: Chapter) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  
  selectFloor: (floor: FloorData | null) => void;
  hoverFloor: (floor: FloorData | null) => void;
  
  setExploring: (exploring: boolean) => void;
  togglePause: () => void;
  reset: () => void;
}

const CHAPTER_SEQUENCE: Chapter[] = [
  'IDLE',
  'INTRO',
  'PROFILE',
  'TOTAL_FLUX',
  'BREAKDOWN',
  'CHRONO',
  'LANGUAGES',
  'REPOS',
  'SPIRE_REVEAL',
  'OUTRO',
];

export const useDirector = create<DirectorState>((set, get) => ({
  currentChapter: 'IDLE',
  selectedFloor: null,
  hoveredFloor: null,
  isExploring: false,
  isPaused: false,

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

  selectFloor: (floor) => set({ selectedFloor: floor, isExploring: floor !== null }),
  hoverFloor: (floor) => set({ hoveredFloor: floor }),
  
  setExploring: (exploring) => set({ isExploring: exploring, selectedFloor: exploring ? get().selectedFloor : null }),
  togglePause: () => set({ isPaused: !get().isPaused }),
  
  reset: () => set({ 
    currentChapter: 'IDLE', 
    selectedFloor: null, 
    hoveredFloor: null, 
    isExploring: false,
    isPaused: false 
  }),
}));

export const CHAPTER_SEQUENCE_EXPORT = CHAPTER_SEQUENCE;
