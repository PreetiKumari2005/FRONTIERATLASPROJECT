import { Hono } from 'hono';
import * as modelController from '../controllers/model.controller.js';

const modelRoutes = new Hono();

modelRoutes.get('/', modelController.getModels as any);
modelRoutes.get('/:slug', modelController.getModelBySlug as any);

export default modelRoutes;
