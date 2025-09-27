const TRENDING_TTL_MS = 5 * 60 * 1000;

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'NETWORK', body = '' } = {}) {
    super(message); this.name = 'ApiError'; this.status = status; this.code = code; this.body = body;
  }
}

export async function getDetails(id) {
  return fetchJson(`/api/movie/${id}`);
}

async function fetchJson(url, { timeoutMs = 8000 } = {}) {
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(new DOMException('Timeout', 'AbortError')), timeoutMs);
  try {
    const res = await fetch(url, { signal: ac.signal });
    const ct = res.headers.get('content-type') || '';
    const text = await res.text();
    if (!res.ok) {
      let code = 'HTTP_' + res.status, msg = `HTTP ${res.status}`;
      try { const j = JSON.parse(text); code = j.code || code; msg = j.message || msg; } catch { }
      throw new ApiError(msg, { status: res.status, code, body: text });
    }
    if (!ct.includes('application/json')) {
      throw new ApiError(`Invalid content-type: ${ct}`, { code: 'BAD_JSON', body: text });
    }
    return JSON.parse(text);
  } catch (e) {
    if (e.name === 'AbortError') throw new ApiError('Request timed out', { code: 'TIMEOUT' });
    if (e instanceof ApiError) throw e;
    throw new ApiError(e.message || 'Network error', { code: 'NETWORK' });
  } finally {
    clearTimeout(to);
  }
}

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