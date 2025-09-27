import { Routes, Route, Link } from 'react-router-dom'
import Trending from './pages/Trending.jsx'
import MovieDetails from './pages/MovieDetails.jsx'

export default function App() {
  return (
    <>
      <nav style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 700 }}>🎬 Movie App</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Trending />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </>
  )
}
