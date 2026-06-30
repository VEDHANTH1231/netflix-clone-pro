import axios from 'axios';
import { getCache, setCache } from '../../config/redis.js';
import { CustomError } from '../../middleware/errorHandler.js';
import { TMDBMovie, TMDBMovieDetails } from './movie.types.js';

export class MovieService {
  private tmdbBaseUrl = 'https://api.themoviedb.org/3';
  private apiKey = process.env.TMDB_API_KEY;

  // TMDB Genre mappings to IDs
  private genreMap: Record<string, number> = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    scifi: 878,
    thriller: 53,
    war: 10752,
    western: 37,
  };

  /**
   * Fetch Trending Movies
   */
  public async getTrendingMovies(): Promise<TMDBMovie[]> {
    const cacheKey = 'trending:movies';
    const ttl = 600; // 10 minutes

    // 1. Check Cache
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log('Cache hit: Trending Movies');
      return JSON.parse(cached);
    }

    // 2. Fetch from TMDB
    let movies: TMDBMovie[] = [];
    if (this.isMockMode()) {
      movies = this.getMockMoviesList('Trending');
    } else {
      try {
        const response = await axios.get(`${this.tmdbBaseUrl}/trending/movie/week`, {
          params: { api_key: this.apiKey },
        });
        movies = response.data.results || [];
      } catch (error: any) {
        console.error('TMDB API Trending Failure:', error.message || error);
        // Graceful fallback to mock data on external API failure
        movies = this.getMockMoviesList('Trending');
      }
    }

    // 3. Store in Cache
    await setCache(cacheKey, JSON.stringify(movies), ttl);
    return movies;
  }

  /**
   * Search Movies by Query
   */
  public async searchMovies(query: string): Promise<TMDBMovie[]> {
    if (!query || query.trim() === '') {
      return [];
    }

    const trimmedQuery = query.trim().toLowerCase();
    const cacheKey = `movie:search:${trimmedQuery}`;
    const ttl = 900; // 15 minutes

    // 1. Check Cache
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log(`Cache hit: Search [${trimmedQuery}]`);
      return JSON.parse(cached);
    }

    // 2. Fetch from TMDB
    let movies: TMDBMovie[] = [];
    if (this.isMockMode()) {
      movies = this.getMockMoviesList('Search').filter(m =>
        m.title.toLowerCase().includes(trimmedQuery) || m.overview.toLowerCase().includes(trimmedQuery)
      );
    } else {
      try {
        const response = await axios.get(`${this.tmdbBaseUrl}/search/movie`, {
          params: {
            api_key: this.apiKey,
            query: trimmedQuery,
          },
        });
        movies = response.data.results || [];
      } catch (error: any) {
        console.error(`TMDB API Search Failure [${trimmedQuery}]:`, error.message || error);
        movies = this.getMockMoviesList('Search').filter(m =>
          m.title.toLowerCase().includes(trimmedQuery) || m.overview.toLowerCase().includes(trimmedQuery)
        );
      }
    }

    // 3. Store in Cache
    await setCache(cacheKey, JSON.stringify(movies), ttl);
    return movies;
  }

  /**
   * Fetch Movie Details
   */
  public async getMovieDetails(movieId: string): Promise<TMDBMovieDetails> {
    const cacheKey = `movie:details:${movieId}`;
    const ttl = 1800; // 30 minutes

    // 1. Check Cache
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log(`Cache hit: Movie Details [${movieId}]`);
      return JSON.parse(cached);
    }

    // 2. Fetch from TMDB
    let movie: TMDBMovieDetails;
    if (this.isMockMode()) {
      movie = this.getMockMovieDetails(movieId);
    } else {
      try {
        const response = await axios.get(`${this.tmdbBaseUrl}/movie/${movieId}`, {
          params: { api_key: this.apiKey },
        });
        movie = response.data;
      } catch (error: any) {
        console.error(`TMDB API Movie Details Failure [${movieId}]:`, error.message || error);
        if (error.response && error.response.status === 404) {
          throw new CustomError('Movie not found on TMDB', 404);
        }
        // Graceful fallback to mock details
        movie = this.getMockMovieDetails(movieId);
      }
    }

    // 3. Store in Cache
    await setCache(cacheKey, JSON.stringify(movie), ttl);
    return movie;
  }

  /**
   * Fetch Movies by Category (mapped to TMDB genre IDs)
   */
  public async getMoviesByCategory(categoryName: string): Promise<TMDBMovie[]> {
    const cleanCategory = categoryName.trim().toLowerCase();
    const genreId = this.genreMap[cleanCategory];

    if (!genreId) {
      throw new CustomError(`Invalid category name: '${categoryName}'. Supported options: ${Object.keys(this.genreMap).join(', ')}`, 400);
    }

    const cacheKey = `movie:category:${cleanCategory}`;
    const ttl = 1800; // 30 minutes

    // 1. Check Cache
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log(`Cache hit: Category [${cleanCategory}]`);
      return JSON.parse(cached);
    }

    // 2. Fetch from TMDB
    let movies: TMDBMovie[] = [];
    if (this.isMockMode()) {
      movies = this.getMockMoviesList(categoryName);
    } else {
      try {
        const response = await axios.get(`${this.tmdbBaseUrl}/discover/movie`, {
          params: {
            api_key: this.apiKey,
            with_genres: genreId,
            sort_by: 'popularity.desc',
          },
        });
        movies = response.data.results || [];
      } catch (error: any) {
        console.error(`TMDB API Discover Failure [${cleanCategory}]:`, error.message || error);
        movies = this.getMockMoviesList(categoryName);
      }
    }

    // 3. Store in Cache
    await setCache(cacheKey, JSON.stringify(movies), ttl);
    return movies;
  }

  /**
   * Helper: Determine if we should mock API calls
   */
  private isMockMode(): boolean {
    return !this.apiKey || this.apiKey === 'mock' || this.apiKey === 'your_tmdb_api_key';
  }

  /**
   * Mock data generator lists
   */
  private getMockMoviesList(tag: string): TMDBMovie[] {
    return [
      {
        id: 101,
        title: `Stranger Things: The Movie (${tag} Mock)`,
        overview: 'A love letter to the supernatural classics of the 80s as a group of friends face off against shadow monsters.',
        poster_path: '/rt7TLznLMni74hUgo2VE16lRIeB.jpg',
        backdrop_path: '/56v2Kj2iUa0alZuHnEGg68z15sa.jpg',
        release_date: '2026-05-15',
        genre_ids: [28, 878, 53],
        vote_average: 8.8,
        vote_count: 1250,
        popularity: 98.5,
        original_language: 'en',
      },
      {
        id: 102,
        title: `The Crown Jewels (${tag} Mock)`,
        overview: 'A thrilling drama mapping royal conspiracies and hidden plots in twentieth-century England.',
        poster_path: '/c5Azzf6wPugyXG2B1C2dC1c2d.jpg',
        backdrop_path: '/x4Z5B6yPUgYxG2B1C2dC1c2d.jpg',
        release_date: '2025-11-20',
        genre_ids: [18, 36],
        vote_average: 8.2,
        vote_count: 850,
        popularity: 76.2,
        original_language: 'en',
      },
      {
        id: 103,
        title: `Extraction: Tokyo Drift (${tag} Mock)`,
        overview: 'Mercenary Tyler Rake takes on a fresh task in Japan, battling underground yakuza syndicates.',
        poster_path: '/东京.jpg',
        backdrop_path: '/东京_backdrop.jpg',
        release_date: '2026-02-10',
        genre_ids: [28, 53],
        vote_average: 7.9,
        vote_count: 2200,
        popularity: 120.4,
        original_language: 'en',
      },
      {
        id: 104,
        title: `Black Mirror: Reboot (${tag} Mock)`,
        overview: 'Anthology stories revealing a dystopian near-future where AI systems run human social networks.',
        poster_path: '/bm.jpg',
        backdrop_path: '/bm_bd.jpg',
        release_date: '2026-01-05',
        genre_ids: [878, 9648],
        vote_average: 8.5,
        vote_count: 1400,
        popularity: 88.7,
        original_language: 'en',
      },
    ];
  }

  /**
   * Mock details generator
   */
  private getMockMovieDetails(movieId: string): TMDBMovieDetails {
    const id = parseInt(movieId) || 101;
    return {
      id,
      title: `Stranger Things: The Movie (Mock Details ID: ${id})`,
      overview: 'A love letter to the supernatural classics of the 80s as a group of friends face off against shadow monsters.',
      poster_path: '/rt7TLznLMni74hUgo2VE16lRIeB.jpg',
      backdrop_path: '/56v2Kj2iUa0alZuHnEGg68z15sa.jpg',
      release_date: '2026-05-15',
      genres: [
        { id: 28, name: 'Action' },
        { id: 878, name: 'Sci-Fi' },
        { id: 53, name: 'Thriller' },
      ],
      vote_average: 8.8,
      vote_count: 1250,
      popularity: 98.5,
      original_language: 'en',
      runtime: 135,
      status: 'Released',
      tagline: 'Friends don\'t lie, but shadows do.',
      budget: 150000000,
      revenue: 450000000,
    };
  }
}
