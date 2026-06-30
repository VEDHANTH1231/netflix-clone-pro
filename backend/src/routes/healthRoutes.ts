import { Router } from 'express';
import {
  checkGeneralHealth,
  checkDatabaseHealth,
  checkCacheHealth,
} from '../controllers/healthController.js';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: General health status
 *     description: Returns basic server health info, uptime, memory, and environment details.
 *     responses:
 *       200:
 *         description: Server is active.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 uptime:
 *                   type: number
 *                 timestamp:
 *                   type: string
 */
router.get('/', checkGeneralHealth);

/**
 * @openapi
 * /api/health/database:
 *   get:
 *     summary: Database health check
 *     description: Checks if the MongoDB connection is alive.
 *     responses:
 *       200:
 *         description: Database is connected.
 *       503:
 *         description: Database connection is offline.
 */
router.get('/database', checkDatabaseHealth);

/**
 * @openapi
 * /api/health/cache:
 *   get:
 *     summary: Redis health check
 *     description: Checks if the Redis cache connection is alive.
 *     responses:
 *       200:
 *         description: Cache is connected.
 *       503:
 *         description: Cache connection is offline.
 */
router.get('/cache', checkCacheHealth);

export default router;
