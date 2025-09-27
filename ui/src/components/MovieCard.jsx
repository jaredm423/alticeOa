import React from 'react';
import styles from './MovieCard.module.css';
import { tmdbImage } from '../api.js';
import FavoriteButton from './FavoriteButton.jsx';

function resolveTitle(movie) {
  if (!movie) return '—';
  const t =
    movie.title ??
    movie.name ??
    movie.original_title ??
    movie.original_name;
  if (t && String(t).trim()) return t;
  for (const v of Object.values(movie)) {
    if (typeof v === 'string' && v.trim().length) return v.trim();
  }
  return '—';
}

export default function MovieCard({ movie }) {
  const title = resolveTitle(movie);

  const posterPath = movie?.poster_path || '';
  const img = /^https?:\/\//i.test(posterPath) ? posterPath : tmdbImage(posterPath);

  const href = `/movie/${movie?.id}`;

  return (
    <article className={styles.card}>
      <a href={href} className={styles.media} aria-label={`View details for ${title}`}>
        {img
          ? <img src={img} alt={title} loading="lazy" decoding="async" />
          : <div className={`skeleton ${styles.fallback}`} aria-hidden="true" />}
      </a>

      <div className={styles.meta}>
        <h3 className={`${styles.title} title`}>
          <a href={href} data-testid="title">{title}</a>
        </h3>
        <div className={styles.sub}>
          {movie?.release_date ? new Date(movie.release_date).getFullYear() : '—'}
          {typeof movie?.vote_average === 'number' && (
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
