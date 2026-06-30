import { Request, Response, NextFunction } from 'express';
import { getDBStatus } from '../config/db.js';
import { getRedisStatus } from '../config/redis.js';

export const checkGeneralHealth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const health = {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
    };
    res.status(200).json(health);
  } catch (error) {
    next(error);
  }
};

export const checkDatabaseHealth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const isConnected = getDBStatus();
    if (isConnected) {
      res.status(200).json({
        status: 'UP',
        service: 'Database (MongoDB)',
        details: 'Connected successfully',
      });
    } else {
      res.status(503).json({
        status: 'DOWN',
        service: 'Database (MongoDB)',
        details: 'Database connection not active',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const checkCacheHealth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const isConnected = getRedisStatus();
    if (isConnected) {
      res.status(200).json({
        status: 'UP',
        service: 'Cache (Redis)',
        details: 'Connected successfully',
      });
    } else {
      res.status(503).json({
        status: 'DOWN',
        service: 'Cache (Redis)',
        details: 'Redis connection not active',
      });
    }
  } catch (error) {
    next(error);
  }
};
