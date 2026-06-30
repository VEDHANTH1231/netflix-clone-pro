import { Router } from 'express';
import {
  getTrending,
  searchMovies,
  getMovieDetails,
  getMoviesByCategory,
} from './movie.controller.js';

const router = Router();

/**
 * @openapi
 * /api/movies/trending:
 *   get:
 *     summary: Fetch trending movies
 *     description: Returns a list of trending movies from TMDB (cached for 10 minutes).
 *     responses:
 *       200:
 *         description: Trending movies returned successfully.
 */
router.get('/trending', getTrending);

/**
 * @openapi
 * /api/movies/search:
 *   get:
 *     summary: Search movies by query
 *     description: Search for movies by title or description matching a query string (cached for 15 minutes).
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term
 *     responses:
 *       200:
 *         description: Search results returned successfully.
 *       400:
 *         description: Missing query parameter.
 */
router.get('/search', searchMovies);

/**
 * @openapi
 * /api/movies/category/{name}:
 *   get:
 *     summary: Fetch movies by category
 *     description: Returns movies matching a specific category genre, e.g. action, drama, comedy (cached for 30 minutes).
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The category genre name (action, horror, comedy, drama, etc.)
 *     responses:
 *       200:
 *         description: Category movies returned successfully.
 *       400:
 *         description: Invalid or unsupported category name.
 */
router.get('/category/:name', getMoviesByCategory);

/**
 * @openapi
 * /api/movies/{id}:
 *   get:
 *     summary: Fetch movie details
 *     description: Returns detailed metadata for a specific movie ID (cached for 30 minutes).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The TMDB movie ID
 *     responses:
 *       200:
 *         description: Movie details returned successfully.
 *       404:
 *         description: Movie not found.
 */
router.get('/:id', getMovieDetails);

export default router;
