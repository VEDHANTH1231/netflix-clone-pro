import { useState, useCallback } from 'react';
import { Movie, MovieDetails } from '../types/movie';
import { movieService } from '../services/movieService';

// Module-level global cache to persist loaded resources between components and mount lifecycles
const movieCache: {
  trending: Movie[] | null;
  categories: Record<string, Movie[]>;
  details: Record<string, MovieDetails>;
} = {
  trending: null,
  categories: {},
  details: {},
};

export const useMovies = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>(movieCache.trending || []);
  const [categoryMovies, setCategoryMovies] = useState<Record<string, Movie[]>>(movieCache.categories);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  const getTrending = useCallback(async (forceRefresh = false) => {
    if (movieCache.trending && !forceRefresh) {
      setTrendingMovies(movieCache.trending);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await movieService.fetchTrendingMovies();
      movieCache.trending = data;
      setTrendingMovies(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch trending movies');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCategory = useCallback(async (category: string, forceRefresh = false) => {
    const cachedCategory = movieCache.categories[category];
    if (cachedCategory && !forceRefresh) {
      setCategoryMovies((prev) => ({ ...prev, [category]: cachedCategory }));
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await movieService.fetchMoviesByCategory(category);
      movieCache.categories[category] = data;
      setCategoryMovies((prev) => ({ ...prev, [category]: data }));
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || `Failed to fetch ${category} movies`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await movieService.searchMovies(query);
      setSearchResults(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMovieDetail = useCallback(async (movieId: string, forceRefresh = false): Promise<MovieDetails | null> => {
    const cachedDetail = movieCache.details[movieId];
    if (cachedDetail && !forceRefresh) {
      return cachedDetail;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await movieService.getMovieDetails(movieId);
      movieCache.details[movieId] = data;
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch movie details');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    trendingMovies,
    categoryMovies,
    searchResults,
    getTrending,
    getCategory,
    search,
    getMovieDetail,
  };
};
export default useMovies;
