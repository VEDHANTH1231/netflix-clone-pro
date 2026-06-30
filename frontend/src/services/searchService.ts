import { api } from './api';
import { Movie } from '../types/movie';

export interface SearchResponse {
  success: boolean;
  data: Movie[];
}

export const searchService = {
  search: async (query: string): Promise<Movie[]> => {
    if (!query || query.trim() === '') return [];
    const response = await api.get<SearchResponse>(`/movies/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },
};
export default searchService;
