'use client';

import { handleSignIn, handleSignOut } from "@/app/actions";
import Image from "next/image";
import { SynthCode } from "@/components/audio/SynthCode";
import { StoryOverlay } from "@/components/ui/StoryOverlay";
import { CinematicHider } from "@/components/ui/CinematicHider";
import { FloorDetail } from "@/components/ui/FloorDetail";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { useLocale } from "@/lib/locale-context";
import { UserStats } from "@/lib/architect";
import { FloorData } from "@/lib/architect";
import { Session } from "next-auth";

interface PageClientProps {
  session: Session | null;
  stats: UserStats;
  floors: FloorData[];
}

export function PageClient({ session, stats, floors }: PageClientProps) {
  const { t } = useLocale();

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-8">
      <CinematicHider>
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white mix-blend-difference">
              ZERO_DAY
            </h1>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#00f3ff] opacity-80 mt-1 font-mono">
              {t('app.version')}
            </p>
          </div>
          
          <div className="text-right pointer-events-auto flex items-center gap-2">
            {session ? (
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-[10px] md:text-xs tracking-wider uppercase text-right font-mono hidden md:block">
                  <p className="text-[#00f3ff]">{t('header.netlink_established')}</p>
                  <p className="text-white/60">{session.user?.name}</p>
                </div>
                {session.user?.image && (
                  <Image 
                    src={session.user.image} 
                    alt="Avatar" 
                    width={40} 
                    height={40} 
                    className="rounded-none border border-[#00f3ff] w-8 h-8 md:w-10 md:h-10"
                  />
                )}
                <form action={handleSignOut}>
                  <button className="px-3 md:px-4 py-1 border border-red-500/50 hover:bg-red-500/10 text-red-500 text-[9px] md:text-[10px] uppercase tracking-widest transition-all font-mono">
                    {t('header.disconnect')}
                  </button>
                </form>
              </div>
            ) : (
              <form action={handleSignIn}>
                <button className="px-5 md:px-6 py-2 border border-white/20 hover:border-[#00f3ff] hover:bg-[#00f3ff]/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all duration-300 text-[10px] md:text-xs tracking-wider uppercase text-[#00f3ff] font-mono">
                  {t('header.connect')}
                </button>
              </form>
            )}
            <LanguageSelector />
          </div>
        </header>
      </CinematicHider>

      {!session && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6 md:gap-8 px-4 pointer-events-auto">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 text-center">
              ZERO_DAY
            </h1>
            <p className="text-[#00f3ff] font-mono text-xs md:text-sm tracking-[0.3em] md:tracking-[0.5em] text-center">
              {t('app.tagline')}
            </p>
          </div>
          
          <form action={handleSignIn}>
            <button className="px-6 md:px-8 py-3 bg-white/5 border border-white/10 hover:bg-[#00f3ff]/10 hover:border-[#00f3ff] hover:text-[#00f3ff] transition-all font-mono text-sm backdrop-blur-sm group">
              <span className="group-hover:hidden">{t('app.initialize')}</span>
              <span className="hidden group-hover:inline">{t('app.connect')}</span>
            </button>
          </form>

          <div className="flex flex-col items-center gap-2 mt-4">
            <p className="text-white/30 font-mono text-[10px] text-center max-w-sm">
              {t('app.subtitle')}
            </p>
            <div className="flex gap-4 text-[10px] font-mono text-white">
              <span>{t('app.features.visualization')}</span>
              <span>•</span>
              <span>{t('app.features.audio')}</span>
              <span>•</span>
              <span>{t('app.features.data')}</span>
            </div>
          </div>
        </div>
      )}

      <footer className="flex justify-between items-end text-[10px] md:text-xs text-white/40 font-mono pointer-events-auto">
        <CinematicHider>
          <div className="flex flex-col gap-1">
            <span className="hidden md:block">{t('footer.coords')}</span>
            <span>
              STATUS: {session ? t('footer.status_analyzing', { count: stats.totalContributions }) : t('footer.status_idle')}
            </span>
          </div>
        </CinematicHider>
        
        <div className="flex items-center gap-3 md:gap-4">
          {session && <SynthCode data={floors} />}
          <CinematicHider>
            <span className="hidden md:inline">{t('footer.system_ready')}</span>
          </CinematicHider>
        </div>
      </footer>

      {session && <StoryOverlay stats={stats} />}
      {session && <FloorDetail />}
      
      <div className="absolute inset-0 z-50 pointer-events-none scanlines opacity-15 mix-blend-overlay" />
      <div className="noise z-40" />
    </div>
  );
}

