// ui/src/__tests__/FavoritesContext.test.jsx
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'
import { FavoritesProvider, useFavorites } from '../favorites/FavoritesContext.jsx'
import { render, click } from './render'

beforeEach(() => localStorage.clear())

function Probe({ movie }) {
  const { isFavorite, toggleFavorite, favorites } = useFavorites()
  return (
    <div>
      <div id="status">{isFavorite(movie.id) ? 'fav' : 'not'}</div>
      <div id="count">{favorites.length}</div>
      <button id="toggle" onClick={() => toggleFavorite(movie)}>toggle</button>
    </div>
  )
}

describe('FavoritesContext', () => {
  it('toggles and persists to localStorage', async () => {
    const movie = { id: 7, title: 'Se7en', poster_path: '/p.jpg' }
    const { container, unmount } = await render(
      <FavoritesProvider><Probe movie={movie} /></FavoritesProvider>
    )

    const status = () => container.querySelector('#status').textContent
    const count = () => Number(container.querySelector('#count').textContent)
    const btn = container.querySelector('#toggle')

    expect(status()).toBe('not'); expect(count()).toBe(0)

    await click(btn) // ✅
    expect(status()).toBe('fav'); expect(count()).toBe(1)
    expect(localStorage.getItem('favorites.v1')).toContain('"id":7')

    await click(btn)
    expect(status()).toBe('not'); expect(count()).toBe(0)

    await unmount()
  })
})

