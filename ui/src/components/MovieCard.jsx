import React from 'react';
import styles from './MovieCard.module.css';
import { tmdbImage } from '../api.js';
import FavoriteButton from './FavoriteButton.jsx';

export default function MovieCard({ movie }) {
  const img = tmdbImage(movie.poster_path);
  return (
    <article className={styles.card}>
      <a href={`/movie/${movie.id}`} className={styles.media} aria-label={`View details for ${movie.title}`}>
        {img
          ? <img src={img} alt={movie.title} loading="lazy" decoding="async" />
          : <div className={`skeleton ${styles.fallback}`} aria-hidden="true" />}
      </a>

      <div className={styles.meta}>
        <h3 className={styles.title}>
          <a href={`/movie/${movie.id}`}>{movie.title}</a>
        </h3>
        <div className={styles.sub}>
          {movie.release_date ? new Date(movie.release_date).getFullYear() : '—'}
          {typeof movie.vote_average === 'number' && (
            <span className={styles.badge} title="Average rating">
              ★ {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <FavoriteButton movie={movie} />
      </div>
    </article>
  );
}
