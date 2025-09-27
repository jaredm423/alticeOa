import React, { useEffect, useMemo, useState } from 'react';
import MovieCard from '../components/MovieCard.jsx'
import { getTrending, tmdbImage } from '../api.js';
import './Trending.module.css'
import ErrorBanner from '../components/ErrorBanner.jsx';

const LIMIT_OPTIONS = [5, 10, 20];
const LIMIT_KEY = 'ui.trending.limit.v1';

export default function Trending() {
  const [movies, setMovies] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [limit, setLimit] = useState(() => {
    try {
      const raw = localStorage.getItem(LIMIT_KEY);
      const n = raw ? Number(raw) : NaN;
      return LIMIT_OPTIONS.includes(n) ? n : 10;
    } catch { return 10; }
  })
  const [window, setWindow] = useState('day')

  const [stale, setStale] = useState(false)
  const [reload, setReload] = useState(0)
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false

  useEffect(() => {
    try { localStorage.setItem(LIMIT_KEY, String(limit)); } catch { }
  }, [limit])

  useEffect(() => {
    let cancel = false
      ; (async () => {
        try {
          setStatus('loading')
          setError('')
          setStale(false)
          const data = await getTrending(window, limit)
          if (!cancel) { setMovies(data.results || []); setStatus('success') }
        } catch (e) {
          if (cancel) return
          const msg = (e && (e.code || e.message)) ? `${e.code || e.message}${e.status ? ` (${e.status})` : ''}` : 'Failed'
          if (e && e.cached) {
            setMovies(e.cached.results || [])
            setStale(true)
            setStatus('success')
            setError(msg)
          } else {
            setError(msg)
            setStatus('error')
          }
        }
      })()
    return () => { cancel = true }
  }, [window, limit, reload])

  if (status === 'loading') return <p className="pad">Loading…</p>

  if (status === 'error') {
    return (
      <div className="pad">
        <ErrorBanner
          message={error || 'Failed'}
          offline={offline}
          showingCached={false}
          onRetry={() => setReload(r => r + 1)}
        />
      </div>
    )
  }

  return (
    <div className="container">
      <header className="row">
        <h2 className="title">Trending</h2>
        <div className="tabs">
          <button className={`tab ${window === 'day' ? 'active' : ''}`} onClick={() => setWindow('day')}>Today</button>
          <button className={`tab ${window === 'week' ? 'active' : ''}`} onClick={() => setWindow('week')}>This Week</button>
        </div>
        <label className="limit">
          Show:&nbsp;
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            {LIMIT_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </header>

      {stale && !!error && (
        <div className="pad" style={{ paddingTop: 0 }}>
          <ErrorBanner
            message={error}
            offline={offline}
            showingCached
            onRetry={() => setReload(r => r + 1)}
          />
        </div>
      )}

      <div className="grid">
        {movies.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>

      {!movies.length && !stale && (
        <div className="pad" style={{ opacity: 0.85 }}>No movies found.</div>
      )}
    </div>
  )
}
