import { Hono } from 'hono';
import * as methodController from '../controllers/method.controller.js';

const methodRoutes = new Hono();

methodRoutes.get('/', methodController.getMethods as any);
methodRoutes.get('/:slug', methodController.getMethodBySlug as any);

export default methodRoutes;
