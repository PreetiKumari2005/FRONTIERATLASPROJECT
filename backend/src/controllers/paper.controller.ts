import { Context } from "hono";
import * as paperService from "../services/paper.service.js";
import { redisManager } from "../lib/redis.js";
import { QueryRouter } from "../routing/index.js";
import { IdResolver } from "../routing/IdResolver.js";

export const ingestPaper = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const body = await c.req.json();

  try {
    const newPaper = await paperService.ingestPaper(queryRouter, body.content);

    // Invalidate caches
    const redis = redisManager.getClient();
    try {
      await redis.del(`paper:${newPaper.slug}`);
      // Use SCAN in production instead of KEYS for large datasets
      const keys = await redis.keys("papers:*");
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      console.error("Redis cache invalidation failed:", err);
    }

    return c.json(
      {
        status: "success",
        message: "Paper successfully ingested",
        paper_id: newPaper.id,
        slug: newPaper.slug,
      },
      201,
    );
  } catch (error: any) {
    console.error("Ingest error:", error);
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getPapers = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const sort = c.req.query("sort") || "trending";
  const task = c.req.query("task");
  const method = c.req.query("method");
  const model = c.req.query("model");
  const period = c.req.query("period") || "all";
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 20;

  const cacheKey = `papers:${JSON.stringify({ sort, task, method, model, period, page, limit })}`;

  try {
    const redis = redisManager.getClient();
    let cached = null;

    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error("Redis GET failed:", err);
    }

    if (cached) {
      return c.json(cached as any, 200);
    }

    const result = await paperService.getPapers(queryRouter, {
      sort,
      task,
      method,
      model,
      period,
      page,
      limit,
    });

    const response = {
      status: "success",
      count: result.papers.length,
      data: result,
    };

    try {
      await redis.set(cacheKey, response, { ex: 300 }); // 5 minutes
    } catch (err) {
      console.error("Redis SET failed:", err);
    }

    return c.json(response, 200);
  } catch (error: any) {
    console.error("getPapers error:", error);
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getPaperBySlug = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param("slug") as string;
  const cacheKey = `paper:${slug}`;

  try {
    const redis = redisManager.getClient();
    let cached = null;

    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error("Redis GET failed:", err);
    }

    if (cached) {
      return c.json(cached as any, 200);
    }

    const paper = await paperService.getPaperBySlug(queryRouter, slug);

    if (!paper) {
      return c.json({ status: "error", message: "Paper not found" }, 404);
    }

    const response = { status: "success", data: paper };

    try {
      await redis.set(cacheKey, response, { ex: 300 });
    } catch (err) {
      console.error("Redis SET failed:", err);
    }

    return c.json(response, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getPaperById = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const idResolver = c.var.idResolver as IdResolver | undefined; // optional fallback

  const id = c.req.param("id");

  try {
    const paper = await paperService.getPaperById(queryRouter, id as string, idResolver);
    if (!id) return c.json({ status: "error", message: "ID is required" }, 400);

    if (!paper) {
      return c.json({ status: "error", message: "Paper not found" }, 404);
    }

    return c.json({ status: "success", data: paper }, 200);
  } catch (error: any) {
    console.error("[getPaperById] Error:", error);
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const updatePaper = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param("slug") as string;
  const body = await c.req.json();

  try {
    const updatedPaper = await paperService.updatePaper(queryRouter, slug, body);

    if (!updatedPaper) {
      return c.json({ status: "error", message: "Paper not found" }, 404);
    }

    const redis = redisManager.getClient();
    try {
      await redis.del(`paper:${slug}`);
      const keys = await redis.keys("papers:*");
      if (keys.length > 0) await redis.del(...keys);
    } catch (err) {
      console.error("Cache invalidation failed:", err);
    }

    return c.json({ status: "success", data: updatedPaper }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const deletePaper = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param("slug") as string;

  try {
    await paperService.deletePaper(queryRouter, slug);

    const redis = redisManager.getClient();
    try {
      await redis.del(`paper:${slug}`);
      const keys = await redis.keys("papers:*");
      if (keys.length > 0) await redis.del(...keys);
    } catch (err) {
      console.error("Cache invalidation failed:", err);
    }

    return c.json({ status: "success", message: "Paper deleted" }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const searchPapers = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;

  const searchQuery = {
    q: c.req.query("q")?.trim(),
    limit: c.req.query("limit") ? Number(c.req.query("limit")) : undefined,
    page: c.req.query("page") ? Number(c.req.query("page")) : undefined,
    sort: c.req.query("sort"),
  };

  try {
    const result = await paperService.searchPapers(queryRouter, searchQuery);
    return c.json({ status: "success", data: result }, 200);
  } catch (error: any) {
    console.error("Search error:", error);
    return c.json({ status: "error", message: error.message || "Search failed" }, 500);
  }
};