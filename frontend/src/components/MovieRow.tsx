import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { Skeleton } from './Skeleton';
import './MovieRow.css';

interface MovieRowProps {
  title: string;
  movies?: Movie[];
  isLoading?: boolean;
}

export const MovieRow: React.FC<MovieRowProps> = ({ title, movies = [], isLoading }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Drag scroll state
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = slider.clientWidth * 0.75;
    if (direction === 'left') {
      slider.scrollLeft -= scrollAmount;
    } else {
      slider.scrollLeft += scrollAmount;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = sliderRef.current;
    if (!slider || isLoading) return;
    setIsDown(true);
    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeftState(slider.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const slider = sliderRef.current;
    if (!slider || !isDown || isLoading) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed modifier
    slider.scrollLeft = scrollLeftState - walk;
  };

  // Render Skeletons if loading or empty list
  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="movie-card">
          <Skeleton type="card" />
        </div>
      ));
    }

    if (!movies || movies.length === 0) {
      return (
        <div style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No content available in this section.
        </div>
      );
    }

    return movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} />
    ));
  };

  return (
    <div className="movie-row-container">
      <h2 className="movie-row-title">{title}</h2>
      <div className="movie-row-slider-wrapper">
        {!isLoading && movies.length > 0 && (
          <button 
            className="slider-arrow left" 
            onClick={() => handleScroll('left')}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={30} />
          </button>
        )}
        
        <div 
          className="movie-row-slider"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ cursor: isDown ? 'grabbing' : 'pointer' }}
        >
          {renderContent()}
        </div>

        {!isLoading && movies.length > 0 && (
          <button 
            className="slider-arrow right" 
            onClick={() => handleScroll('right')}
            aria-label="Scroll Right"
          >
            <ChevronRight size={30} />
          </button>
        )}
      </div>
    </div>
  );
};
export default MovieRow;
