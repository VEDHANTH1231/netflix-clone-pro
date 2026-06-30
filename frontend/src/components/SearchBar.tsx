import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onClear }) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto 30px auto',
      display: 'flex',
      alignItems: 'center',
    }}>
      <Search 
        size={20} 
        style={{
          position: 'absolute',
          left: '18px',
          color: 'var(--text-muted)',
          pointerEvents: 'none'
        }} 
      />
      <input
        type="text"
        placeholder="Titles, people, genres..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '16px 50px 16px 50px',
          backgroundColor: '#141414',
          border: '1px solid #333',
          borderRadius: '30px',
          color: 'var(--text-white)',
          fontSize: '1.1rem',
          outline: 'none',
          transition: 'border-color var(--transition-fast)',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--text-white)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#333')}
      />
      {value && (
        <button
          onClick={onClear}
          style={{
            position: 'absolute',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Clear Search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
export default SearchBar;
