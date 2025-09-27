import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ColorMode = 'light' | 'dark'

interface ThemeState {
  mode: ColorMode
  toggle: () => void
  setMode: (mode: ColorMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      toggle: () => set({ mode: get().mode === 'light' ? 'dark' : 'light' }),
      setMode: (mode) => set({ mode })
    }),
    {
      name: 'theme',
      version: 1
    }
  )
)
