import { Color } from "three";

export type ContributionDay = {
  contributionCount: number;
  date: string;
  color: string;
};

export type ContributionWeek = {
  contributionDays: ContributionDay[];
  firstDay: string;
};

export type SpireData = {
  totalContributions: number;
  floors: FloorData[];
};

export type FloorData = {
  id: number;
  height: number;
  color: string;
  width: number;
  type: 'SOLID' | 'WIREFRAME' | 'VOID';
  date: string;
};

export interface UserStats {
  totalContributions: number;
  maxStreak: number; // in days
  busiestDay: { date: string; count: number };
  bestMonth: { name: string; count: number };
  weekendRatio: number; // Percentage of commits on weekends
  ranking: string; // Netrunner, Architect, etc.
  calendar?: ContributionWeek[]; // Raw calendar for heatmap
}

export interface SpireBlueprint {
  floors: FloorData[];
  stats: UserStats;
}

export function transformData(raw: any): SpireBlueprint {
  // 1. Safe extraction of the calendar
  const root = raw?.data?.user ? raw.data : raw?.user ? raw : raw;
  const calendar = root?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    console.error("Architect Error: No calendar data found", raw);
    return { 
      floors: [], 
      stats: { 
        totalContributions: 0, 
        maxStreak: 0, 
        busiestDay: { date: '', count: 0 }, 
        bestMonth: { name: 'VOID', count: 0 },
        weekendRatio: 0,
        ranking: 'GHOST' 
      } 
    };
  }

  const { totalContributions, weeks } = calendar;

  // 2. Calculate Stats
  let currentStreak = 0;
  let maxStreak = 0;
  let busiestDay = { date: '', count: 0 };
  
  // Monthly tracking
  const monthCounts: Record<string, number> = {};
  let weekendCommits = 0;

  // Flatten days
  const allDays = weeks.flatMap((w: ContributionWeek) => w.contributionDays);
  
  allDays.forEach((day: ContributionDay) => {
    // Streak & Busiest
    if (day.contributionCount > 0) {
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
      
      // Busiest Day
      if (day.contributionCount > busiestDay.count) {
        busiestDay = { date: day.date, count: day.contributionCount };
      }

      // Monthly Stats
      const date = new Date(day.date);
      const month = date.toLocaleString('default', { month: 'long' });
      monthCounts[month] = (monthCounts[month] || 0) + day.contributionCount;

      // Weekend Stats (0 = Sun, 6 = Sat)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendCommits += day.contributionCount;
      }
    } else {
      currentStreak = 0;
    }
  });

  // Find Best Month
  let bestMonth = { name: '', count: 0 };
  Object.entries(monthCounts).forEach(([name, count]) => {
    if (count > bestMonth.count) bestMonth = { name, count };
  });

  // Calculate Weekend Ratio
  const weekendRatio = totalContributions > 0 ? Math.round((weekendCommits / totalContributions) * 100) : 0;

  // Calculate Ranking
  let ranking = "NEOPHYTE";
  if (totalContributions > 100) ranking = "SCRIPTER";
  if (totalContributions > 500) ranking = "NETRUNNER";
  if (totalContributions > 1000) ranking = "CYBERMANCER";
  if (totalContributions > 2500) ranking = "ARCHITECT";
  if (totalContributions > 5000) ranking = "CONSTRUCT";

  // 3. Transform Weeks to Floors
  const floors: FloorData[] = weeks.map((week: ContributionWeek, index: number) => {
    const total = week.contributionDays.reduce((acc: number, day: ContributionDay) => acc + day.contributionCount, 0);
    const height = Math.max(0.2, Math.min(total * 0.5, 10)); 
    
    // Determine complexity/texture
    const activeDays = week.contributionDays.filter((d: ContributionDay) => d.contributionCount > 0).length;
    const type = activeDays > 4 ? 'SOLID' : activeDays > 2 ? 'WIREFRAME' : 'VOID';

    return {
      id: index,
      height,
      color: total > 20 ? '#ff00ff' : total > 5 ? '#00f3ff' : '#333', 
      width: Math.max(2, Math.min(total * 0.2, 8)),
      type, 
      date: week.firstDay || week.contributionDays[0]?.date
    };
  });

  return {
    floors,
    stats: {
      totalContributions,
      maxStreak,
      busiestDay,
      bestMonth,
      weekendRatio,
      ranking,
      calendar: weeks // Passing raw weeks for heatmap rendering
    }
  };
}
