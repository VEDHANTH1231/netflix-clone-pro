import { api } from './api';

export interface WatchlistActionResponse {
  success: boolean;
  message: string;
  data: string[]; // Returns the updated watchlist array of string IDs
}

export const watchlistService = {
  addToWatchlist: async (movieId: string): Promise<string[]> => {
    const response = await api.post<WatchlistActionResponse>('/auth/watchlist', { movieId });
    return response.data.data;
  },

  removeFromWatchlist: async (movieId: string): Promise<string[]> => {
    const response = await api.delete<WatchlistActionResponse>(`/auth/watchlist/${movieId}`);
    return response.data.data;
  },
};
export default watchlistService;
