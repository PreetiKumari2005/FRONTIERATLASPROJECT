import { Context } from 'hono';
import * as taskService from '../services/task.service.js';
import { QueryRouter } from '../routing/index.js';
import { redisManager } from '../lib/redis.js';

export const getTasks = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const limit = Number(c.req.query('limit')) || 50;
  const skip = Number(c.req.query('skip')) || 0;

  const cacheKey = `tasks:list:${limit}:${skip}`;

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

    const tasks = await taskService.getTasks(queryRouter, limit, skip);
    const response = { status: 'success', count: tasks.length, data: tasks };

    try {
      await redis.set(cacheKey, response, { ex: 1800 }); // 30 minutes — tasks are very stable taxonomy
    } catch (err) {
      console.error('Redis SET failed:', err);
    }

    return c.json(response, 200);
  } catch (error: any) {
    return c.json({ status: 'error', detail: error.message }, 500);
  }
};

export const getTaskPaperCounts = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const cacheKey = `tasks:counts`;

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

    const counts = await taskService.getTaskPaperCounts(queryRouter);

    try {
      await redis.set(cacheKey, counts, { ex: 600 }); // 10 minutes — counts change when papers are added
    } catch (err) {
      console.error('Redis SET failed:', err);
    }

    return c.json(counts, 200);
  } catch (error: any) {
    return c.json({ status: 'error', detail: error.message }, 500);
  }
};

export const getTaskBySlug = async (c: Context) => {
  const queryRouter = c.var.queryRouter as QueryRouter;
  const slug = c.req.param('slug') as string;
  const cacheKey = `task:${slug}`;

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

    const task = await taskService.getTaskBySlug(queryRouter, slug);
    if (!task) return c.json({ status: 'error', message: 'Task not found' }, 404);

    const response = { status: 'success', data: task };

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
