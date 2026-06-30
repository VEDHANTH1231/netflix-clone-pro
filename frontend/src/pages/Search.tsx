import React, { useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';
import { useMovies } from '../hooks/useMovies';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { MovieGrid } from '../components/MovieGrid';

export const Search: React.FC = () => {
  const {
    query,
    filters,
    isLoading: isSearchLoading,
    error,
    results,
    updateQuery,
    updateFilters,
    clearSearch,
  } = useSearch();

  // Load trending movies as default recommendations when query is empty
  const { trendingMovies, getTrending, isLoading: isTrendingLoading } = useMovies();

  useEffect(() => {
    if (!query) {
      getTrending();
    }
  }, [query, getTrending]);

  const handleFilterChange = (updatedFilters: any) => {
    updateFilters(updatedFilters);
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-black)',
      minHeight: '100vh',
      padding: '100px 4% 40px 4%',
      color: 'var(--text-white)',
    }}>
      {/* Top Search Bar */}
      <SearchBar 
        value={query} 
        onChange={updateQuery} 
        onClear={clearSearch} 
      />

      {error && (
        <div style={{
          padding: '12px 20px',
          backgroundColor: 'rgba(229, 9, 20, 0.2)',
          border: '1px solid var(--netflix-red)',
          borderRadius: '4px',
          marginBottom: '20px',
          fontSize: '0.9rem',
        }}>
          {error}
        </div>
      )}

      {/* Main Discover Layout */}
      <div 
        style={{
          display: 'flex',
          gap: '30px',
          marginTop: '20px',
        }}
        className="search-layout"
      >
        {/* Sidebar Filter Panel */}
        {query && (
          <div style={{ flex: '0 0 280px' }} className="filter-sidebar">
            <FilterPanel 
              filters={filters} 
              onChange={handleFilterChange} 
            />
          </div>
        )}

        {/* Dynamic Results Grid */}
        <div style={{ flex: 1 }}>
          {query ? (
            <>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px' }}>
                Search Results for "{query}"
              </h2>
              <MovieGrid 
                movies={results} 
                isLoading={isSearchLoading} 
              />
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px' }}>
                Popular Searches
              </h2>
              <MovieGrid 
                movies={trendingMovies} 
                isLoading={isTrendingLoading} 
              />
            </>
          )}
        </div>
      </div>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 900px) {
          .search-layout {
            flex-direction: column !important;
          }
          .filter-sidebar {
            flex: 1 1 auto !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Search;
