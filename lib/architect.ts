import { Color } from "three";

export type ContributionDay = {
  contributionCount: number;
  date: string;
  color: string;
  weekday?: number;
};

export type ContributionWeek = {
  contributionDays: ContributionDay[];
  firstDay: string;
};

export type RepoData = {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string | null;
  updatedAt: string;
  description: string | null;
};

export type LanguageStat = {
  name: string;
  color: string;
  count: number;
  percentage: number;
};

export type RemarkableEvent = {
  type: 'PEAK' | 'DROUGHT' | 'STREAK_START' | 'STREAK_END' | 'MILESTONE';
  date: string;
  weekIndex: number;
  value: number;
  label: string;
  description: string;
};

export type FloorData = {
  id: number;
  height: number;
  color: string;
  width: number;
  type: 'SOLID' | 'WIREFRAME' | 'VOID';
  date: string;
  weekTotal: number;
  activeDays: number;
  isRemarkable: boolean;
  remarkableType?: 'PEAK' | 'DROUGHT' | 'STREAK';
};

export interface UserProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  createdAt: string;
  followers: number;
  following: number;
  totalRepos: number;
}

export interface ContributionBreakdown {
  commits: number;
  pullRequests: number;
  reviews: number;
  issues: number;
  repositories: number;
  restricted: number;
}

export interface UserStats {
  totalContributions: number;
  maxStreak: number;
  currentStreak: number;
  busiestDay: { date: string; count: number };
  bestMonth: { name: string; count: number };
  worstMonth: { name: string; count: number };
  weekendRatio: number;
  weekdayDistribution: number[];
  ranking: string;
  rankingDescription: string;
  calendar?: ContributionWeek[];
  topRepos: RepoData[];
  languages: LanguageStat[];
  remarkableEvents: RemarkableEvent[];
  profile: UserProfile;
  breakdown: ContributionBreakdown;
  averagePerDay: number;
  averagePerWeek: number;
  totalActiveDays: number;
  longestDrought: number;
  consistency: number;
}

export interface SpireBlueprint {
  floors: FloorData[];
  stats: UserStats;
}

function calculateRanking(total: number, streak: number, consistency: number): { rank: string; description: string } {
  if (total > 5000 && consistency > 70) return { rank: "NEXUS_ARCHITECT", description: "Tu as transcendé le code. Tu ES le système." };
  if (total > 5000) return { rank: "CONSTRUCT", description: "Une entité numérique. Tu ne codes plus, tu manifestes." };
  if (total > 2500 && streak > 30) return { rank: "PRIME_ARCHITECT", description: "Maître bâtisseur. Chaque commit est une brique de ton empire." };
  if (total > 2500) return { rank: "ARCHITECT", description: "Tu construis des cathédrales de logique." };
  if (total > 1000 && consistency > 60) return { rank: "CYBERMANCER", description: "Le code coule dans tes veines. Magie digitale." };
  if (total > 1000) return { rank: "NETRUNNER", description: "Tu navigues la matrice avec aisance." };
  if (total > 500) return { rank: "SCRIPTER", description: "Tu maîtrises les incantations de base." };
  if (total > 100) return { rank: "NEOPHYTE", description: "L'éveil commence. Continue." };
  return { rank: "GHOST", description: "Une présence à peine perceptible dans le réseau." };
}

