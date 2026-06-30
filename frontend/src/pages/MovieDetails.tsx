import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Star } from 'lucide-react';
import { useMovies } from '../hooks/useMovies';
import { MovieDetails as MovieDetailsType } from '../types/movie';
import { Skeleton } from '../components/Skeleton';
import { getImageUrl } from '../utils/image';

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMovieDetail, isLoading, error } = useMovies();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (id) {
        const details = await getMovieDetail(id);
        if (details) {
          setMovie(details);
        }
      }
    };
    fetchDetails();
  }, [id, getMovieDetail]);

  if (isLoading || !movie) {
    return (
      <div style={{ backgroundColor: 'var(--bg-black)', minHeight: '100vh', padding: '100px 4%' }}>
        <Skeleton type="title" style={{ width: '40%', height: '40px' }} />
        <Skeleton type="hero" style={{ height: '60vh', marginTop: '20px' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: 'var(--bg-black)', minHeight: '100vh', padding: '120px 4%', color: 'var(--text-white)' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-white)', cursor: 'pointer', marginBottom: '20px' }}
        >
          <ArrowLeft size={20} /> Back to Browse
        </button>
        <h2>Error loading movie details: {error}</h2>
      </div>
    );
  }

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop');
  const posterUrl = getImageUrl(movie.poster_path, 'poster');

  // Convert runtime to hours and minutes
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-black)', 
      minHeight: '100vh', 
      color: 'var(--text-white)',
      paddingBottom: '60px'
    }}>
      {/* Backdrop Header */}
      <div style={{
        position: 'relative',
        height: '70vh',
        width: '100%',
        backgroundImage: `linear-gradient(to right, rgba(20, 20, 20, 0.95) 0%, rgba(20, 20, 20, 0.6) 50%, rgba(20, 20, 20, 0.2) 100%), url(${backdropUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4%'
      }}>
        <div style={{ position: 'absolute', top: '90px', left: '4%' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.2)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)')}
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <div style={{ maxWidth: '700px', marginTop: '60px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '10px' }}>{movie.title}</h1>
          {movie.tagline && (
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '20px' }}>
              "{movie.tagline}"
            </p>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', fontSize: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#46d369', fontWeight: 'bold' }}>
              <Star size={16} fill="currentColor" /> {movie.vote_average.toFixed(1)} Rating
            </span>
            <span style={{ color: 'var(--text-light-gray)' }}>{releaseYear}</span>
            <span style={{ color: 'var(--text-light-gray)' }}>{formatRuntime(movie.runtime)}</span>
            <span style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '2px 6px', fontSize: '0.8rem', borderRadius: '3px' }}>HD</span>
          </div>

          <p style={{ fontSize: '1.1rem', lineHeight: '1.5', color: 'var(--text-light-gray)', marginBottom: '30px' }}>
            {movie.overview}
          </p>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--text-white)',
              color: 'var(--bg-black)',
              padding: '12px 30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              <Play size={20} fill="currentColor" /> Play
            </button>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(109, 109, 110, 0.7)',
              color: 'var(--text-white)',
              padding: '12px 30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              <Plus size={20} /> Add to List
            </button>
          </div>
        </div>
      </div>

      {/* Additional Details Grid */}
      <div style={{ padding: '40px 4%', display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 200px', display: 'none' }} className="details-poster-mobile-hide">
          <img 
            src={posterUrl} 
            alt={movie.title} 
            style={{ width: '100%', borderRadius: '4px', boxShadow: 'var(--shadow-card)' }} 
          />
        </div>
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '15px', color: 'var(--text-white)' }}>
              Production Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px 20px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Genres</span>
              <span>{movie.genres?.map(g => g.name).join(', ') || 'N/A'}</span>
              
              <span style={{ color: 'var(--text-muted)' }}>Status</span>
              <span>{movie.status || 'Released'}</span>
              
              {movie.budget ? (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>Budget</span>
                  <span>${movie.budget.toLocaleString()}</span>
                </>
              ) : null}

              {movie.revenue ? (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>Revenue</span>
                  <span>${movie.revenue.toLocaleString()}</span>
                </>
              ) : null}

              <span style={{ color: 'var(--text-muted)' }}>Original Language</span>
              <span style={{ textTransform: 'uppercase' }}>{movie.original_language || 'en'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Show poster inline on larger displays */}
      <style>{`
        @media (min-width: 768px) {
          .details-poster-mobile-hide {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
export default MovieDetails;
