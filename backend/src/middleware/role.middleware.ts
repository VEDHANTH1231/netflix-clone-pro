import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...allowedRoles: ('user' | 'moderator' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: { message: 'Access denied: Insufficient permissions' },
      });
      return;
    }

    next();
  };
};
