import { useContext } from 'react';
import { WatchlistContext, WatchlistContextType } from '../context/WatchlistContext';

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
export default useWatchlist;
