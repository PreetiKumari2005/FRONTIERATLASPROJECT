import { Context } from 'hono';
import * as paperService from '../services/paper.service.js';
import { redisManager } from "../lib/redis.js";

export const ingestPaper = async (c: Context) => {
  const prisma = c.var.prisma;
  const body = await c.req.json();

  try {
    const newPaper = await paperService.ingestPaper(prisma, body.content);
    const redis = redisManager.getClient();

try {
  const keys = await redis.keys("papers:*");

  if (keys.length > 0) {
    await redis.del(...keys);
  }
} catch (err) {
  console.error("Redis cache invalidation failed:", err);
}
    return c.json({
      status: "success",
      message: "Paper successfully written via Prisma Neon Adapter",
      paper_id: newPaper.id,
      slug: newPaper.slug
    }, 201);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getPapers = async (c: Context) => {
  const prisma = c.var.prisma;
  const sort = c.req.query('sort') || 'trending';
  const task = c.req.query('task');
  const method = c.req.query('method');
  const model = c.req.query('model');
  const period = c.req.query('period') || 'all';
  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 20;

  try {
    const redis = redisManager.getClient();

  const cacheKey = `papers:${JSON.stringify({
    sort,
    task,
    method,
    model,
    period,
    page,
    limit,
  })}`;

  let cached = null;

try {
    cached = await redis.get(cacheKey);
} catch (err) {
    console.error("Redis GET failed:", err);
}

if (cached) {
    console.log("✅ CACHE HIT");
    return c.json(cached as any, 200);
}

  console.log("❌ CACHE MISS");
    const result = await paperService.getPapers(prisma, {
      sort,
      task,
      method,
      model,
      period,
      page,
      limit
    });

    const response = {
  status: "success",
  count: result.papers.length,
  data: result,
};

try {
    await redis.set(cacheKey, response, {
        ex: 300,
    });
} catch (err) {
    console.error("Redis SET failed:", err);
}

return c.json(response, 200);

    
  } catch (error: any) {
    return c.json({ 
      status: "error", 
      detail: error.message, 
      dbUrl: (c.env as any).DATABASE_URL,
      bindings: Object.keys(c.env || {})
    }, 500);
  }
};

export const getPaperBySlug = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;

  try {
    const redis = redisManager.getClient();

const cacheKey = `paper:${slug}`;

let cached = null;

try {
    cached = await redis.get(cacheKey);
} catch (err) {
    console.error("Redis GET failed:", err);
}

if (cached) {
    console.log("✅ PAPER CACHE HIT");
    return c.json(cached as any, 200);
}

console.log("❌ PAPER CACHE MISS");
    const paper = await paperService.getPaperBySlug(prisma, slug);

if (!paper) {
  return c.json({ status: "error", message: "Paper not found" }, 404);
}

const response = {
  status: "success",
  data: paper,
};

try {
    await redis.set(cacheKey, response, {
        ex: 300,
    });
} catch (err) {
    console.error("Redis SET failed:", err);
}

return c.json(response, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const updatePaper = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;
  const body = await c.req.json();

  try {
    const updatedPaper = await paperService.updatePaper(prisma, slug, body);
    const redis = redisManager.getClient();

try {
  await redis.del(`paper:${slug}`);

  const keys = await redis.keys("papers:*");

  if (keys.length > 0) {
    await redis.del(...keys);
  }
} catch (err) {
  console.error("Redis cache invalidation failed:", err);
}
    return c.json({ status: "success", data: updatedPaper }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const deletePaper = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;

  try {
    await paperService.deletePaper(prisma, slug);
    const redis = redisManager.getClient();

try {
  await redis.del(`paper:${slug}`);

  const keys = await redis.keys("papers:*");

  if (keys.length > 0) {
    await redis.del(...keys);
  }
} catch (err) {
  console.error("Redis cache invalidation failed:", err);
}
    return c.json({ status: "success", message: "Paper deleted" }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};
