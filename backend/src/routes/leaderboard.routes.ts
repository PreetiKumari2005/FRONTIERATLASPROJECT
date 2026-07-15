import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/client.js";

// Extend Env to inherit context variables set by your index.ts middleware
type Env = {
  Variables: {
    prisma: PrismaClient;
  };
};

const router = new Hono<Env>();

// GET /api/v1/leaderboard
router.get("/", async (c) => {
  const prisma = c.get("prisma");

  try {
    let models: any[] = [];

    // Attempt to pull dynamically from your PostgreSQL/MySQL Prisma database tables
    try {
      models = await prisma.$queryRaw`
        SELECT * FROM "Model" 
        ORDER BY "eloScore" DESC
      `;
    } catch (dbError) {
      console.warn(
        "Leaderboard DB fetch failed or Schema Table does not exist yet. Using fallback mock datasets:",
        dbError
      );
    }

    // Fallback Mock Data matching the exact schema required by our LeaderboardTable frontend component
    if (!models || models.length === 0) {
      models = [
        {
          rank: 1,
          modelName: "Claude Fable 5",
          creator: "Anthropic",
          eloScore: 1508,
          confidenceInterval: "±9",
          votes: 4297,
          license: "Proprietary",
          category: "agent"
        },
        {
          rank: 2,
          modelName: "Claude Opus 4.6 (Thinking)",
          creator: "Anthropic",
          eloScore: 1504,
          confidenceInterval: "±4",
          votes: 46410,
          license: "Proprietary",
          category: "agent"
        },
        {
          rank: 3,
          modelName: "Claude Opus 4.7 (Thinking)",
          creator: "Anthropic",
          eloScore: 1502,
          confidenceInterval: "±5",
          votes: 32629,
          license: "Proprietary",
          category: "agent"
        },
        {
          rank: 4,
          modelName: "Claude Opus 4.6",
          creator: "Anthropic",
          eloScore: 1499,
          confidenceInterval: "±4",
          votes: 49596,
          license: "Proprietary",
          category: "agent"
        },
        {
          rank: 5,
          modelName: "Claude Opus 4.7",
          creator: "Anthropic",
          eloScore: 1493,
          confidenceInterval: "±5",
          votes: 33793,
          license: "Proprietary",
          category: "agent"
        },
        {
          rank: 6,
          modelName: "Muse-Spark",
          creator: "Meta",
          eloScore: 1487,
          confidenceInterval: "±6",
          votes: 13607,
          license: "Open Source",
          category: "agent"
        },
        {
          rank: 7,
          modelName: "Gemini 3.1 Pro Preview",
          creator: "Google",
          eloScore: 1486,
          confidenceInterval: "±4",
          votes: 60640,
          license: "Proprietary",
          category: "agent"
        },
        {
          rank: 8,
          modelName: "Gemini 3 Pro",
          creator: "Google",
          eloScore: 1486,
          confidenceInterval: "±4",
          votes: 41314,
          license: "Proprietary",
          category: "agent"
        },
        {
          rank: 9,
          modelName: "GPT-5.5 High",
          creator: "OpenAI",
          eloScore: 1481,
          confidenceInterval: "±5",
          votes: 28268,
          license: "Proprietary",
          category: "agent"
        },
        {
          rank: 10,
          modelName: "GLM 5.2 (Max)",
          creator: "Z.ai",
          eloScore: 1471,
          confidenceInterval: "±10",
          votes: 3357,
          license: "Proprietary",
          category: "agent"
        }
      ];
    }

    return c.json({
      success: true,
      data: models
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
