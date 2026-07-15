import { Context } from 'hono';
import { LeaderboardService } from '../services/leaderboard.service.js';

export const getLeaderboardData = async (c: Context) => {
  try {
    // In Hono, query params are fetched via c.req.query()
    const category = c.req.query('category');
    const license = c.req.query('license');

    const rankings = await LeaderboardService.queryStandings(category, license);
    
    const processedRankings = rankings.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    // In Hono, you return c.json() directly
    return c.json(processedRankings, 200);
  } catch (error: any) {
    return c.json({ 
      message: 'Failed to query system leaderboards matrix context.', 
      error: error.message 
    }, 500);
  }
};