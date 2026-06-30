import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { authService } from '../services/authService';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUserWatchlist: (watchlist: string[]) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync token validation on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('netflix_access_token');
      const storedUser = localStorage.getItem('netflix_user');

      if (accessToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Refresh user data from API silently
          const response = await authService.getCurrentUser();
          setUser(response.data);
          localStorage.setItem('netflix_user', JSON.stringify(response.data));
        } catch (err) {
          // Token is expired/invalid and refresh failed in Axios interceptor
          console.error('Session restoration failed:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Listen to silent logout trigger from Axios interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setError('Session expired. Please log in again.');
    };

    window.addEventListener('auth_session_expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth_session_expired', handleSessionExpired);
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      const { user: loggedInUser, tokens } = response.data;

      localStorage.setItem('netflix_access_token', tokens.accessToken);
      localStorage.setItem('netflix_refresh_token', tokens.refreshToken);
      localStorage.setItem('netflix_user', JSON.stringify(loggedInUser));

      setUser(loggedInUser);
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || err.message || 'Login failed';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(credentials);
      const { user: registeredUser, tokens } = response.data;

      localStorage.setItem('netflix_access_token', tokens.accessToken);
      localStorage.setItem('netflix_refresh_token', tokens.refreshToken);
      localStorage.setItem('netflix_user', JSON.stringify(registeredUser));

      setUser(registeredUser);
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message || err.message || 'Registration failed';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('netflix_access_token');
    localStorage.removeItem('netflix_refresh_token');
    localStorage.removeItem('netflix_user');
    setUser(null);
    setError(null);
  }, []);

  const clearError = () => {
    setError(null);
  };

  const updateUserWatchlist = (watchlist: string[]) => {
    if (user) {
      const updatedUser = { ...user, watchlist };
      setUser(updatedUser);
      localStorage.setItem('netflix_user', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        updateUserWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
