import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // @ts-expect-error: Vitest adds `test` to Vite config; TS from Vite doesn't know it
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8'
    }
  }
})
