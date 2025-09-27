import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { act } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { FavoritesProvider } from '../favorites/FavoritesContext.jsx'

export async function render(ui) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = ReactDOM.createRoot(container)
  await act(async () => { root.render(<StrictMode>{ui}</StrictMode>) })
  return {
    container,
    unmount: async () => { await act(async () => root.unmount()) }
  }
}

export async function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <FavoritesProvider>{ui}</FavoritesProvider>
    </MemoryRouter>
  )
}

// fire DOM events inside act and await state flush
export async function click(el) {
  await act(async () => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await Promise.resolve()
  })
}

export async function change(el, value) {
  await act(async () => {
    el.value = value
    el.dispatchEvent(new Event('change', { bubbles: true }))
    await Promise.resolve()
  })
}

export async function tick() {
  await act(async () => { await Promise.resolve() })
}
