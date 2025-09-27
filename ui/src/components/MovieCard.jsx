import { Link } from 'react-router-dom'
import { tmdbImage } from '../api.js'
import './MovieCard.css' // plain CSS

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="cardLink">
      <div className="card">
        <img className="poster" src={tmdbImage(movie.poster_path)} alt={movie.title} loading="lazy" />
        <div className="title">{movie.title}</div>
      </div>
    </Link>
  )
}
