import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Trending from './pages/Trending.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Favorites from './pages/Favorites.jsx';
import { FavoritesProvider } from './favorites/FavoritesContext.jsx';

export default function App() {
  return (
    <FavoritesProvider>
      <header className="container row" style={{ gap: 12 }}>
        <h1 className="title" style={{ fontSize: '1.25rem' }}>
          Movie List
        </h1>
        <nav className="tabs">
          <Link className="tab" to="/">Trending</Link>
          <Link className="tab" to="/favorites">Favorites</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Trending />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </FavoritesProvider>
  );
}
