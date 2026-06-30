import { Context } from 'hono';
import * as methodService from '../services/method.service.js';

export const getMethods = async (c: Context) => {
  const prisma = c.var.prisma;
  const limit = Number(c.req.query('limit')) || 50;
  const skip = Number(c.req.query('skip')) || 0;

  try {
    const methods = await methodService.getMethods(prisma, limit, skip);
    return c.json({ status: "success", count: methods.length, data: methods }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getMethodBySlug = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;

  try {
    const method = await methodService.getMethodBySlug(prisma, slug);
    if (!method) return c.json({ status: "error", message: "Method not found" }, 404);
    return c.json({ status: "success", data: method }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};
