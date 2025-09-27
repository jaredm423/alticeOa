import { Link } from 'react-router-dom';
import { tmdbImage } from '../api.js';
import FavoriteButton from './FavoriteButton.jsx';
import './MovieCard.css';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="cardLink">
      <div className="card">
        <div className="cardTop">
          <img className="poster" src={tmdbImage(movie.poster_path)} alt={movie.title} loading="lazy" />
          <div className="favOverlay">
            <FavoriteButton movie={movie} size="sm" />
          </div>
        </div>
        <div className="title">{movie.title}</div>
      </div>
    </Link>
  );
}
