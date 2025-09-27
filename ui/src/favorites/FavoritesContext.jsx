import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { loadFavorites, saveFavorites } from './storage';

/** Minimal record we persist */
const pick = (m) => ({ id: m.id, title: m.title ?? m.name ?? '', poster_path: m.poster_path ?? '' });

const FavoritesCtx = createContext(null);

export function FavoritesProvider({ children }) {
    // hydrate from localStorage once
    const initial = loadFavorites();
    const [byId, setById] = useState(() => {
        const map = new Map();
        initial.forEach(m => map.set(m.id, m));
        return map;
    });

    const favorites = useMemo(() => Array.from(byId.values()), [byId]);

    const isFavorite = useCallback((id) => byId.has(Number(id)), [byId]);

    const toggleFavorite = useCallback((movie) => {
        const id = Number(movie.id);
        setById(prev => {
            const next = new Map(prev);
            if (next.has(id)) next.delete(id);
            else next.set(id, pick(movie));
            // persist
            saveFavorites(Array.from(next.values()));
            return next;
        });
    }, []);

    const value = useMemo(() => ({ favorites, isFavorite, toggleFavorite }), [favorites, isFavorite, toggleFavorite]);

    return <FavoritesCtx.Provider value={value}>{children}</FavoritesCtx.Provider>;
}

export function useFavorites() {
    const ctx = useContext(FavoritesCtx);
    if (!ctx) throw new Error('useFavorites must be used within <FavoritesProvider>');
    return ctx;
}
