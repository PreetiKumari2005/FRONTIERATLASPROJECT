import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/client";
import { LeaderboardService } from "../services/leaderboard.service.js"; // 🎯 Import the service mapping

type Env = {
  Variables: {
    prisma: PrismaClient;
  };
};

const router = new Hono<Env>();

// GET /api/v1/leaderboard
router.get("/", async (c) => {
  const prisma = c.get("prisma");
  
  // 1. Capture query strings passed down by the frontend fetch layer
  const category = c.req.query('category');
  const license = c.req.query('license');

  try {
    let models: any[] = [];

    // Attempt to pull dynamically from your database using proper conditional lookups
    try {
      if (category) {
        models = await prisma.$queryRaw`
          SELECT * FROM "Model" 
          WHERE LOWER("category") = LOWER(${category})
          ORDER BY "eloScore" DESC
        `;
      } else {
        models = await prisma.$queryRaw`
          SELECT * FROM "Model" 
          ORDER BY "eloScore" DESC
        `;
      }
    } catch (dbError) {
      console.warn(
        "Leaderboard DB fetch failed or Schema Table does not exist yet. Using unified service layer fallbacks:",
        dbError
      );
    }

    // 2. If the database is missing or empty, pull dynamically from your service layer mock arrays!
    if (!models || models.length === 0) {
      models = await LeaderboardService.queryStandings(category, license);
    }

    // 3. Recalculate incremental rank arrays down the stack cleanly
    const processedModels = models.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    // 4. Return matching envelope format expected by the client component wrapper logic
    return c.json({
      success: true,
      data: processedModels
    });

  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: error?.message || "Internal server error occurred fetching models matrix"
      },
      500
    );
  }
});

export default router;