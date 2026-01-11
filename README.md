# TWD Auth0 – A Modern Learning Project for Auth & Testing Innovation

**Test While Developing (TWD)**: An in-browser testing approach that validates full user workflows in real time. Combined with a secure BFF (Backend For Frontend) auth pattern, this project demonstrates production-grade authentication and testing practices.

## 📚 Architecture

### Backend (BFF)

```
backend-service/
├── routes/
│   ├── auth.ts          # OAuth2 login/callback/logout
│   └── notes.ts         # Protected API (requires session)
├── db/
│   ├── schema.ts        # Users + Notes tables with relations
│   └── client.ts        # Drizzle + LibSQL
├── session.ts           # HttpOnly cookie config
└── tests/
    ├── auth.test.ts     # Full OAuth flow validation
    └── notes.test.ts    # Protected API + user isolation
```

**Key insight**: The session cookie is **HttpOnly** and **SameSite=Lax**, so the frontend never sees tokens. The loader just calls `/api/me` to check if authenticated.

### Frontend (React Router v7)

```
src/
├── pages/
│   ├── App/
│   │   ├── loader.ts    # Fetches session + notes (redirects if 401)
│   │   ├── actions.ts   # Form submission (create note via useFetcher)
│   │   └── App.tsx      # Authenticated user home
│   └── Login/
│       └── loader.ts    # Redirects auth users back to /
├── api/
│   ├── client.ts        # Axios instance with credentials
│   ├── auth.ts          # getSession() helper
│   └── notes.ts         # fetchNotes(), createNote() helpers
├── components/
│   └── Notes.tsx        # useFetcher form for notes
└── twd-test/
    ├── app.twd.test.ts  # Full user journey (profile + notes)
    ├── login.twd.test.ts # Login redirect flow
    └── authUtils.ts     # Mock auth state
```

## ✨ Testing Philosophy: TWD (Test While Developing)

TWD is a radical new approach to testing web apps. Instead of running tests in Node.js with JSDOM or spinning up full E2E suites, TWD runs tests **directly in the browser alongside your app**.

1. **Real browser environment**: No JSDOM quirks, no synthetic Node.js environment. Tests run where the app actually runs.
2. **Request mocking without complexity**: `twd.mockRequest()` instead of MSW handlers.
3. **Testing Library built-in**: `screenDom.getByRole()` for semantic queries.
4. **Instant feedback**: Refresh = tests run. No test bundling, no startup overhead.

### Example TWD Test

```typescript
import { twd, userEvent, screenDom } from "twd-js";
import { describe, it, beforeEach } from "twd-js/runner";
import { mockAuthenticatedUser } from "./authUtils";

describe("Notes App", () => {
  beforeEach(() => {
    twd.clearRequestMockRules();
    mockAuthenticatedUser({ id: "1", name: "John", email: "john@test.com" });
  });

  it("should create and display a new note", async () => {
    // Mock the API response BEFORE the action
    twd.mockRequest("createNote", {
      method: "POST",
      url: "/api/notes",
      response: { id: 1, title: "Test", content: "My note", createdAt: Date.now() },
    });

    // Fill the form using Testing Library semantics
    const titleInput = screenDom.getByLabelText("Title");
    const submitBtn = screenDom.getByRole("button", { name: "Add note" });

    await userEvent.type(titleInput, "Test");
    await userEvent.click(submitBtn);

    // Wait for the mocked request
    await twd.waitForRequest("createNote");

    // Assert the note appears in the DOM
    const note = screenDom.getByText("Test");
    note.should("be.visible");
  });
});
```

**What's being tested**: React Router action → useFetcher submission → API call → loader revalidation → DOM update. All real, all in the browser.

## 🔐 Auth Flow

### 1. Unauthenticated User Visits `/`

```
GET / (no session cookie)
  ↓
loaderApp checks /api/me → 401
  ↓
Redirect to /login
```

### 2. User Clicks "Log In"

```
GET /auth/login
  ↓
Redirect to Auth0 (with client_id, redirect_uri, state)
```

### 3. Auth0 Redirects Back

```
GET /auth/callback?code=xxx&state=yyy
  ↓
BFF exchanges code for tokens (server-side only)
  ↓
BFF creates session, sets HttpOnly cookie
  ↓
Redirect to / (with session cookie)
```

### 4. Home Page Loads

```
GET / (with session cookie)
  ↓
loaderApp calls /api/me → 200 + user data
  ↓
loaderApp calls /api/notes → 200 + user's notes
  ↓
Page renders with profile + notes
```

### 5. User Creates a Note

```
POST / (useFetcher form)
  ↓
actionApp receives FormData, calls POST /api/notes
  ↓
BFF checks session, validates user_id, inserts note
  ↓
actionApp returns note, router revalidates loaderApp
  ↓
DOM updates with new note
```

## 🚀 Quick Start

### Backend

```bash
cd backend-service
npm install
npm run db:push        # Create SQLite tables
npm run dev            # Starts on :3000
```

Set up `.env`:
```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=xxxx
AUTH0_CLIENT_SECRET=xxxx
AUTH0_REDIRECT_URI=http://localhost:5173/auth/callback
```

### Frontend

```bash
npm install
npm run dev            # Starts on :5173 (proxies /auth and /api to :3000)
```

Visit `http://localhost:5173` and click "Log In" to start the OAuth flow.

### Run Tests

In the browser (`http://localhost:5173`):
- Open DevTools console
- TWD tests run in the sidebar; watch them pass in real time.

## 🧪 Backend Tests (Node.js)

```bash
cd backend-service
npm test               # Runs Vitest with real SQLite
```

**Test highlights**:
- `auth.test.ts`: Full OAuth flow (login redirect → callback → token exchange → session → logout).
- `notes.test.ts`: Protected API (verify user isolation, CRUD).

## 🎓 Learning Goals

By exploring this project, you'll understand:

1. **OAuth2 Security**: Why tokens stay server-side, how HttpOnly cookies work.
2. **React Router Data APIs**: Loaders for data-before-render, actions for mutations, error boundaries.
3. **BFF Pattern**: Why a backend layer protects your frontend from auth complexity.
4. **Testing Workflows**: How TWD tests validate full user journeys faster than traditional E2E.
5. **Type Safety**: Using TypeScript + Axios helpers to catch API bugs at compile time.

## 📝 Key Files to Read

1. **[backend-service/routes/auth.ts](backend-service/routes/auth.ts)** – Full OAuth implementation with session management.
2. **[backend-service/routes/notes.ts](backend-service/routes/notes.ts)** – User-scoped API with session checks.
3. **[src/pages/App/loader.ts](src/pages/App/loader.ts)** – Auth guard + data loader pattern.
4. **[src/pages/App/actions.ts](src/pages/App/actions.ts)** – Form submission via React Router actions.
5. **[src/twd-test/login.twd.test.ts](src/twd-test/login.twd.test.ts)** – Login workflow validation.
6. **[src/twd-test/app.twd.test.ts](src/twd-test/app.twd.test.ts)** – Notes app workflow validation.

## 📖 Resources

- [Auth0 Docs](https://auth0.com/docs)
- [React Router v7 Loaders/Actions](https://reactrouter.com/start/data/routing)
- [Drizzle ORM](https://orm.drizzle.team)
- [TWD (Test While Developing)](https://brikev.github.io/twd/) – The custom test runner powering this project
