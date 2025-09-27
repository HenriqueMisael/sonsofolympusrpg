Project Guidelines for Sons of Olympus RPG (Vite + React + TS)

Audience: This document targets experienced developers contributing to this repository. It focuses on project-specific details only.

1) Build and Configuration
- Stack
  - Vite 7, React 19, TypeScript 5.8, ESLint 9
  - Module: ESNext with bundler moduleResolution; strict TS enabled
- Commands
  - Install deps: npm install
  - Dev server with HMR: npm run dev (Vite on http://localhost:5173 by default)
  - Type-check + production build: npm run build
  - Preview built app: npm run preview
  - Lint: npm run lint
- TypeScript
  - tsconfig.app.json is strict, noEmit, react-jsx, and uses moduleResolution: bundler. This means Node-style resolution shims won’t apply; rely on ESM and proper export maps for dependencies.
  - Include path: src only; tests aren’t type-checked by tsc build (Vitest compiles tests itself).
- Vite config
  - vite.config.ts uses @vitejs/plugin-react.
  - test block is configured for Vitest with jsdom and globals; coverage provider v8 is enabled.
- React 19 note
  - The project uses React 19, which changes some behaviors around the compiler and SSR streaming (not used here). React 19 works fine with React Testing Library as used below.

2) Testing
This repo uses Vitest + React Testing Library (RTL) with jsdom.

- Installed Dev Dependencies (already in package.json)
  - vitest, @vitest/coverage-v8, @testing-library/react, @testing-library/user-event, jsdom
- Scripts
  - Run test suite: npm test
  - Watch mode: npm run test:watch
  - Coverage: npm run coverage (HTML report in coverage/)
- Vitest Environment
  - Configured in vite.config.ts: test.environment = 'jsdom', test.globals = true.
  - No global setup file is required for the demo; if you need jest-dom matchers, import '@testing-library/jest-dom' in a per-test file or add a setup file and reference it in vite.config.ts (setupFiles) — but remember to keep that file committed if you enable it.
- Writing Tests
  - Place tests close to the files they cover (e.g., src/Foo.test.tsx). File patterns recognized by Vitest include .test.ts, .test.tsx, etc.
  - Prefer RTL queries by role/label/text over test IDs. Keep tests behavior-driven.
  - Avoid relying on implementation details; test interactions and rendered output.
- Example Test (verified locally before documenting)
  - The following snippet was used to validate the setup. You can copy this into a new file like src/App.test.tsx to reproduce:

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

  - Notes:
    - The assertion uses native expect on textContent to avoid requiring jest-dom.
    - If you want richer DOM matchers (e.g., toBeInTheDocument, toHaveTextContent), add @testing-library/jest-dom and import it in tests or via a setup file.

- Adding New Tests
  1. Create a *.test.ts or *.test.tsx under src next to the code.
  2. Use render from @testing-library/react and @testing-library/user-event for interactions.
  3. Run tests using npm test or npm run test:watch.
  4. For coverage, run npm run coverage and open coverage/index.html.

3) Additional Development Notes
- Code Style / Linting
  - ESLint 9 configured via eslint.config.js. Run npm run lint to check. The project includes react-refresh and react-hooks plugins.
  - TS strict settings are on; address unused locals/parameters promptly. Prefer explicit types for public APIs.
- Performance / Dev UX
  - Vite HMR is enabled out of the box. Changes to src trigger instant updates without losing component state when possible.
  - Source maps are enabled via Vite in dev for easier debugging.
- Assets & Paths
  - Vite serves assets from public/ at the root URL. Importing from /foo.png references public/foo.png.
  - For TypeScript code, keep imports ESM-compatible; avoid default-unsafe CJS modules.
- Common Pitfalls
  - Testing environment: If you add a Vitest setup file (setupFiles), keep it in sync with vite.config.ts; missing files will cause Vitest to error even without tests present.
  - Mixing Node resolution assumptions with bundler moduleResolution will break. Ensure dependencies have proper export maps.
  - React 19: Some legacy patterns (e.g., deprecated lifecycles) are unsupported. Stick to function components and hooks.

4) Reproduced Example Verification
- A demo test exercising the counter button was added temporarily, executed successfully with npm test, and then removed per the task requirement to leave no extra files in the repo. The configuration documented above reflects what was used to pass that test.

Contact points for future changes
- If you introduce routing, consider @tanstack/react-router or react-router and add integration tests for navigations.
- For state management beyond local state, evaluate Zustand or Redux Toolkit; add test utilities/mocks accordingly.
