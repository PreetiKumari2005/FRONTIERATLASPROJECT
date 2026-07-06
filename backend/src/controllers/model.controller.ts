import { Context } from 'hono';
import * as modelService from '../services/model.service.js';

export const getModels = async (c: Context) => {
  const prisma = c.var.prisma;
  const limit = Number(c.req.query('limit')) || 50;
  const skip = Number(c.req.query('skip')) || 0;

  try {
    const models = await modelService.getModels(prisma, limit, skip);
    return c.json({ status: "success", count: models.length, data: models }, 200);
  } catch (error: any) {
    console.error("Error in getModels controller:", error);
    return c.json({ status: "error", detail: error.message }, 500);
  }
};

export const getModelBySlug = async (c: Context) => {
  const prisma = c.var.prisma;
  const slug = c.req.param('slug') as string;

  try {
    const model = await modelService.getModelBySlug(prisma, slug);
    if (!model) return c.json({ status: "error", message: "Model not found" }, 404);
    return c.json({ status: "success", data: model }, 200);
  } catch (error: any) {
    return c.json({ status: "error", detail: error.message }, 500);
  }
};
