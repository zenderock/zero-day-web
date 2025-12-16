'use client';

import { useDirector } from '@/lib/director';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Activity, Flame, Droplet } from 'lucide-react';

export const FloorDetail = () => {
  const { selectedFloor, hoveredFloor, selectFloor } = useDirector();
  const floor = selectedFloor || hoveredFloor;

  if (!floor) return null;

  const isSelected = selectedFloor !== null;
  const weekDate = new Date(floor.date);
  const weekLabel = weekDate.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  });

  const typeLabels = {
    SOLID: { label: 'HAUTE_ACTIVITÉ', color: '#00f3ff' },
    WIREFRAME: { label: 'ACTIVITÉ_MODÉRÉE', color: '#888' },
    VOID: { label: 'ZONE_SILENCIEUSE', color: '#333' }
  };

  const remarkableLabels = {
    PEAK: { label: 'SURGE_DÉTECTÉ', icon: Flame, color: '#ff00ff' },
    DROUGHT: { label: 'VOID_PERIOD', icon: Droplet, color: '#ff3333' },
    STREAK: { label: 'STREAK_ZONE', icon: Activity, color: '#00ff88' }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.95 }}
        className={`
          fixed right-8 top-1/2 -translate-y-1/2 z-50
          w-72 bg-black/90 backdrop-blur-xl border 
          ${isSelected ? 'border-[#00f3ff]' : 'border-white/20'}
          pointer-events-auto
        `}
      >
        <div className="relative">
          <div 
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#00f3ff] to-[#ff00ff]"
            style={{ width: `${Math.min(floor.weekTotal * 5, 100)}%` }}
          />
          
          {isSelected && (
            <button 
              onClick={() => selectFloor(null)}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          )}

          <div className="p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono text-white/40 tracking-widest">
                  SEMAINE #{floor.id + 1}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-[#00f3ff]" />
                  <span className="text-sm font-mono text-white">{weekLabel}</span>
                </div>
              </div>
              <div 
                className="px-2 py-1 text-[10px] font-mono tracking-wider"
                style={{ 
                  backgroundColor: typeLabels[floor.type].color + '20',
                  color: typeLabels[floor.type].color,
                  border: `1px solid ${typeLabels[floor.type].color}40`
                }}
              >
                {typeLabels[floor.type].label}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3">
                <div className="text-2xl font-black text-white">{floor.weekTotal}</div>
                <div className="text-[10px] font-mono text-white/40 tracking-widest">CONTRIBUTIONS</div>
              </div>
              <div className="bg-white/5 p-3">
                <div className="text-2xl font-black text-white">{floor.activeDays}/7</div>
                <div className="text-[10px] font-mono text-white/40 tracking-widest">JOURS_ACTIFS</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-mono text-white/40 tracking-widest">MÉTRIQUES</div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-mono text-white/60">HAUTEUR:</div>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00f3ff] to-[#ff00ff]"
                    style={{ width: `${(floor.height / 10) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-white">{floor.height.toFixed(1)}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-mono text-white/60">LARGEUR:</div>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00f3ff]"
                    style={{ width: `${(floor.width / 8) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-white">{floor.width.toFixed(1)}</div>
              </div>
            </div>

            {floor.isRemarkable && floor.remarkableType && (
              <div 
                className="flex items-center gap-2 p-2 border"
                style={{ 
                  borderColor: remarkableLabels[floor.remarkableType].color + '60',
                  backgroundColor: remarkableLabels[floor.remarkableType].color + '10'
                }}
              >
                {(() => {
                  const Icon = remarkableLabels[floor.remarkableType!].icon;
                  return <Icon className="w-4 h-4" style={{ color: remarkableLabels[floor.remarkableType!].color }} />;
                })()}
                <span 
                  className="text-xs font-mono tracking-wider"
                  style={{ color: remarkableLabels[floor.remarkableType].color }}
                >
                  {remarkableLabels[floor.remarkableType].label}
                </span>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/30">
              {isSelected ? 'CLIC POUR FERMER' : 'CLIC POUR VERROUILLER'}
            </span>
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: floor.color }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

