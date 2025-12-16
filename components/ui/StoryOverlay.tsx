'use client'

import * as Tone from 'tone';
import { Chapter, useDirector, CHAPTER_SEQUENCE_EXPORT } from '@/lib/director';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, User, GitCommit, Code, Star, Flame, Calendar, TrendingUp, Award, Zap, Share2, Download, ExternalLink, ArrowUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { UserStats } from '@/lib/architect';
import Image from 'next/image';
import { toPng } from 'html-to-image';

import { useLocale } from '@/lib/locale-context';

interface StoryOverlayProps {
  stats: UserStats;
}

const CHAPTER_DURATIONS: Partial<Record<Chapter, number>> = {
  INTRO: 5000,
  PROFILE: 6000,
  TOTAL_FLUX: 6000,
  BREAKDOWN: 7000,
  CHRONO: 8000,
  LANGUAGES: 6000,
  REPOS: 7000,
  TOWER_ASCENT: 12000,
  SPIRE_REVEAL: 8000,
};

export const StoryOverlay = ({ stats }: StoryOverlayProps) => {
  const { currentChapter, nextChapter, setChapter, isPaused, togglePause } = useDirector();
  const { t } = useLocale();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentChapter === 'IDLE' || currentChapter === 'OUTRO' || isPaused) return;

    const duration = CHAPTER_DURATIONS[currentChapter] || 6000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p * 100);

      if (elapsed >= duration) {
        nextChapter();
        setProgress(0);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentChapter, nextChapter, isPaused]);

  const handleStart = async () => {
    await Tone.start();
    setChapter('INTRO');
  };

  if (currentChapter === 'IDLE') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.button
          onClick={handleStart}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto group flex items-center gap-4 px-10 py-5 bg-black/60 backdrop-blur-xl border border-[#00f3ff]/30 text-[#00f3ff] hover:bg-[#00f3ff]/10 hover:border-[#00f3ff] transition-all"
        >
          <Play className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <span className="font-mono tracking-widest text-xl block">{t('idle.enter')}</span>
            <span className="text-xs text-white/40 font-mono">{t('idle.duration')}</span>
          </div>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none">
      <AnimatePresence mode="wait">
        {currentChapter === 'INTRO' && <IntroCard key="intro" />}
        {currentChapter === 'PROFILE' && <ProfileCard key="profile" stats={stats} />}
        {currentChapter === 'TOTAL_FLUX' && <TotalFluxCard key="flux" stats={stats} />}
        {currentChapter === 'BREAKDOWN' && <BreakdownCard key="breakdown" stats={stats} />}
        {currentChapter === 'CHRONO' && <ChronoCard key="chrono" stats={stats} />}
        {currentChapter === 'LANGUAGES' && <LanguagesCard key="languages" stats={stats} />}
        {currentChapter === 'REPOS' && <ReposCard key="repos" stats={stats} />}
        {currentChapter === 'TOWER_ASCENT' && <TowerAscentCard key="ascent" />}
        {currentChapter === 'SPIRE_REVEAL' && <SpireRevealCard key="spire" stats={stats} />}
        {currentChapter === 'OUTRO' && <OutroCard key="outro" stats={stats} />}
      </AnimatePresence>

      <ProgressBar
        currentChapter={currentChapter}
        progress={progress}
        isPaused={isPaused}
        togglePause={togglePause}
        nextChapter={nextChapter}
      />
    </div>
  );
};

function IntroCard() {
  const { t } = useLocale();
  return (
    <CardWrapper position="center">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20"
        >
          {new Date().getFullYear()}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#00f3ff] font-mono tracking-[0.5em] text-sm"
        >
          {t('intro.analyzing')}
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.8, duration: 2 }}
          className="h-px bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent mx-auto max-w-xs"
        />
      </motion.div>
    </CardWrapper>
  );
}

