import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import Trending from '../pages/Trending.jsx'
import { renderWithProviders, change, click, tick } from './render'

const getTrendingMock = vi.fn()
vi.mock('../api.js', () => ({
    getTrending: (...args) => getTrendingMock(...args),
    tmdbImage: (p) => `https://img${p}`
}))

// tiny waitUntil helper so we don't rely on exact timing
async function waitUntil(check, { tries = 10 } = {}) {
    for (let i = 0; i < tries; i++) {
        if (check()) return true
        await tick()
    }
    return false
}

describe('<Trending />', () => {
    it('loads movies and renders cards', async () => {
        getTrendingMock.mockResolvedValue({
            results: [
                { id: 1, title: 'Dune', poster_path: '/a.jpg' },
                { id: 2, title: 'Blade Runner', poster_path: '/b.jpg' }
            ]
        })

        const res = await renderWithProviders(<Trending />)
        const root = res.container ?? document.body

        // wait until images (or cards) show up
        const ok = await waitUntil(() => {
            const cards = root.querySelectorAll('.card, a .card')
            const imgs = cards.length ? cards : root.querySelectorAll('img')
            return imgs.length >= 2 && /Dune/.test(root.textContent) && /Blade Runner/.test(root.textContent)
        })
        expect(ok).toBe(true)

        await res.unmount()
    })

    it('refetches when limit changes and when switching to week', async () => {
        getTrendingMock
            .mockResolvedValueOnce({ results: [] }) // initial
            .mockResolvedValueOnce({ results: [] }) // after limit
            .mockResolvedValueOnce({ results: [] }) // after week

        const res = await renderWithProviders(<Trending />)
        const root = res.container ?? document.body

        await tick()
        expect(getTrendingMock).toHaveBeenCalledWith('day', 10)

        const select = root.querySelector('select')
        await change(select, '5')
        expect(getTrendingMock).toHaveBeenCalledWith('day', 5)

        const weekBtn = Array.from(root.querySelectorAll('button')).find(b => /week/i.test(b.textContent))
        await click(weekBtn)
        expect(getTrendingMock).toHaveBeenCalledWith('week', 5)

        await res.unmount()
    })
})
