import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: { message: 'Please provide name, email and password' } });
      return;
    }

    const result = await authService.register(name, email, password);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: { message: 'Please provide email and password' } });
      return;
    }

    const result = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, error: { message: 'Refresh token is required' } });
      return;
    }

    const accessToken = await authService.refresh(refreshToken);
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.user is set by authMiddleware
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: { message: 'Not authenticated' } });
      return;
    }

    const user = await authService.getProfile(userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const addToWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { movieId } = req.body;
    if (!userId) {
      res.status(401).json({ success: false, error: { message: 'Not authenticated' } });
      return;
    }
    if (!movieId) {
      res.status(400).json({ success: false, error: { message: 'Movie ID is required' } });
      return;
    }

    const watchlist = await authService.addToWatchlist(userId, String(movieId));
    res.status(200).json({
      success: true,
      message: 'Added to watchlist successfully',
      data: watchlist,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { movieId } = req.params;
    if (!userId) {
      res.status(401).json({ success: false, error: { message: 'Not authenticated' } });
      return;
    }
    if (!movieId) {
      res.status(400).json({ success: false, error: { message: 'Movie ID path parameter is required' } });
      return;
    }

    const watchlist = await authService.removeFromWatchlist(userId, String(movieId));
    res.status(200).json({
      success: true,
      message: 'Removed from watchlist successfully',
      data: watchlist,
    });
  } catch (error) {
    next(error);
  }
};
