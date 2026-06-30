import { useState, useEffect, useCallback, useMemo } from 'react';
import { Movie } from '../types/movie';
import { searchService } from '../services/searchService';
import { useDebounce } from './useDebounce';

export interface SearchFilters {
  genres: number[];
  year: string;
  minRating: number;
}

const defaultFilters: SearchFilters = {
  genres: [],
  year: '',
  minRating: 0,
};

// Global cache for query results
const searchQueryCache: Record<string, Movie[]> = {};

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [rawResults, setRawResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 400);

  // Load and cache raw search queries
  useEffect(() => {
    const fetchResults = async () => {
      const trimmed = debouncedQuery.trim().toLowerCase();
      if (!trimmed) {
        setRawResults([]);
        return;
      }

      if (searchQueryCache[trimmed]) {
        setRawResults(searchQueryCache[trimmed]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await searchService.search(trimmed);
        searchQueryCache[trimmed] = data;
        setRawResults(data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || err.message || 'Search failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Client-side filtering logic applied dynamically to raw results
  const filteredResults = useMemo(() => {
    return rawResults.filter((movie) => {
      // 1. Filter by Genre
      if (filters.genres.length > 0) {
        const hasGenre = movie.genre_ids.some((id) => filters.genres.includes(id));
        if (!hasGenre) return false;
      }

      // 2. Filter by Year
      if (filters.year) {
        const movieYear = movie.release_date ? movie.release_date.split('-')[0] : '';
        if (movieYear !== filters.year) return false;
      }

      // 3. Filter by Rating
      if (movie.vote_average < filters.minRating) {
        return false;
      }

      return true;
    });
  }, [rawResults, filters]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters(defaultFilters);
    setRawResults([]);
  }, []);

  return {
    query,
    filters,
    isLoading,
    error,
    results: filteredResults,
    updateQuery,
    updateFilters,
    clearSearch,
  };
};
export default useSearch;
