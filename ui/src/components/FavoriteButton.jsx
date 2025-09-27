import React from 'react';
import styles from './FavoriteButton.module.css';
import { useFavorites } from '../favorites/FavoritesContext.jsx';

export default function FavoriteButton({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(movie.id);

  return (
    <button
      type="button"
      className={`${styles.favBtn} ${fav ? styles.active : ''}`}
      aria-pressed={fav ? 'true' : 'false'}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      onClick={(e) => { e.preventDefault(); toggleFavorite(movie); }}
      title={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className={styles.heart} aria-hidden="true">❤</span>
    </button>
  );
}
