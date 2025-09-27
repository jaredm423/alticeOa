import { useFavorites } from '../favorites/FavoritesContext.jsx';

/**
 * Props:
 * - movie: { id, title, poster_path }
 * - size: 'sm' | 'md' (optional)
 */
export default function FavoriteButton({ movie, size = 'md' }) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const fav = isFavorite(movie.id);

    const label = fav ? 'Remove from favorites' : 'Add to favorites';
    const char = fav ? '♥' : '♡'; // simple, no icon deps
    const style = size === 'sm'
        ? { padding: '2px 6px', fontSize: 14 }
        : { padding: '6px 10px', fontSize: 16 };

    return (
        <button
            data-testid="fav"
            aria-pressed={fav}
            title={label}
            onClick={(e) => { e.preventDefault(); toggleFavorite(movie); }}
            style={{ border: '1px solid #e5e7eb', borderRadius: 999, background: fav ? '#111' : '#fff', color: fav ? '#fff' : '#111', ...style }}
        >
            {char} Favorite
        </button>
    );
}