function ProfileCard({ stats }: { stats: UserStats }) {
  const { t } = useLocale();
  const { profile } = stats;
  const joinYear = new Date(profile.createdAt).getFullYear();
  const yearsOnGithub = new Date().getFullYear() - joinYear;

  return (
    <CardWrapper position="left">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <User className="w-6 h-6 text-[#00f3ff]" />
          <span className="text-xs font-mono text-white/40 tracking-widest">{t('profile.detected')}</span>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black text-white"
          >
            {profile.name || profile.login}
          </motion.h2>
          <p className="text-[#00f3ff] font-mono text-sm mt-1">@{profile.login}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatBox value={yearsOnGithub} label={t('profile.years_active')} />
          <StatBox value={profile.followers} label={t('profile.followers')} />
          <StatBox value={profile.totalRepos} label={t('profile.repos')} />
        </div>

        {profile.bio && (
          <p className="text-white/60 text-sm font-mono border-l-2 border-[#00f3ff]/30 pl-4">
            "{profile.bio}"
          </p>
        )}
      </div>
    </CardWrapper>
  );
}

function TotalFluxCard({ stats }: { stats: UserStats }) {
  const { t, locale } = useLocale();
  return (
    <CardWrapper position="center">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 10 }}
        >
          <div className="text-[3rem] md:text-[5rem] font-black text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/10 leading-none tracking-tighter">
            {stats.totalContributions.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[#00f3ff] font-mono tracking-[0.8em] text-lg"
        >
          {t('flux.contributions')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/40 font-mono text-sm max-w-md mx-auto"
        >
          {t('flux.message', { count: stats.totalContributions })}
        </motion.p>
      </div>
    </CardWrapper>
  );
}

function BreakdownCard({ stats }: { stats: UserStats }) {
  const { t } = useLocale();
  const { breakdown } = stats;
  const items = [
    { icon: GitCommit, value: breakdown.commits, label: t('breakdown.commits'), color: "#00f3ff" },
    { icon: Code, value: breakdown.pullRequests, label: t('breakdown.pull_requests'), color: "#ff00ff" },
    { icon: Zap, value: breakdown.reviews, label: t('breakdown.reviews'), color: "#eaff00" },
    { icon: Star, value: breakdown.issues, label: t('breakdown.issues'), color: "#00ff88" },
  ];

  return (
    <CardWrapper position="right">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <TrendingUp className="w-6 h-6 text-[#ff00ff]" />
          <span className="text-xs font-mono text-white/40 tracking-widest">{t('breakdown.title')}</span>
        </div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-white">{item.value}</span>
                  <span className="text-[10px] font-mono text-white/40 tracking-wider">{item.label}</span>
                </div>
                <div className="h-1 bg-white/10 mt-1 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.value / breakdown.commits) * 100, 100)}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
}

function ChronoCard({ stats }: { stats: UserStats }) {
  const { t, locale } = useLocale();
  const days = locale === 'fr'
    ? ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']
    : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const maxDay = Math.max(...stats.weekdayDistribution);

  return (
    <CardWrapper position="left">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-6 h-6 text-[#eaff00]" />
          <span className="text-xs font-mono text-white/40 tracking-widest">{t('chrono.title')}</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-4xl font-black text-white">{stats.maxStreak}</div>
            <div className="text-[10px] font-mono text-[#00f3ff] tracking-widest">{t('chrono.streak_max')}</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white">{stats.weekendRatio}%</div>
            <div className="text-[10px] font-mono text-[#ff00ff] tracking-widest">{t('chrono.weekend_ops')}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-mono text-white/40 tracking-widest">{t('chrono.distribution')}</div>
          <div className="flex gap-2">
            {stats.weekdayDistribution.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-white/10 rounded-sm overflow-hidden" style={{ height: 60 }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(count / maxDay) * 100}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-[#00f3ff] to-[#ff00ff] mt-auto"
                    style={{ marginTop: 'auto' }}
                  />
                </div>
                <span className="text-[8px] font-mono text-white/40">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <span className="text-white/40 font-mono">{t('chrono.best_month')}: </span>
            <span className="text-[#00f3ff] font-bold uppercase">{stats.bestMonth.name}</span>
          </div>
          <div>
            <span className="text-white/40 font-mono">{t('chrono.record_day')}: </span>
            <span className="text-[#ff00ff] font-bold">{stats.busiestDay.count}</span>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

function LanguagesCard({ stats }: { stats: UserStats }) {
  const { t } = useLocale();
  if (stats.languages.length === 0) {
    return (
      <CardWrapper position="center">
        <div className="text-center text-white/40 font-mono">{t('languages.none')}</div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper position="right">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Code className="w-6 h-6 text-[#00f3ff]" />
          <span className="text-xs font-mono text-white/40 tracking-widest">{t('languages.title')}</span>
        </div>

        <div className="space-y-3">
          {stats.languages.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-white font-mono flex-1">{lang.name}</span>
              <span className="text-white/40 font-mono text-sm">{lang.percentage}%</span>
            </motion.div>
          ))}
        </div>

        <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
          {stats.languages.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ width: 0 }}
              animate={{ width: `${lang.percentage}%` }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              style={{ backgroundColor: lang.color }}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </CardWrapper>
  );
}

function ReposCard({ stats }: { stats: UserStats }) {
  const { t } = useLocale();
  const topRepos = stats.topRepos.slice(0, 3);

  return (
    <CardWrapper position="left">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Star className="w-6 h-6 text-[#eaff00]" />
          <span className="text-xs font-mono text-white/40 tracking-widest">{t('repos.title')}</span>
        </div>

        <div className="space-y-4">
          {topRepos.map((repo, i) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/5 p-4 border border-white/10 hover:border-[#00f3ff]/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-bold">{repo.name}</h3>
                  {repo.language && (
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: repo.languageColor || '#888' }}
                      />
                      <span className="text-xs text-white/40 font-mono">{repo.language}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[#eaff00]">
                  <Star className="w-4 h-4" />
                  <span className="font-mono text-sm">{repo.stars}</span>
                </div>
              </div>
              {repo.description && (
                <p className="text-white/40 text-xs mt-2 line-clamp-2">{repo.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
}


function TowerAscentCard() {
  const { t } = useLocale();
  return (
    <CardWrapper position="right">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <ArrowUp className="w-6 h-6 text-[#00f3ff]" />
          <span className="text-xs font-mono text-white/40 tracking-widest">{t('spire.intro.title')}</span>
        </div>

        <div className="relative h-64 pl-4 border-l border-white/10 space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="relative"
          >
            <div className="absolute -left-[21px] top-2 w-2 h-2 rounded-full bg-[#00f3ff]" />
            <p className="text-xl font-bold text-white">{t('spire.intro.floor')}</p>
            <p className="text-xs font-mono text-white/40">{t('spire.intro.floor_desc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 4 }}
            className="relative"
          >
            <div className="absolute -left-[21px] top-2 w-2 h-2 rounded-full bg-[#ff00ff]" />
            <p className="text-xl font-bold text-white">{t('spire.intro.height')}</p>
            <p className="text-xs font-mono text-white/40">{t('spire.intro.height_desc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 7 }}
            className="relative"
          >
            <div className="absolute -left-[21px] top-2 w-2 h-2 rounded-full bg-[#eaff00]" />
            <p className="text-xl font-bold text-white">{t('spire.intro.gaps')}</p>
            <p className="text-xs font-mono text-white/40">{t('spire.intro.gaps_desc')}</p>
          </motion.div>
        </div>
      </div>
    </CardWrapper>
  );
}

function SpireRevealCard({ stats }: { stats: UserStats }) {
  const { t } = useLocale();
  return (
    <CardWrapper position="bottom-left">
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-[10px] font-mono text-white/40 tracking-widest mb-2">{t('spire.classification')}</div>
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] via-[#ff00ff] to-[#eaff00]">
            {stats.ranking}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 font-mono text-sm max-w-sm border-l-2 border-[#ff00ff]/50 pl-4"
        >
          {t(`rankings.${stats.ranking}`)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 text-xs font-mono"
        >
          <div>
            <span className="text-white/40">{t('spire.consistency')}: </span>
            <span className="text-[#00f3ff]">{stats.consistency}%</span>
          </div>
          <div>
            <span className="text-white/40">{t('spire.avg_day')}: </span>
            <span className="text-[#ff00ff]">{stats.averagePerDay}</span>
          </div>
        </motion.div>
      </div>
    </CardWrapper>
  );
}

function OutroCard({ stats }: { stats: UserStats }) {
  const { t, locale } = useLocale();
  const { setChapter } = useDirector();
  const avatarUrl = stats.profile.avatarUrl;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // Retina quality
        backgroundColor: 'rgba(0,0,0,0)', // Ensure transparency
        fontEmbedCSS: '', // SC-2965: Disable font embedding to fix "trim" error on undefined
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `ZERO_DAY_ARCHITECT_${stats.profile.login.toUpperCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
  };

  const handleShare = () => {
    const text = locale === 'fr'
      ? `J'ai construit mon Architecture de Code 2025 sur #ZeroDay. \n\nRang: ${stats.ranking}\nTotal Contributions: ${stats.totalContributions}\n\nDécouvre la tienne sur: https://00-day.vercel.app`
      : `I built my 2025 Code Architecture on #ZeroDay. \n\nRank: ${stats.ranking}\nTotal Contributions: ${stats.totalContributions}\n\nCheck yours at: https://00-day.vercel.app`;
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-lg pointer-events-auto"
    >
      {/* Background Matrix/Glitch Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,243,255,0.2)_50%,transparent_100%)] bg-size-[200%_100%] animate-pulse" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="w-full max-w-2xl p-8 relative z-10">
        <div ref={cardRef} className="bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10 p-8 space-y-8 relative overflow-hidden group">

          {/* Subtle Glitch Border on Hover */}
          <div className="absolute inset-0 border border-[#00f3ff]/0 group-hover:border-[#00f3ff]/50 transition-colors pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-6 justify-between items-start border-b border-white/10 pb-6 relative">
            <div className="flex items-center gap-5 min-w-0 flex-1">
              {avatarUrl && (
                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-sm overflow-hidden border border-[#00f3ff]/30 shrink-0 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                  <Image
                    src={avatarUrl}
                    alt={stats.profile.login}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-500 mix-blend-overlay opacity-20" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight truncate">{stats.profile.name || stats.profile.login}</h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                  <div className="text-xs font-mono text-[#00f3ff] bg-[#00f3ff]/10 px-1.5 py-0.5 rounded-xs mt-1">
                    @{stats.profile.login}
                  </div>
                  <div className="text-[10px] font-mono text-white/30 hidden sm:block mt-1">
                    {t('outro.report_complete')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-baseline md:items-end gap-2 md:gap-0 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0 shrink-0">
              <div className="text-[10px] font-mono text-white/40 tracking-[0.2em] md:order-last md:mt-1 uppercase">{t('outro.classification_label')}</div>
              <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] via-[#ff00ff] to-[#ff00ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.3)] whitespace-nowrap">
                {stats.ranking}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 text-center border border-white/5">
              <div className="text-xl md:text-2xl font-bold text-white">{stats.totalContributions}</div>
              <div className="text-[8px] font-mono text-white/40 tracking-wider">{t('flux.contributions')}</div>
            </div>
            <div className="bg-white/5 p-4 text-center border border-white/5">
              <div className="text-xl md:text-2xl font-bold text-white">{stats.maxStreak}</div>
              <div className="text-[8px] font-mono text-white/40 tracking-wider">{t('chrono.streak_max')}</div>
            </div>
            <div className="bg-white/5 p-4 text-center border border-white/5">
              <div className="text-xl md:text-2xl font-bold text-white">{stats.consistency}%</div>
              <div className="text-[8px] font-mono text-white/40 tracking-wider">{t('spire.consistency')}</div>
            </div>
            <div className="bg-white/5 p-4 text-center border border-white/5">
              <div className="text-xl md:text-2xl font-bold text-white">{stats.totalActiveDays}</div>
              <div className="text-[8px] font-mono text-white/40 tracking-wider">{t('outro.active_days')}</div>
            </div>
          </div>

          {stats.calendar && (
            <div>
              <div className="text-[10px] font-mono text-white/40 mb-3 tracking-widest flex justify-between">
                <span>{t('outro.activity_matrix')}</span>
                <span className="text-[#00f3ff]">{t('outro.system_online')}</span>
              </div>
              <div className="flex gap-[2px] flex-wrap justify-center opacity-80 hover:opacity-100 transition-opacity">
                {stats.calendar.map((week, w) => (
                  <div key={w} className="flex flex-col gap-[2px]">
                    {week.contributionDays.map((day, d) => (
                      <div
                        key={d}
                        className="w-[6px] h-[6px] rounded-[1px]"
                        style={{
                          backgroundColor: day.contributionCount > 0
                            ? day.contributionCount > 10 ? '#ff00ff'
                              : day.contributionCount > 5 ? '#00f3ff'
                                : '#00f3ff40'
                            : '#1a1a1a'
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-white/10 gap-4">
            <button
              onClick={() => setChapter('IDLE')}
              className="text-white/40 hover:text-white font-mono text-xs transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-3 h-3" />
              {t('outro.replay_simulation')}
            </button>

            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={handleSaveImage} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/20 text-white font-mono text-xs px-4 py-3 hover:bg-white/10 transition-colors cursor-pointer">
                <Download className="w-4 h-4" />
                {t('outro.save_img')}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00f3ff] hover:bg-[#00f3ff]/90 text-black font-bold font-mono text-xs px-6 py-3 transition-colors shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]"
              >
                <Share2 className="w-4 h-4" />
                {t('outro.share_protocol')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CardWrapper({ children, position }: { children: React.ReactNode; position: 'left' | 'right' | 'center' | 'bottom-left' }) {
  const positionClasses = {
    left: 'left-8 top-1/2 -translate-y-1/2',
    right: 'right-8 top-1/2 -translate-y-1/2',
    center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
    'bottom-left': 'left-8 bottom-24'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className={`absolute ${positionClasses[position]} w-full max-w-md bg-black/80 backdrop-blur-xl border border-white/10 p-6`}
    >
      {children}
    </motion.div>
  );
}

function StatBox({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="bg-white/5 p-3 text-center">
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-[8px] font-mono text-white/40 tracking-wider">{label}</div>
    </div>
  );
}

function ProgressBar({
  currentChapter,
  progress,
  isPaused,
  togglePause,
  nextChapter
}: {
  currentChapter: Chapter;
  progress: number;
  isPaused: boolean;
  togglePause: () => void;
  nextChapter: () => void;
}) {
  const { t } = useLocale();
  const chapters = CHAPTER_SEQUENCE_EXPORT.filter(c => c !== 'IDLE');
  const currentIndex = (chapters as Chapter[]).indexOf(currentChapter);

  if (currentChapter === 'OUTRO') return null;

  return (
    <div className="absolute bottom-8 left-8 right-8 pointer-events-auto">
      <div className="flex gap-1 mb-3">
        {chapters.map((chapter, i) => (
          <div
            key={chapter}
            className="h-1 flex-1 bg-white/10 overflow-hidden"
          >
            {i < currentIndex && (
              <div className="h-full w-full bg-[#00f3ff]" />
            )}
            {i === currentIndex && (
              <motion.div
                className="h-full bg-[#00f3ff]"
                style={{ width: `${progress}%` }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePause}
            className="p-2 hover:bg-white/10 transition-colors"
          >
            {isPaused ? (
              <Play className="w-4 h-4 text-[#00f3ff]" />
            ) : (
              <Pause className="w-4 h-4 text-white/50" />
            )}
          </button>
          <span className="text-[10px] font-mono text-white/30">
            {isPaused ? t('controls.paused') : t('controls.playing')}
          </span>
        </div>

        <button
          onClick={nextChapter}
          className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 transition-colors group"
        >
          <span className="text-xs font-mono text-white/50 group-hover:text-white transition-colors">{t('controls.next')}</span>
          <SkipForward className="w-4 h-4 text-[#00f3ff]" />
        </button>
      </div>
    </div>
  );
}
