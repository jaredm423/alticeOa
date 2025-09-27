// ui/src/__tests__/MovieCard.test.jsx
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import MovieCard from '../components/MovieCard.jsx'
import { renderWithProviders } from './render'

// stub tmdbImage
vi.mock('../api.js', () => ({ tmdbImage: (p) => `https://img${p}` }))

describe('<MovieCard />', () => {
    it('links to /movie/:id and shows title/poster', async () => {
        const movie = { id: 123, title: 'Inception', poster_path: '/x.jpg' }
        const { container, unmount } = await renderWithProviders(<MovieCard movie={movie} />)

        const link = container.querySelector('a')
        const img = container.querySelector('img')
        const titleEl = container.querySelector('.title') || container.querySelector('div:last-child')

        expect(link.getAttribute('href')).toBe('/movie/123')
        expect(img.getAttribute('src')).toBe('https://img/x.jpg')
        expect(titleEl.textContent).toMatch(/Inception/)

        await unmount()
    })
})
