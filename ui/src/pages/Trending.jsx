import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard.jsx'
import { getTrending } from '../api.js'
import './Trending.css' // plain CSS (no default import)

const LIMIT_OPTIONS = [5, 10, 20]

export default function Trending() {
  const [movies, setMovies] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [limit, setLimit] = useState(10)
  const [window, setWindow] = useState('day')

  useEffect(() => {
    let cancel = false
      ; (async () => {
        try {
          setStatus('loading')
          const data = await getTrending(window, limit)
          if (!cancel) { setMovies(data.results || []); setStatus('success') }
        } catch (e) {
          if (!cancel) { setError(e.message || 'Failed'); setStatus('error') }
        }
      })()
    return () => { cancel = true }
  }, [window, limit])

  if (status === 'loading') return <p className="pad">Loading…</p>
  if (status === 'error') return <p className="pad error">{error}</p>

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

      <div className="grid">
        {movies.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>
    </div>
  )
}
