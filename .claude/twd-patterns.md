# TWD Project Patterns

## Project Configuration

- **Framework**: React 19 + React Router 7
- **Vite base path**: /
- **Dev server port**: 5173
- **App URL**: http://localhost:5173
- **Dev command**: npm run dev
- **Default branch**: main
- **Entry point**: src/main.tsx
- **Public folder**: public/
- **Test location**: src/twd-test/
- **Closing run**: full suite

TWD is wired through the `twd()` Vite plugin in `vite.config.ts` (and `twdRemote()` for twd-relay) — there is no TWD code in `src/main.tsx`.

### Runner Commands

twd-cli drives its own headless browser — only the dev server has to be up (`npm run dev`).

```bash
# Run all tests
npm run test:ci

# Run specific tests by name (matches "suite > test", case-insensitive; repeatable)
npx twd-cli run --test "should render the list"
npx twd-cli run --test "should create" --test "should show the error"

# Only the tests this branch added or changed
npx twd-cli run --changed-since origin/main

# Record a run to video (one clip per matched test, needs ffmpeg)
npx twd-cli run --record --test "should render the list"
```

Every run writes `.twd/report/`: `run.json` (the result), `summary.md` and `index.html`. The folder is replaced on each run.

## Standard Imports

```typescript
import { twd, userEvent, screenDom, expect } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";
import { defaultMocks } from "./authUtils"; // /api/notes mocks
import Sinon from "sinon";
import authSession from "../hooks/useAuth";
import userMock from "./userMock.json";
import type { Auth0ContextInterface } from "@auth0/auth0-react";
```

## Visit Paths

```typescript
await twd.visit("/");
await twd.visit("/login");
```

## Standard beforeEach / afterEach

```typescript
beforeEach(() => {
  Sinon.resetHistory();
  Sinon.restore();
  twd.clearRequestMockRules();
});

afterEach(() => {
  twd.clearRequestMockRules();
});
```

## API Service Types

Service/API types are located in: `src/api/` (axios client in `client.ts`, `notes.ts`)

Read files in this folder to understand endpoint URLs and response shapes when writing mock data.

## CSS / Component Library

- **Library**: Tailwind CSS 4 + shadcn/ui (`src/components/ui/`)
- **Docs**: https://ui.shadcn.com/docs/components

When writing tests, refer to library docs for correct ARIA roles and component structure.

## Third-Party Modules

"Test what you own, mock what you don't." These external modules should be stubbed in tests:

| Module | Import Pattern | Stub Strategy |
|--------|---------------|---------------|
| `@auth0/auth0-react` | Wrapped in a default-export object: `src/hooks/useAuth.ts` exports `{ useAuth }` (calls `useAuth0()`); components call `Auth.useAuth()` | `Sinon.stub(authSession, 'useAuth').returns({ isAuthenticated: true, isLoading: false, user: userMock, getAccessTokenSilently: Sinon.stub().resolves('fake-token'), loginWithRedirect: Sinon.stub().resolves(), logout: Sinon.stub().resolves() } as unknown as Auth0ContextInterface)` |

Existing tests stub `useAuth` per test, register `defaultMocks()` (mocks `getNotes` → `/api/notes`) before `twd.visit('/')`, then `await twd.waitForRequests(['getNotes'])`. Never import `useAuth0` directly in a component — go through `Auth.useAuth()` so it stays stubbable. `<Auth0Provider>` in `src/main.tsx` reads `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE` (see `.env.example`); CI uses placeholders.

## Portals and Dialogs

Use `screenDomGlobal` instead of `screenDom` for elements rendered in portals (modals, dropdowns, tooltips):

```typescript
import { screenDomGlobal } from "twd-js";
const modal = screenDomGlobal.getByRole("dialog");
```
