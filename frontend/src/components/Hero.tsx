import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types/movie';
import { Skeleton } from './Skeleton';
import { getImageUrl } from '../utils/image';
import './Hero.css';

interface HeroProps {
  movie?: Movie;
  isLoading?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ movie, isLoading }) => {
  if (isLoading || !movie) {
    return <Skeleton type="hero" />;
  }

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop');

  return (
    <div 
      className="hero-container"
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className="hero-overlay-left" />
      <div className="hero-overlay-bottom" />
      
      <div className="hero-contents">
        <h1 className="hero-title">{movie.title}</h1>
        
        <div className="hero-rating-meta">
          <span className="hero-rating">{movie.vote_average.toFixed(1)} Rating</span>
          <span className="hero-year">{releaseYear}</span>
          <span style={{ 
            border: '1px solid rgba(255,255,255,0.4)', 
            padding: '1px 5px', 
            fontSize: '0.75rem', 
            borderRadius: '2px' 
          }}>
            HD
          </span>
        </div>
        
        <p className="hero-overview">{movie.overview}</p>
        
        <div className="hero-buttons">
          <button className="hero-btn play" aria-label="Play Video">
            <Play size={20} fill="currentColor" />
            Play
          </button>
          <button className="hero-btn info" aria-label="More Info">
            <Info size={20} />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};
export default Hero;
