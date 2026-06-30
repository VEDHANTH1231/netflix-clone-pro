import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { Movie } from '../types/movie';
import { getImageUrl } from '../utils/image';
import { useWatchlist } from '../hooks/useWatchlist';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = React.memo(({ movie }) => {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const posterUrl = getImageUrl(movie.poster_path, 'poster');
  const isSaved = isInWatchlist(movie.id);

  const handleCardClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  const handleWatchlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card click navigation
    try {
      if (isSaved) {
        await removeFromWatchlist(movie.id);
      } else {
        await addToWatchlist(movie);
      }
    } catch (err) {
      console.error('Error toggling watchlist status:', err);
    }
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <img
        src={posterUrl}
        alt={movie.title}
        className="movie-card-img"
        loading="lazy"
      />
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <div className="movie-card-meta">
          <span className="movie-card-rating">{movie.vote_average.toFixed(1)} Rating</span>
          <span className="movie-card-year">{releaseYear}</span>
        </div>
        <div className="movie-card-actions">
          <button 
            className="watchlist-btn-small" 
            onClick={handleWatchlistClick}
            aria-label={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
            style={{ 
              backgroundColor: isSaved ? 'rgba(70, 211, 105, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              borderColor: isSaved ? '#46d369' : 'rgba(255, 255, 255, 0.5)'
            }}
          >
            {isSaved ? <Check size={16} style={{ color: '#46d369' }} /> : <Plus size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';
export default MovieCard;
