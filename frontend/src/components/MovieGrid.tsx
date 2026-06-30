import React from 'react';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { Skeleton } from './Skeleton';

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, isLoading }) => {
  if (isLoading) {
    return (
      <div className="movie-grid-container">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} type="card" />
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        color: 'var(--text-muted)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '1.25rem', marginBottom: '10px' }}>No matches found.</p>
        <p style={{ fontSize: '0.9rem' }}>Try refining your keywords or clearing active filters.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid-container">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}

      <style>{`
        .movie-grid-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          width: 100%;
        }
        @media (max-width: 1200px) {
          .movie-grid-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 900px) {
          .movie-grid-container {
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }
        }
        @media (max-width: 600px) {
          .movie-grid-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};
export default MovieGrid;
