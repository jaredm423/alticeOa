import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTrending } from '../api.js'

describe('getTrending()', () => {
    beforeEach(() => vi.restoreAllMocks())

    it('returns parsed JSON on 200', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValueOnce(
            new Response(JSON.stringify({ results: [{ id: 1, title: 'Foo' }] }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        )
        const data = await getTrending('day', 5)
        expect(data.results[0].title).toBe('Foo')
    })

    it('throws on non-200', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValueOnce(new Response('nope', { status: 500 }))
        await expect(getTrending('day', 5)).rejects.toThrow(/API 500/i)
    })
})
