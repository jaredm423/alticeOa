export async function getTrending(window = 'day', limit = 10) {
  const res = await fetch(`/api/trending?window=${window}&limit=${limit}`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export const tmdbImage = (path, size = 'w342') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

export async function getMovieDetails(id) {
  const res = await fetch(`/api/movie/${id}`)
  const ct = res.headers.get('content-type') || ''
  const txt = await res.text()
  if (!res.ok) 
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 180)}`)
  if (!ct.includes('application/json')) 
    throw new Error(`Expected JSON, got ${ct}: ${txt.slice(0, 180)}`)

  return JSON.parse(txt)
}