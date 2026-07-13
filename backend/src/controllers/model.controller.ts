import { Context } from 'hono';
import * as modelService from '../services/model.service.js';
import { QueryRouter } from '../routing/index.js';
import { redisManager } from '../lib/redis.js';

export const getModels = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const limit = Number(c.req.query('limit')) || 50;
  const skip = Number(c.req.query('skip')) || 0;

  const cacheKey = `models:list:${limit}:${skip}`;

  try {
    const redis = redisManager.getClient();
    let cached = null;

    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error('Redis GET failed:', err);
    }

    if (cached) {
      return c.json(cached as any, 200);
    }

    const models = await modelService.getModels(queryRouter, limit, skip);
    const response = { status: 'success', count: models.length, data: models };

    try {
      await redis.set(cacheKey, response, { ex: 900 }); // 15 minutes — models added via paper imports
    } catch (err) {
      console.error('Redis SET failed:', err);
    }

    return c.json(response, 200);
  } catch (error: any) {
    console.error('Error in getModels controller:', error);
    return c.json({ status: 'error', detail: error.message }, 500);
  }
};

export const getModelBySlug = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param('slug') as string;
  const cacheKey = `model:${slug}`;

  try {
    const redis = redisManager.getClient();
    let cached = null;

    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error('Redis GET failed:', err);
    }

    if (cached) {
      return c.json(cached as any, 200);
    }

    const model = await modelService.getModelBySlug(queryRouter, slug);
    if (!model) return c.json({ status: 'error', message: 'Model not found' }, 404);

    const response = { status: 'success', data: model };

    try {
      await redis.set(cacheKey, response, { ex: 600 }); // 10 minutes
    } catch (err) {
      console.error('Redis SET failed:', err);
    }

    return c.json(response, 200);
  } catch (error: any) {
    return c.json({ status: 'error', detail: error.message }, 500);
  }
};
