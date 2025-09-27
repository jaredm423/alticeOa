import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMovieDetails } from '../api'
import { tmdbImage } from '../api'

export default function MovieDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancel = false
      ; (async () => {
        try {
          setStatus('loading')
          const d = await getMovieDetails(id)
          if (!cancel) { setData(d); setStatus('success') }
        } catch (e) {
          if (!cancel) { setError(e.message || 'Failed'); setStatus('error') }
        }
      })()
    return () => { cancel = true }
  }, [id])

  if (status === 'loading') return <p style={{ padding: 16 }}>Loading…</p>
  if (status === 'error') return <div style={{ padding: 16, color: 'crimson' }}>{error}</div>

  const title = data.title || data.name
  const genres = (data.genres || []).map(g => g.name).join(', ')
  const score = data.vote_average ? data.vote_average.toFixed(1) : 'N/A'

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', padding: '0 12px' }}>
      <button onClick={() => nav(-1)} style={{ marginBottom: 12, padding: '6px 10px' }}>← Back</button>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
        <img src={tmdbImage(data.poster_path, 'w342')} alt={title} style={{ width: '100%', borderRadius: 12 }} />
        <div>
          <h1 style={{ margin: '0 0 8px' }}>{title}</h1>
          <div style={{ opacity: .75, marginBottom: 8 }}>
            {data.release_date} • {data.runtime ? `${data.runtime} min • ` : ''}⭐ {score}
          </div>
          <div style={{ opacity: .75, marginBottom: 8 }}>{genres}</div>
          <p style={{ lineHeight: 1.45 }}>{data.overview || 'No overview provided.'}</p>

          {data.videos?.results?.length ? (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ margin: '12px 0 8px' }}>Videos</h3>
              <ul style={{ paddingLeft: 16 }}>
                {data.videos.results.slice(0, 3).map(v => (
                  <li key={v.id}>
                    <a href={`https://www.youtube.com/watch?v=${v.key}`} target="_blank" rel="noreferrer">
                      {v.name} ({v.type})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
