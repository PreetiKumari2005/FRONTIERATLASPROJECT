import { LeaderboardRow } from '@/components/domain/leaderboard/LeaderboardTable';

export async function fetchLeaderboardData(category: string, license: string): Promise<LeaderboardRow[]> {
  try {
    // ⚠️ CHANGE '5000' BELOW TO YOUR EXACT BACKEND PORT (e.g., 4000 or 8787) IF IT IS DIFFERENT
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; 
    const query = new URLSearchParams({ category, license });
    const targetUrl = `${baseUrl}/api/v1/leaderboard?${query.toString()}`;
    
    console.log("Leaderboard trying to fetch from target:", targetUrl);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    // This catches the connection breakdown gracefully so Next.js doesn't crash with a red screen
    console.error('API Fetch failed to connect:', error);
    return []; 
  }
}