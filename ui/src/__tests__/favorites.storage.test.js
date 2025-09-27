import { describe, it, expect, beforeEach } from 'vitest'
import { loadFavorites, saveFavorites } from '../favorites/storage.js'

beforeEach(() => localStorage.clear())

describe('favorites storage', () => {
  it('returns [] when empty or bad JSON', () => {
    expect(loadFavorites()).toEqual([])
    localStorage.setItem('favorites.v1', '{bad')
    expect(loadFavorites()).toEqual([])
  })

  it('saves and loads minimal movie records', () => {
    const list = [{ id: 1, title: 'A', poster_path: '/x.jpg' }]
    saveFavorites(list)
    expect(loadFavorites()).toEqual(list)
  })
})