function findRemarkableEvents(weeks: ContributionWeek[], floors: FloorData[]): RemarkableEvent[] {
  const events: RemarkableEvent[] = [];
  const weekTotals = floors.map(f => f.weekTotal);
  const avgWeek = weekTotals.reduce((a, b) => a + b, 0) / weekTotals.length;
  const sortedTotals = [...weekTotals].sort((a, b) => b - a);
  const threshold = sortedTotals[Math.floor(sortedTotals.length * 0.1)] || avgWeek * 2;

  floors.forEach((floor, i) => {
    if (floor.weekTotal >= threshold && floor.weekTotal > 0) {
      events.push({
        type: 'PEAK',
        date: floor.date,
        weekIndex: i,
        value: floor.weekTotal,
        label: `SURGE_${String(events.filter(e => e.type === 'PEAK').length + 1).padStart(2, '0')}`,
        description: `Semaine explosive: ${floor.weekTotal} contributions`
      });
    }
    if (floor.weekTotal === 0 && i > 0 && floors[i-1].weekTotal > 5) {
      events.push({
        type: 'DROUGHT',
        date: floor.date,
        weekIndex: i,
        value: 0,
        label: `VOID_${String(events.filter(e => e.type === 'DROUGHT').length + 1).padStart(2, '0')}`,
        description: "Semaine silencieuse après une période active"
      });
    }
  });

  const milestones = [100, 500, 1000, 2500, 5000];
  let runningTotal = 0;
  weeks.forEach((week, weekIndex) => {
    week.contributionDays.forEach(day => {
      const prevTotal = runningTotal;
      runningTotal += day.contributionCount;
      milestones.forEach(m => {
        if (prevTotal < m && runningTotal >= m) {
          events.push({
            type: 'MILESTONE',
            date: day.date,
            weekIndex,
            value: m,
            label: `MILESTONE_${m}`,
            description: `Cap des ${m} contributions atteint`
          });
        }
      });
    });
  });

  return events.slice(0, 10);
}

