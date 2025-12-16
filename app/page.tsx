import { auth, signIn, signOut } from "@/lib/auth";
import Image from "next/image";
import { TheVoid } from '@/components/scene/TheVoid';
import { getGithubClient } from "@/lib/github";
import { CONTRIBUTION_QUERY, VIEWER_QUERY } from "@/lib/queries";
import { transformData, SpireBlueprint } from "@/lib/architect";
import { SynthCode } from "@/components/audio/SynthCode";
import { StoryOverlay } from "@/components/ui/StoryOverlay";
import { CinematicHider } from "@/components/ui/CinematicHider";
import { FloorDetail } from "@/components/ui/FloorDetail";

async function getData(userName?: string): Promise<SpireBlueprint | null> {
  const client = await getGithubClient();
  if (!client) return null;

  try {
    const isViewer = !userName || userName === 'zenderock';
    const query = isViewer ? VIEWER_QUERY : CONTRIBUTION_QUERY;
    const variables = isViewer ? {} : { userName };

    const data = await client.request('POST /graphql', {
      query,
      variables,
    });
    
    return transformData(data.data);
  } catch (e) {
    console.error("Failed to fetch data", e);
    return null;
  }
}

export default async function Home() {
  const session = await auth();
  // @ts-expect-error username added in auth.ts
  const userName = session?.user?.username;
  
  const blueprint = session ? await getData(userName) : null;
  
  const floors = blueprint?.floors || [];
  const stats = blueprint?.stats || { 
    totalContributions: 0, 
    maxStreak: 0,
    currentStreak: 0,
    busiestDay: { date: '', count: 0 }, 
    bestMonth: { name: 'VOID', count: 0 },
    worstMonth: { name: 'VOID', count: 0 },
    weekendRatio: 0,
    weekdayDistribution: [0,0,0,0,0,0,0],
    ranking: 'GHOST',
    rankingDescription: 'Connectez-vous pour voir vos données.',
    topRepos: [],
    languages: [],
    remarkableEvents: [],
    profile: {
      login: 'unknown',
      name: null,
      avatarUrl: '',
      bio: null,
      createdAt: '',
      followers: 0,
      following: 0,
      totalRepos: 0
    },
    breakdown: {
      commits: 0,
      pullRequests: 0,
      reviews: 0,
      issues: 0,
      repositories: 0,
      restricted: 0
    },
    averagePerDay: 0,
    averagePerWeek: 0,
    totalActiveDays: 0,
    longestDrought: 0,
    consistency: 0
  };

  const events = stats.remarkableEvents || [];

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-[#00f3ff] selection:text-black">
      <div className="fixed inset-0 z-0">
        <TheVoid data={floors} events={events} />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-8">
        
        <CinematicHider>
          <header className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white mix-blend-difference">
                ZERO_DAY
              </h1>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#00f3ff] opacity-80 mt-1 font-mono">
                Github_Architecture // v2.0
              </p>
            </div>
            
            <div className="text-right pointer-events-auto">
              {session ? (
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-[10px] md:text-xs tracking-wider uppercase text-right font-mono hidden md:block">
                    <p className="text-[#00f3ff]">CONNEXION_ÉTABLIE</p>
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
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button className="px-3 md:px-4 py-1 border border-red-500/50 hover:bg-red-500/10 text-red-500 text-[9px] md:text-[10px] uppercase tracking-widest transition-all font-mono">
                      Disconnect
                    </button>
                  </form>
                </div>
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await signIn("github");
                  }}
                >
                  <button className="px-5 md:px-6 py-2 border border-white/20 hover:border-[#00f3ff] hover:bg-[#00f3ff]/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all duration-300 text-[10px] md:text-xs tracking-wider uppercase text-[#00f3ff] font-mono">
                    Connect_GitHub
                  </button>
                </form>
              )}
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
                GITHUB_ARCHITECT_PROTOCOL
              </p>
            </div>
            
            <form
              action={async () => {
                "use server"
                await signIn("github")
              }}
            >
              <button className="px-6 md:px-8 py-3 bg-white/5 border border-white/10 hover:bg-[#00f3ff]/10 hover:border-[#00f3ff] hover:text-[#00f3ff] transition-all font-mono text-sm backdrop-blur-sm group">
                <span className="group-hover:hidden">INITIALIZE_LINK</span>
                <span className="hidden group-hover:inline">CONNECT_GITHUB</span>
              </button>
            </form>

            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-white/30 font-mono text-[10px] text-center max-w-sm">
                Visualisez votre année GitHub en 3D. Une expérience immersive inspirée de Spotify Wrapped.
              </p>
              <div className="flex gap-4 text-[10px] font-mono text-white/20">
                <span>3D_VISUALIZATION</span>
                <span>•</span>
                <span>AUDIO_REACTIVE</span>
                <span>•</span>
                <span>DATA_DRIVEN</span>
              </div>
            </div>
          </div>
        )}

        <footer className="flex justify-between items-end text-[10px] md:text-xs text-white/40 font-mono pointer-events-auto">
          <CinematicHider>
            <div className="flex flex-col gap-1">
              <span className="hidden md:block">COORDS: [ENCRYPTED // SECURE_SECTOR]</span>
              <span>
                STATUS: {session ? `ANALYZING // ${stats.totalContributions} FLUX` : "IDLE // AWAITING_LINK"}
              </span>
            </div>
          </CinematicHider>
          
          <div className="flex items-center gap-3 md:gap-4">
            {session && <SynthCode data={floors} />}
            <CinematicHider>
              <span className="hidden md:inline">SYSTEM READY</span>
            </CinematicHider>
          </div>
        </footer>

        {session && <StoryOverlay stats={stats} />}
        {session && <FloorDetail />}
      </div>
      
      <div className="absolute inset-0 z-50 pointer-events-none scanlines opacity-15 mix-blend-overlay" />
      
      <div className="noise z-40" />
    </main>
  );
}
