import { api } from './api';
import { Movie, MovieDetails } from '../types/movie';

export interface MoviesResponse {
  success: boolean;
  data: Movie[];
}

export interface MovieDetailsResponse {
  success: boolean;
  data: MovieDetails;
}

export const movieService = {
  fetchTrendingMovies: async (): Promise<Movie[]> => {
    const response = await api.get<MoviesResponse>('/movies/trending');
    return response.data.data;
  },

  fetchMoviesByCategory: async (categoryName: string): Promise<Movie[]> => {
    const response = await api.get<MoviesResponse>(`/movies/category/${categoryName}`);
    return response.data.data;
  },

  searchMovies: async (query: string): Promise<Movie[]> => {
    const response = await api.get<MoviesResponse>(`/movies/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  getMovieDetails: async (movieId: string): Promise<MovieDetails> => {
    const response = await api.get<MovieDetailsResponse>(`/movies/${movieId}`);
    return response.data.data;
  },
};
export default movieService;
