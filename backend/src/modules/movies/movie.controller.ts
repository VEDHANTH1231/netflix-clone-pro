import { Request, Response, NextFunction } from 'express';
import { MovieService } from './movie.service.js';

const movieService = new MovieService();

export const getTrending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const movies = await movieService.getTrendingMovies();
    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

export const searchMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({
        success: false,
        error: { message: "Query parameter 'q' is required for search." },
      });
      return;
    }

    const movies = await movieService.searchMovies(query);
    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

export const getMovieDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        error: { message: 'Movie ID parameter is required' },
      });
      return;
    }

    const movie = await movieService.getMovieDetails(id);
    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

export const getMoviesByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.params;
    if (!name) {
      res.status(400).json({
        success: false,
        error: { message: 'Category name parameter is required' },
      });
      return;
    }

    const movies = await movieService.getMoviesByCategory(name);
    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};
