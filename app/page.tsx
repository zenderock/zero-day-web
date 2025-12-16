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
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { PageClient } from "./page-client";

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
    rankingDescription: '',
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

      <PageClient 
        session={session}
        stats={stats}
        floors={floors}
      />
    </main>
  );
}
