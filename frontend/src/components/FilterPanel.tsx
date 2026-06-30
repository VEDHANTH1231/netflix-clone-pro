import React from 'react';
import { SearchFilters } from '../hooks/useSearch';

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (newFilters: Partial<SearchFilters>) => void;
}

const AVAILABLE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
];

const AVAILABLE_YEARS = ['2026', '2025', '2024', '2023'];

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange }) => {
  const handleGenreToggle = (genreId: number) => {
    const isSelected = filters.genres.includes(genreId);
    const updatedGenres = isSelected
      ? filters.genres.filter((id) => id !== genreId)
      : [...filters.genres, genreId];
    onChange({ genres: updatedGenres });
  };

  return (
    <div style={{
      backgroundColor: '#181818',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      height: 'fit-content',
    }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        Filters
      </h3>

      {/* Genre Filter */}
      <div>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Genres
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {AVAILABLE_GENRES.map((genre) => {
            const isSelected = filters.genres.includes(genre.id);
            return (
              <button
                key={genre.id}
                onClick={() => handleGenreToggle(genre.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: isSelected ? 'var(--netflix-red)' : '#2f2f2f',
                  color: 'var(--text-white)',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Year Filter */}
      <div>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Release Year
        </h4>
        <select
          value={filters.year}
          onChange={(e) => onChange({ year: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2f2f2f',
            border: '1px solid #444',
            borderRadius: '4px',
            color: 'var(--text-white)',
            outline: 'none',
          }}
        >
          <option value="">All Years</option>
          {AVAILABLE_YEARS.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Min Rating
          </h4>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#46d369' }}>
            {filters.minRating > 0 ? `${filters.minRating.toFixed(1)}+` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="9"
          step="0.5"
          value={filters.minRating}
          onChange={(e) => onChange({ minRating: parseFloat(e.target.value) })}
          style={{
            width: '100%',
            accentColor: 'var(--netflix-red)',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Clear Filters Button */}
      {(filters.genres.length > 0 || filters.year || filters.minRating > 0) && (
        <button
          onClick={() => onChange({ genres: [], year: '', minRating: 0 })}
          style={{
            color: 'var(--netflix-red)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textDecoration: 'underline',
            alignSelf: 'flex-start',
            cursor: 'pointer',
          }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
export default FilterPanel;
