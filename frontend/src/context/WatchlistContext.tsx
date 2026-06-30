import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Movie, MovieDetails } from '../types/movie';
import { useAuth } from '../hooks/useAuth';
import { watchlistService } from '../services/watchlistService';
import { movieService } from '../services/movieService';

export interface WatchlistContextType {
  watchlist: Movie[];
  watchlistIds: string[];
  isLoading: boolean;
  error: string | null;
  addToWatchlist: (movie: Movie) => Promise<void>;
  removeFromWatchlist: (movieId: string | number) => Promise<void>;
  isInWatchlist: (movieId: string | number) => boolean;
  fetchWatchlist: () => Promise<void>;
}

export const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, updateUserWatchlist } = useAuth();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to fetch details for all IDs in the watchlist
  const fetchWatchlistDetails = useCallback(async (ids: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const resolvedMovies = await Promise.all(
        ids.map(async (id) => {
          try {
            return await movieService.getMovieDetails(id);
          } catch (err) {
            console.error(`Failed to load details for movie ID: ${id}`, err);
            return null;
          }
        })
      );
      // Filter out failures
      const filteredMovies = resolvedMovies.filter((m): m is MovieDetails => m !== null);
      setWatchlist(filteredMovies);
    } catch (err: any) {
      setError('Failed to resolve watchlist details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync watchlist state on user / authentication change
  useEffect(() => {
    if (isAuthenticated && user) {
      const userWatchlist = user.watchlist || [];
      setWatchlistIds(userWatchlist);
      fetchWatchlistDetails(userWatchlist);
    } else {
      setWatchlist([]);
      setWatchlistIds([]);
    }
  }, [user, isAuthenticated, fetchWatchlistDetails]);

  const fetchWatchlist = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      await fetchWatchlistDetails(watchlistIds);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, watchlistIds, fetchWatchlistDetails]);

  const addToWatchlist = async (movie: Movie) => {
    const stringId = String(movie.id);
    if (watchlistIds.includes(stringId)) return;

    // Optimistic UI Update
    const prevIds = [...watchlistIds];
    const prevWatchlist = [...watchlist];

    const updatedIds = [...watchlistIds, stringId];
    setWatchlistIds(updatedIds);
    setWatchlist([...watchlist, movie]);
    updateUserWatchlist(updatedIds);

    try {
      const updatedBackendIds = await watchlistService.addToWatchlist(stringId);
      // Sync with returned state
      setWatchlistIds(updatedBackendIds);
      updateUserWatchlist(updatedBackendIds);
    } catch (err: any) {
      console.error('Failed to add to watchlist:', err);
      // Rollback on failure
      setWatchlistIds(prevIds);
      setWatchlist(prevWatchlist);
      updateUserWatchlist(prevIds);
      setError('Could not save to watchlist. Rolled back changes.');
    }
  };

  const removeFromWatchlist = async (movieId: string | number) => {
    const stringId = String(movieId);
    if (!watchlistIds.includes(stringId)) return;

    // Optimistic UI Update
    const prevIds = [...watchlistIds];
    const prevWatchlist = [...watchlist];

    const updatedIds = watchlistIds.filter((id) => id !== stringId);
    const updatedWatchlist = watchlist.filter((m) => String(m.id) !== stringId);
    setWatchlistIds(updatedIds);
    setWatchlist(updatedWatchlist);
    updateUserWatchlist(updatedIds);

    try {
      const updatedBackendIds = await watchlistService.removeFromWatchlist(stringId);
      // Sync with returned state
      setWatchlistIds(updatedBackendIds);
      updateUserWatchlist(updatedBackendIds);
    } catch (err: any) {
      console.error('Failed to remove from watchlist:', err);
      // Rollback on failure
      setWatchlistIds(prevIds);
      setWatchlist(prevWatchlist);
      updateUserWatchlist(prevIds);
      setError('Could not delete from watchlist. Rolled back changes.');
    }
  };

  const isInWatchlist = useCallback((movieId: string | number) => {
    return watchlistIds.includes(String(movieId));
  }, [watchlistIds]);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        watchlistIds,
        isLoading,
        error,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        fetchWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
