# Sons of Olympus RPG

Vite + React + TypeScript project configured for a smooth dev experience with strict TypeScript, ESLint 9, and a ready-to-use Vitest + React Testing Library setup.

## Stack
- Vite 7, React 19, TypeScript 5.8, ESLint 9
- Module: ESNext with bundler moduleResolution (strict TS enabled)
- Vite uses @vitejs/plugin-react; Vitest configured with jsdom, globals, and v8 coverage

## Getting Started
1) Install dependencies
```
npm install
```

2) Start the dev server (HMR on http://localhost:5173)
```
npm run dev
```

3) Type-check and production build
```
npm run build
```

4) Preview the built app
```
npm run preview
```

5) Lint
```
npm run lint
```

## Testing
This repo uses Vitest + React Testing Library (RTL) with jsdom.

- Run tests
```
npm test
```

- Watch mode
```
npm run test:watch
```

- Coverage (HTML report in coverage/)
```
npm run coverage
```

Example test (place next to code, e.g., src/App.test.tsx):
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('increments the counter when button is clicked', async () => {
    render(<App />)
    const btn = screen.getByRole('button', { name: /count is 0/i }) as HTMLButtonElement
    await userEvent.click(btn)
    expect(btn.textContent).toContain('count is 1')
  })
})
```
Notes:
- The assertion uses native expect on textContent, so jest-dom is optional.
- If you prefer richer DOM matchers, add @testing-library/jest-dom and import it in tests or via a Vitest setup file referenced in vite.config.ts (test.setupFiles).

## TypeScript & Vite Configuration
- tsconfig.app.json is strict, noEmit, react-jsx; moduleResolution: bundler. Avoid Node resolution assumptions; rely on ESM/export maps.
- Vite configuration lives in vite.config.ts and uses @vitejs/plugin-react.
- Vitest is configured in vite.config.ts: test.environment = 'jsdom', test.globals = true, coverage provider v8.

## React 19 Notes
- The app uses React 19. Stick to function components and hooks; deprecated lifecycle APIs aren’t supported.
- SSR streaming is not used here.

## Linting
- ESLint 9 configured via eslint.config.js. Run `npm run lint`.
- TS strict is enabled; address unused locals/parameters; prefer explicit types for public APIs.

## Assets & Paths
- Vite serves assets from public/ at the root URL. Importing from /foo.png references public/foo.png.
- Keep imports ESM-compatible; avoid default-unsafe CJS modules.

## Internationalization & Theming
- Basic i18n is set up under src/i18n with locale files (e.g., pt-BR.json, es.json) and a LanguageSelect component.
- Material UI theme is provided via AppThemeProvider in src/theme.tsx with dark/light mode support.

## Common Pitfalls
- If you add a Vitest setup file (test.setupFiles), ensure the file exists and is committed; missing files will cause Vitest to error.
- Mixing Node resolution assumptions with bundler moduleResolution will break imports.

## Scripts
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`
- Test: `npm test`, `npm run test:watch`, `npm run coverage`

## Contributing
- Place tests close to the files they cover (e.g., src/Foo.test.tsx).
- Prefer RTL queries by role/label/text over test IDs; test behaviors and interactions.
- Keep changes ESM-friendly and TypeScript strict compliant.
