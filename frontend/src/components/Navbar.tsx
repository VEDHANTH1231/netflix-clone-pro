import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWatchlist } from '../hooks/useWatchlist';
import './Navbar.css';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { watchlistIds } = useWatchlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle background transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  // Check if current page is login or register
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          NETFLIX
        </Link>
        {isAuthenticated && !isAuthPage && (
          <ul className="navbar-links">
            <li>
              <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/" className="navbar-link">
                TV Shows
              </Link>
            </li>
            <li>
              <Link to="/" className="navbar-link">
                Movies
              </Link>
            </li>
            <li>
              <Link to="/" className="navbar-link">
                New & Popular
              </Link>
            </li>
            <li>
              <Link to="/watchlist" className={`navbar-link ${location.pathname === '/watchlist' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                My List
                {watchlistIds.length > 0 && (
                  <span style={{
                    backgroundColor: 'var(--netflix-red)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: 'bold'
                  }}>
                    {watchlistIds.length}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        )}
      </div>

      <div className="navbar-right">
        {isAuthenticated && !isAuthPage && (
          <>
            <button 
              className="navbar-search-btn" 
              aria-label="Search"
              onClick={() => navigate('/search')}
            >
              <Search size={20} />
            </button>
            
            {/* Profile Dropdown */}
            <div className="profile-dropdown-container" ref={dropdownRef}>
              <button 
                className="profile-trigger" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <div className="profile-avatar">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <ChevronDown size={16} />
              </button>
              
              {isDropdownOpen && (
                <div className="profile-dropdown-menu">
                  <button onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }} className="dropdown-item">
                    <User size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Profile
                  </button>
                  <button onClick={handleLogoutClick} className="dropdown-item">
                    <LogOut size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        )}
        
        {!isAuthenticated && !isAuthPage && (
          <Link to="/login" style={{
            backgroundColor: 'var(--netflix-red)',
            color: '#fff',
            padding: '7px 17px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            borderRadius: '3px',
          }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
