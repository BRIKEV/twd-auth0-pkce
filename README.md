# TWD Auth0 – PKCE Flow & Testing Showcase

**Test While Developing (TWD)**: An in-browser testing approach that validates full user workflows in real time. This project demonstrates a production-grade **Auth0 PKCE** flow (Frontend-only Auth) and how to easily test it without complex E2E setups.

## 📚 Architecture

### Frontend (React + Auth0 PKCE)
The application uses **Auth0 React SDK** to authenticate users directly in the browser using the **PKCE flow**.
- **`useAuth` Hook**: A centralized hook wrapping `useAuth0` for easy mocking.
- **State Management**: React state handles data, while auth state is managed by the SDK.
- **API Client**: Attaches the Access Token to requests via `Authorization: Bearer` header.

### Backend (Stateless API)
The backend is a simple API that validates JWTs.
- **Middleware**: `express-oauth2-jwt-bearer` verifies tokens against Auth0 JWKS.
- **Database**: Drizzle ORM + LibSQL.
- **Stateless**: No sessions or cookies required.

## ✨ TWD Auth0 Mocking Showcase

This project demonstrates how to **Test While Developing (TWD)** with complex authentication flows.
Instead of struggling with slow E2E login scripts, we simply **mock the auth hook** directly in the browser using `Sinon`.

Check out **[src/twd-test/app.twd.test.ts](src/twd-test/app.twd.test.ts)** to see:

1. **Mocking the Auth Hook**:
   ```typescript
   import authSession from '../hooks/useAuth';
   // ...
   Sinon.stub(authSession, 'useAuth').returns({
     isAuthenticated: true,
     user: mockUser,
     getAccessTokenSilently: Sinon.stub().resolves('fake-token'),
     // ...
   });
   ```
2. **Simulating User States**: Easily test "Loading", "Unauthenticated", or "Authenticated" states by changing the mock return value.
3. **API Mocking**: Combined with `twd.mockRequest`, you simulate the entire backend interaction.

**Benefit**: You get instant verification of your UI's protected areas without ever hitting the real Auth0 login page during tests.

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

## 🔐 Auth Flow (PKCE)

### 1. Unauthenticated User Visits `/`

```
GET /
  ↓
PrivateRoute checks `useAuth().isAuthenticated`
  ↓
If false, Redirect to /login
```

### 2. User Clicks "Log In"

```
/login renders
  ↓
User clicks "Log In" Button
  ↓
Auth0 SDK redirects to Auth0 Universal Login
```

### 3. Auth0 Redirects Back

```
Redirect back to app with code
  ↓
Auth0 SDK exchanges code for Tokens (Access + ID Token)
  ↓
App re-renders, `isAuthenticated` becomes true
```

### 4. Fetching Data

```
App component mounts
  ↓
Calls `getAccessTokenSilently()` to get token string
  ↓
Calls API with `Authorization: Bearer <token>`
  ↓
Backend validates token signature & audience
  ↓
Data returned
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
AUTH0_AUDIENCE=https://api.myapp.com  <-- NEW: API Identifier
```

### Frontend

```bash
npm install
npm run dev
```

Set up `.env`:
```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=xxxx
VITE_AUTH0_AUDIENCE=https://api.myapp.com
```

### Run Tests

In the browser (`http://localhost:5173`):
- Open DevTools console
- TWD tests run in the sidebar. Note how the Auth0 login is completely bypassed by our mocks!

## 🧪 Backend Tests (Node.js)

```bash
cd backend-service
npm test
```

## 🎓 Learning Goals


By exploring this project, you'll understand:

1. **OAuth2 Security**: Why tokens stay server-side, how HttpOnly cookies work.
2. **React Router Data APIs**: Loaders for data-before-render, actions for mutations, error boundaries.
3. **BFF Pattern**: Why a backend layer protects your frontend from auth complexity.
4. **Testing Workflows**: How TWD tests validate full user journeys faster than traditional E2E.
5. **Type Safety**: Using TypeScript + Axios helpers to catch API bugs at compile time.

## 📝 Key Files to Read

1. **[backend-service/routes/notes.ts](backend-service/routes/notes.ts)** – User-scoped API with JWT validation (`checkJwt`).
2. **[src/hooks/useAuth.ts](src/hooks/useAuth.ts)** – The Auth wrapper hook used for easy mocking.
3. **[src/pages/App/App.tsx](src/pages/App/App.tsx)** – Authenticated view fetching data with tokens.
4. **[src/twd-test/app.twd.test.ts](src/twd-test/app.twd.test.ts)** – **THE SHOWCASE**: How to mock `useAuth` to test authenticated flows.

## 📖 Resources

- [Auth0 Docs](https://auth0.com/docs)
- [React Router v7 Loaders/Actions](https://reactrouter.com/start/data/routing)
- [Drizzle ORM](https://orm.drizzle.team)
- [TWD (Test While Developing)](https://brikev.github.io/twd/) – The custom test runner powering this project
