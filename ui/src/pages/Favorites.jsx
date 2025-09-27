import React, { useMemo, useState } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { useFavorites } from '../favorites/FavoritesContext.jsx';
import './Trending.module.css';
export default function Favorites() {
    const { favorites = [], toggleFavorite, clearFavorites } = useFavorites();
    const [q, setQ] = useState('');

    const list = useMemo(() => {
        if (!q.trim()) return favorites;
        const needle = q.toLowerCase();
        return favorites.filter(m =>
            (m.title || '').toLowerCase().includes(needle)
            || (m.original_title || '').toLowerCase().includes(needle)
        );
    }, [favorites, q]);

    const count = favorites.length;

    return (
        <div className="container">
            <header className="row" style={{ gap: 12, alignItems: 'center' }}>
                <h2 className="title">Favorites</h2>

                <input
                    type="search"
                    placeholder="Search favorites…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    aria-label="Search favorites"
                    style={{
                        background: 'var(--bg-elev)',
                        color: 'var(--text)',
                        border: '1px solid rgba(255,255,255,.08)',
                        borderRadius: '8px',
                        padding: '.4rem .6rem',
                        minWidth: 220
                    }}
                />

                <span className="muted" style={{ marginLeft: 'auto' }}>
                    {count} {count === 1 ? 'movie' : 'movies'}
                </span>

                {count > 0 && (
                    <button
                        onClick={() => {
                            if (confirm('Remove all favorites?')) clearFavorites();
                        }}
                        style={{
                            border: '1px solid rgba(255,255,255,.12)',
                            background: 'transparent',
                            color: 'var(--muted)',
                            borderRadius: 8,
                            padding: '.4rem .6rem',
                            cursor: 'pointer'
                        }}
                        aria-label="Clear all favorites"
                        title="Clear all"
                    >
                        Clear all
                    </button>
                )}
            </header>

            {count === 0 && (
                <div className="pad muted">
                    No favorites yet. <a href="/" style={{ textDecoration: 'underline' }}>Browse trending</a>.
                </div>
            )}

            {count > 0 && list.length === 0 && (
                <div className="pad muted">No results for “{q}”.</div>
            )}

            <div className="grid">
                {list.map(m => (
                    <MovieCard key={m.id} movie={m} />
                ))}
            </div>
        </div>
    );
}
