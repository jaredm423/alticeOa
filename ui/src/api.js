export async function getTrending(window = 'day', limit = 10) {
  const res = await fetch(`/api/trending?window=${window}&limit=${limit}`);
  if (!res.ok) {
    const text = await res.text().catch(()=> '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export const tmdbImage = (path, size = 'w342') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '';
