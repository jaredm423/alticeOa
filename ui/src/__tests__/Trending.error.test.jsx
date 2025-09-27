import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import Trending from '../pages/Trending.jsx';
import { renderWithProviders, tick } from './render';

const getTrendingMock = vi.fn();
vi.mock('../api.js', () => ({
  getTrending: (...args) => getTrendingMock(...args),
  tmdbImage: (p) => `https://img${p}`
}));

describe('<Trending /> error states', () => {
  it('shows error banner when API fails and no cache', async () => {
    const err = Object.assign(new Error('boom'), { code: 'NETWORK' });
    getTrendingMock.mockRejectedValueOnce(err);

    const res = await renderWithProviders(<Trending />);
    const root = res.container ?? document.body;
    await tick();

    expect(root.textContent).toMatch(/Unable to load movies/i);
    expect(root.textContent).toMatch(/NETWORK/);

    await res.unmount();
  });

  it('shows cached results banner when API fails but cache is present', async () => {
    // first call ok -> populates UI state (our component keeps it in state)
    getTrendingMock
      .mockResolvedValueOnce({ results: [{ id: 1, title: 'Dune', poster_path: '/a.jpg' }] })
      .mockRejectedValueOnce(Object.assign(new Error('later fail'), { code: 'TIMEOUT', cached: { results: [{ id: 1, title: 'Dune', poster_path: '/a.jpg' }] } }));

    const res = await renderWithProviders(<Trending />);
    const root = res.container ?? document.body;
    await tick();

    // force effect again by simulating a change (component will call getTrending again and fail)
    // simplest: re-render with same props triggers nothing; instead, rely on the mock second call from user actions in other tests.
    // here we just assert the first render is fine:
    expect(root.textContent).toMatch(/Dune/);

    // Manually invoke the failure path by calling the effect again:
    // We'll fake it by toggling the window through the buttons (day/week)
    const weekBtn = Array.from(root.querySelectorAll('button')).find(b => /week/i.test(b.textContent));
    weekBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await tick();

    expect(root.textContent).toMatch(/showing cached/i);

    await res.unmount();
  });
});
