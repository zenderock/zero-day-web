import { auth, signIn, signOut } from "@/lib/auth";
import Image from "next/image";
import { TheVoid } from '@/components/scene/TheVoid';
import { getGithubClient } from "@/lib/github";
import { CONTRIBUTION_QUERY } from "@/lib/queries";
import { transformData } from "@/lib/architect";
import { SynthCode } from "@/components/audio/SynthCode";
import { StoryOverlay } from "@/components/ui/StoryOverlay";
import { CinematicHider } from "@/components/ui/CinematicHider";

async function getData(userName: string) {
  const client = await getGithubClient();
  if (!client) return null;

  try {
    const data = await client.request('POST /graphql', {
      query: CONTRIBUTION_QUERY,
      variables: {
        userName,
      },
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
  const userName = session?.user?.username || session?.user?.name || "zenderock";
  
  // Only fetch if session exists
  const blueprint = session ? await getData(userName) : null;
  
  const floors = blueprint?.floors || [];
  const stats = blueprint?.stats || { 
    totalContributions: 0, 
    maxStreak: 0, 
    busiestDay: { date: '', count: 0 }, 
    bestMonth: { name: 'VOID', count: 0 },
    weekendRatio: 0,
    ranking: 'GHOST' 
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-[#00f3ff] selection:text-black">
      {/* 3D Layer (Background) */}
      <div className="fixed inset-0 z-0">
        <TheVoid data={floors} />
      </div>

      {/* UI Layer (HUD) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">
        
        {/* Top Bar */}
        <CinematicHider>
          <header className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter mix-blend-difference">
                ZERO_DAY
              </h1>
              <p className="text-xs uppercase tracking-widest text-[#00f3ff] opacity-80 mt-1">
                Github_Architecture // v1.0
              </p>
            </div>
            
            <div className="text-right pointer-events-auto">
              {session ? (
                <div className="flex items-center gap-4">
                  <div className="text-xs tracking-wider uppercase text-right">
                    <p className="text-[#00f3ff]">NETLINK ESTABLISHED</p>
                    <p className="text-white/60">{session.user?.name}</p>
                  </div>
                  {session.user?.image && (
                     <Image 
                       src={session.user.image} 
                       alt="Avatar" 
                       width={40} 
                       height={40} 
                       className="rounded-none border border-[#00f3ff]"
                     />
                  )}
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button className="px-4 py-1 border border-red-500/50 hover:bg-red-500/10 text-red-500 text-[10px] uppercase tracking-widest transition-all">
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
                  <button className="px-6 py-2 border border-[#333] hover:border-[#00f3ff] hover:bg-[#00f3ff]/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all duration-300 text-xs tracking-wider uppercase text-[#00f3ff]">
                    Connect_Netlink
                  </button>
                </form>
              )}
            </div>
          </header>
        </CinematicHider>

        {/* Center / Crosshair */}
        {!session && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
              ZERO_DAY
            </h1>
            <p className="text-[#00f3ff] font-mono text-sm tracking-[0.5em]">GITHUB_ARCHITECT_PROTOCOL</p>
          </div>
          
          <form
            action={async () => {
              "use server"
              await signIn("github")
            }}
          >
            <button className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-[#00f3ff]/10 hover:border-[#00f3ff] hover:text-[#00f3ff] transition-all font-mono text-sm backdrop-blur-sm group">
              <span className="group-hover:hidden">INITIALIZE_LINK</span>
              <span className="hidden group-hover:inline">CONNECT_GITHUB </span>
            </button>
          </form>
        </div>
        )}

        {/* Bottom Bar */}
        <footer className="flex justify-between items-end text-xs text-white/40 font-mono pointer-events-auto">
          <CinematicHider>
            <div className="flex flex-col gap-1">
              <span>COORDS: [NULL, NULL, NULL]</span>
              <span>STATUS: {session ? `ANALYZING_DATA // ${stats.totalContributions} FLUX_UNITS` : "IDLE // AWAITING_LINK"}</span>
            </div>
          </CinematicHider>
          
          <div className="flex items-center gap-4">
             {session && <SynthCode data={floors} />}
             <CinematicHider>
                <span>SYSTEM READY</span>
             </CinematicHider>
          </div>
        </footer>

        {/* Story Overlay - Only when logged in */}
        {session && <StoryOverlay stats={stats} />}

      </div>
      
      {/* Scanline Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] opacity-20 mix-blend-overlay" />
    </main>
  );
}
