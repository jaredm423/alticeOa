import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'
import FavoriteButton from '../components/FavoriteButton.jsx'
import { renderWithProviders, click } from './render'

beforeEach(() => localStorage.clear())

describe('<FavoriteButton />', () => {
  it('toggles aria-pressed and persists', async () => {
    const movie = { id: 42, title: 'The Answer' }
    const { container, unmount } = await renderWithProviders(<FavoriteButton movie={movie} />)

    const btn = container.querySelector('button[data-testid="fav"]')
    expect(btn.getAttribute('aria-pressed')).toBe('false')

    await click(btn) // ✅ wrapped & awaited
    expect(btn.getAttribute('aria-pressed')).toBe('true')
    expect(localStorage.getItem('favorites.v1')).toContain('"id":42')

    await click(btn)
    expect(btn.getAttribute('aria-pressed')).toBe('false')

    await unmount()
  })
})

