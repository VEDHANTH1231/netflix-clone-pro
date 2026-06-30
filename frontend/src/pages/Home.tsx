import React, { useEffect } from 'react';
import { Hero } from '../components/Hero';
import { MovieRow } from '../components/MovieRow';
import { useMovies } from '../hooks/useMovies';

export const Home: React.FC = () => {
  const {
    isLoading,
    error,
    trendingMovies,
    categoryMovies,
    getTrending,
    getCategory,
  } = useMovies();

  // Load movies on mount
  useEffect(() => {
    getTrending();
    getCategory('action');
    getCategory('comedy');
    getCategory('drama');
    getCategory('horror');
  }, [getTrending, getCategory]);

  const featuredMovie = trendingMovies[0];

  return (
    <div style={{ backgroundColor: 'var(--bg-black)', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Hero Banner with loading check */}
      <Hero movie={featuredMovie} isLoading={isLoading && !featuredMovie} />
      
      {/* Display API errors if they exist */}
      {error && (
        <div style={{ 
          margin: '20px 4%', 
          padding: '15px', 
          backgroundColor: 'rgba(229, 9, 20, 0.2)', 
          border: '1px solid var(--netflix-red)', 
          color: 'var(--text-white)',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          Warning: Could not connect to streaming servers. Displaying mock listings where available. ({error})
        </div>
      )}

      {/* Movie Rows with loading checks */}
      <div style={{ marginTop: '-4vw', position: 'relative', zIndex: 10 }}>
        <MovieRow 
          title="Trending Now" 
          movies={trendingMovies} 
          isLoading={isLoading && trendingMovies.length === 0} 
        />
        <MovieRow 
          title="Action & Adventure" 
          movies={categoryMovies['action']} 
          isLoading={isLoading && !categoryMovies['action']} 
        />
        <MovieRow 
          title="Comedy Hits" 
          movies={categoryMovies['comedy']} 
          isLoading={isLoading && !categoryMovies['comedy']} 
        />
        <MovieRow 
          title="Acclaimed Dramas" 
          movies={categoryMovies['drama']} 
          isLoading={isLoading && !categoryMovies['drama']} 
        />
        <MovieRow 
          title="Horror Fanatics" 
          movies={categoryMovies['horror']} 
          isLoading={isLoading && !categoryMovies['horror']} 
        />
      </div>
    </div>
  );
};
export default Home;
