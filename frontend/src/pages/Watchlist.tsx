import React from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import { MovieCard } from '../components/MovieCard';
import { Skeleton } from '../components/Skeleton';

export const Watchlist: React.FC = () => {
  const { watchlist, isLoading, error } = useWatchlist();

  if (isLoading && watchlist.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-black)', minHeight: '100vh', padding: '100px 4%' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-white)', marginBottom: '30px' }}>
          My Watchlist
        </h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
        }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} type="card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-black)', 
      minHeight: '100vh', 
      padding: '100px 4% 40px 4%',
      color: 'var(--text-white)'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '30px' }}>
        My Watchlist
      </h1>

      {error && (
        <div style={{ 
          padding: '12px 20px', 
          backgroundColor: 'rgba(229, 9, 20, 0.2)', 
          border: '1px solid var(--netflix-red)', 
          color: 'var(--text-white)',
          borderRadius: '4px',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {watchlist.length === 0 ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '40vh',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Your watchlist is empty.</p>
          <p style={{ fontSize: '0.9rem' }}>Tap the + icon on a movie to save it here.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
        }} className="watchlist-grid">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* Grid responsiveness styles */}
      <style>{`
        .watchlist-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr) !important;
        }
        @media (max-width: 1200px) {
          .watchlist-grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
        }
        @media (max-width: 900px) {
          .watchlist-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .watchlist-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Watchlist;
