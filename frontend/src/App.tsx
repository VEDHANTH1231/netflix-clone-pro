import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AuthProvider, WatchlistProvider } from './context';

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;
