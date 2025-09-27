const KEY = 'favorites.v1';

/** Load minimal movie records from localStorage. Shape: [{id, title, poster_path}] */
export function loadFavorites() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.filter(x => x && typeof x.id === 'number') : [];
    } catch {
        return [];
    }
}

/** Save minimal movie records (array). */
export function saveFavorites(list) {
    try {
        localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
        /* ignore quota/availability errors */
    }
}
