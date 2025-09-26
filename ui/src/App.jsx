import { useEffect, useState } from 'react'
import { getTrending, tmdbImage } from './api'

export default function App() {
  const [movies, setMovies] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        setStatus('loading')
        const data = await getTrending('day', 10)
        setMovies(data.results || [])
        setStatus('success')
      } catch (e) {
        setError(e.message || 'Failed to fetch')
        setStatus('error')
      }
    })()
  }, [])

  if (status === 'loading') return <p style={{padding:16}}>Loading…</p>
  if (status === 'error')   return <p style={{padding:16, color:'crimson'}}>{error}</p>

  return (
    <div style={{maxWidth: 900, margin: '24px auto', padding: '0 12px'}}>
      <h2 style={{marginBottom:12}}>Trending Today</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:12}}>
        {movies.map(m => (
          <div key={m.id} style={{border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden', background:'#fff'}}>
            <img src={tmdbImage(m.poster_path)} alt={m.title} style={{width:'100%', display:'block'}} loading="lazy" />
            <div style={{padding:8, fontWeight:600}}>{m.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