export function transformData(raw: any): SpireBlueprint {
  const root = raw?.data || raw;
  
  const user = root?.user || root?.viewer;
  
  if (!user) {
    console.error("Architect Error: No user data found", raw);
    return createEmptyBlueprint();
  }

  const calendar = user.contributionsCollection?.contributionCalendar;
  if (!calendar) {
    console.error("Architect Error: No calendar data found", raw);
    return createEmptyBlueprint();
  }

  const profile: UserProfile = {
    login: user.login || 'unknown',
    name: user.name,
    avatarUrl: user.avatarUrl || '',
    bio: user.bio,
    createdAt: user.createdAt,
    followers: user.followers?.totalCount || 0,
    following: user.following?.totalCount || 0,
    totalRepos: user.repositories?.totalCount || 0
  };

  const breakdown: ContributionBreakdown = {
    commits: user.contributionsCollection?.totalCommitContributions || 0,
    pullRequests: user.contributionsCollection?.totalPullRequestContributions || 0,
    reviews: user.contributionsCollection?.totalPullRequestReviewContributions || 0,
    issues: user.contributionsCollection?.totalIssueContributions || 0,
    repositories: user.contributionsCollection?.totalRepositoryContributions || 0,
    restricted: user.contributionsCollection?.restrictedContributionsCount || 0
  };

  const topRepos: RepoData[] = (user.repositories?.nodes || []).map((repo: any) => ({
    name: repo.name,
    stars: repo.stargazerCount || 0,
    forks: repo.forkCount || 0,
    language: repo.primaryLanguage?.name || null,
    languageColor: repo.primaryLanguage?.color || null,
    updatedAt: repo.updatedAt,
    description: repo.description
  }));

  const languageMap = new Map<string, { color: string; count: number }>();
  topRepos.forEach(repo => {
    if (repo.language) {
      const existing = languageMap.get(repo.language) || { color: repo.languageColor || '#888', count: 0 };
      existing.count++;
      languageMap.set(repo.language, existing);
    }
  });
  const totalLangRepos = Array.from(languageMap.values()).reduce((a, b) => a + b.count, 0);
  const languages: LanguageStat[] = Array.from(languageMap.entries())
    .map(([name, data]) => ({
      name,
      color: data.color,
      count: data.count,
      percentage: Math.round((data.count / totalLangRepos) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const { totalContributions, weeks } = calendar;

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  let busiestDay = { date: '', count: 0 };
  let longestDrought = 0;
  let currentDrought = 0;
  let totalActiveDays = 0;
  
  const monthCounts: Record<string, number> = {};
  let weekendCommits = 0;
  const weekdayDist = [0, 0, 0, 0, 0, 0, 0];

  const allDays = weeks.flatMap((w: ContributionWeek) => w.contributionDays);
  
  allDays.forEach((day: ContributionDay, index: number) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    
    if (day.contributionCount > 0) {
      totalActiveDays++;
      tempStreak++;
      currentDrought = 0;
      if (tempStreak > maxStreak) maxStreak = tempStreak;
      
      if (day.contributionCount > busiestDay.count) {
        busiestDay = { date: day.date, count: day.contributionCount };
      }

      const month = date.toLocaleString('fr-FR', { month: 'long' });
      monthCounts[month] = (monthCounts[month] || 0) + day.contributionCount;

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendCommits += day.contributionCount;
      }
      weekdayDist[dayOfWeek] += day.contributionCount;
    } else {
      currentDrought++;
      if (currentDrought > longestDrought) longestDrought = currentDrought;
      tempStreak = 0;
    }

    if (index === allDays.length - 1 && day.contributionCount > 0) {
      currentStreak = tempStreak;
    }
  });

  let bestMonth = { name: '', count: 0 };
  let worstMonth = { name: '', count: Infinity };
  Object.entries(monthCounts).forEach(([name, count]) => {
    if (count > bestMonth.count) bestMonth = { name, count };
    if (count < worstMonth.count && count > 0) worstMonth = { name, count };
  });
  if (worstMonth.count === Infinity) worstMonth = { name: 'N/A', count: 0 };

  const weekendRatio = totalContributions > 0 ? Math.round((weekendCommits / totalContributions) * 100) : 0;
  const consistency = allDays.length > 0 ? Math.round((totalActiveDays / allDays.length) * 100) : 0;
  const averagePerDay = allDays.length > 0 ? Math.round((totalContributions / allDays.length) * 10) / 10 : 0;
  const averagePerWeek = weeks.length > 0 ? Math.round((totalContributions / weeks.length) * 10) / 10 : 0;

  const { rank: ranking, description: rankingDescription } = calculateRanking(totalContributions, maxStreak, consistency);

  const floors: FloorData[] = weeks.map((week: ContributionWeek, index: number) => {
    const weekTotal = week.contributionDays.reduce((acc: number, day: ContributionDay) => acc + day.contributionCount, 0);
    const height = Math.max(0.2, Math.min(weekTotal * 0.5, 10)); 
    const activeDays = week.contributionDays.filter((d: ContributionDay) => d.contributionCount > 0).length;
    const type = activeDays > 4 ? 'SOLID' : activeDays > 2 ? 'WIREFRAME' : 'VOID';

    return {
      id: index,
      height,
      color: weekTotal > 20 ? '#ff00ff' : weekTotal > 5 ? '#00f3ff' : '#333', 
      width: Math.max(2, Math.min(weekTotal * 0.2, 8)),
      type, 
      date: week.firstDay || week.contributionDays[0]?.date,
      weekTotal,
      activeDays,
      isRemarkable: false,
      remarkableType: undefined
    };
  });

  const remarkableEvents = findRemarkableEvents(weeks, floors);
  
  remarkableEvents.forEach(event => {
    if (floors[event.weekIndex]) {
      floors[event.weekIndex].isRemarkable = true;
      floors[event.weekIndex].remarkableType = event.type === 'PEAK' ? 'PEAK' : event.type === 'DROUGHT' ? 'DROUGHT' : 'STREAK';
    }
  });

  return {
    floors,
    stats: {
      totalContributions,
      maxStreak,
      currentStreak,
      busiestDay,
      bestMonth,
      worstMonth,
      weekendRatio,
      weekdayDistribution: weekdayDist,
      ranking,
      rankingDescription,
      calendar: weeks,
      topRepos,
      languages,
      remarkableEvents,
      profile,
      breakdown,
      averagePerDay,
      averagePerWeek,
      totalActiveDays,
      longestDrought,
      consistency
    }
  };
}

function createEmptyBlueprint(): SpireBlueprint {
  return { 
    floors: [], 
    stats: { 
      totalContributions: 0, 
      maxStreak: 0,
      currentStreak: 0,
      busiestDay: { date: '', count: 0 }, 
      bestMonth: { name: 'VOID', count: 0 },
      worstMonth: { name: 'VOID', count: 0 },
      weekendRatio: 0,
      weekdayDistribution: [0,0,0,0,0,0,0],
      ranking: 'GHOST',
      rankingDescription: 'Aucune donnée détectée.',
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
    } 
  };
}
