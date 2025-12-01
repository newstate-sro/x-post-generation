# Authentication Logic Explanation

## Overview

This implementation uses **Supabase SSR (Server-Side Rendering)** for Next.js Pages Router. The key challenge: **how to keep authentication state synchronized between client (browser) and server (Next.js)**.

## The Problem We're Solving

1. **Client-side auth**: User logs in via browser → Supabase returns session tokens
2. **Server-side auth**: Next.js needs to verify user on server (for `getServerSideProps`, API routes)
3. **Token refresh**: Access tokens expire, need automatic refresh
4. **Cookie sync**: Server and client must share the same session

## Architecture Components

### 1. Browser Client (`src/utils/supabase/client.ts`)

**What it does:**

- Creates a Supabase client that runs in the browser
- Automatically reads cookies from `document.cookie`
- Communicates directly with Supabase (login/logout happen here)

**Why it exists:**

- **Security**: Passwords never touch your API - they go directly to Supabase
- **Simplicity**: No need for custom login API routes
- **Cookie sync**: The `@supabase/ssr` browser client automatically reads cookies set by the server

**How it works:**

```tsx
// User logs in
const supabase = createClient()
await supabase.auth.signInWithPassword({ email, password })
// Supabase sets cookies automatically via @supabase/ssr
// Browser client reads these cookies on next request
```

---

### 2. Server Clients (`src/utils/supabase/server.ts`)

**What it does:**

- Creates Supabase clients for server-side code (API routes & `getServerSideProps`)
- Provides cookie callbacks to read/write cookies from HTTP requests

**Why it exists:**

- **Pages Router limitation**: Unlike App Router, Pages Router doesn't have built-in cookie helpers
- **Cookie management**: We need to manually read cookies from `req.cookies` and write to `res.setHeader('Set-Cookie')`
- **SSR requirement**: Server needs to verify auth tokens to protect routes

**Two functions:**

#### `createClient(req, res)` - For API Routes

```tsx
// In API route
const supabase = createClient(req, res)
// Reads: req.cookies
// Writes: res.setHeader('Set-Cookie', ...)
```

#### `createClientForSSR(context)` - For getServerSideProps

```tsx
// In getServerSideProps
const supabase = createClientForSSR(context)
// Reads: context.req.cookies
// Writes: context.res.setHeader('Set-Cookie', ...)
```

**Why cookie callbacks?**

- `@supabase/ssr` needs to know HOW to read/write cookies in your framework
- Pages Router doesn't have `cookies()` helper like App Router
- We provide `getAll()` and `setAll()` so `@supabase/ssr` can manage cookies

---

### 3. Middleware (`middleware.ts` + `src/utils/supabase/middleware.ts`)

**What it does:**

- Runs on **every request** (before page/API route executes)
- Refreshes expired auth tokens
- Protects routes by redirecting unauthenticated users

**Why it exists:**

- **Token expiration**: Access tokens expire (usually after 1 hour)
- **Automatic refresh**: Without middleware, users would be logged out when token expires
- **Route protection**: Can redirect before page even loads

**Flow:**

```
1. Request comes in → Middleware runs first
2. Read cookies from request
3. Call supabase.auth.getUser() → This refreshes token if expired
4. Updated token written back to cookies
5. If no user and accessing /dashboard → Redirect to /login
6. Request continues to page/API route
```

**Why refresh in middleware?**

- If we refresh in `getServerSideProps`, every page would need to do it
- Middleware runs once per request, centralizes the logic
- Ensures tokens are fresh before any server code runs

---

### 4. Auth Context (`src/contexts/AuthContext.tsx`)

**What it does:**

- React context that provides auth state to all components
- Manages user state (logged in/out)
- Provides `login()` and `logout()` functions

**Why it exists:**

- **State management**: Avoids prop drilling - any component can access auth
- **Reactive updates**: `onAuthStateChange` listener updates UI automatically
- **Convenience**: Single hook (`useAuth()`) for all auth needs

**How it works:**

```tsx
// On mount:
1. Check if user exists (supabase.auth.getUser())
2. Set up listener (onAuthStateChange)
3. When login/logout happens → listener fires → UI updates automatically
```

**Why `onAuthStateChange`?**

- Supabase fires events when auth state changes (login, logout, token refresh)
- We listen to these events to keep React state in sync
- No need to manually update state after login/logout

---

### 5. Server Utilities (`lib/supabase-server.ts`)

**What it does:**

- Helper functions for `getServerSideProps`
- `getServerUser()` - Get user or null
- `requireAuth()` - Get user or redirect to login

**Why it exists:**

- **Reusability**: Common pattern for protecting pages
- **Convenience**: Wraps the Supabase client creation and error handling
- **Type safety**: Returns proper TypeScript types

---

### 6. withAuth HOC (`src/utils/withAuth.tsx`)

**What it does:**

- Higher-order function that wraps `getServerSideProps`
- Automatically checks auth and redirects if needed
- Passes `user` to your page props

**Why it exists:**

- **DRY**: Don't repeat auth check in every page
- **Convenience**: One line to protect a page: `export const getServerSideProps = withAuth()`
- **Flexibility**: Can still add custom logic if needed

---

### 7. User API Route (`src/pages/api/auth/user.ts`)

**What it does:**

- Server endpoint to check if user is authenticated
- Returns user data or 401 error

**Why it exists:**

- **Optional**: Can be used for server-side checks if needed
- **Not required**: AuthContext uses browser client directly, doesn't need this
- **Legacy**: Kept for backwards compatibility or custom use cases

---

## Complete Authentication Flow

### Login Flow

```
1. User submits form → AuthContext.login() called
2. Browser client: supabase.auth.signInWithPassword()
3. Supabase validates credentials
4. Supabase returns session (access_token + refresh_token)
5. @supabase/ssr automatically sets cookies (via browser client)
6. onAuthStateChange fires → AuthContext updates user state
7. UI updates (user is now logged in)
```

**Why client-side login?**

- ✅ Passwords never sent to your API (more secure)
- ✅ Direct communication with Supabase
- ✅ Cookies automatically managed by `@supabase/ssr`

---

### Request Flow (After Login)

```
1. User navigates to /dashboard
2. Middleware runs:
   - Reads cookies from request
   - Calls supabase.auth.getUser()
   - If token expired → Supabase refreshes it
   - Updated token written back to cookies
   - Checks if user exists
3. If no user → Redirect to /login
4. If user exists → Request continues
5. getServerSideProps runs:
   - Uses createClientForSSR(context)
   - Reads cookies again
   - Verifies user (already fresh from middleware)
   - Returns user in props
6. Page renders with user data
```

**Why middleware + getServerSideProps both check?**

- **Middleware**: Fast route protection, runs before page loads
- **getServerSideProps**: Can fetch user-specific data, more flexible

---

### Logout Flow

```
1. User clicks logout → AuthContext.logout() called
2. Browser client: supabase.auth.signOut()
3. Supabase clears session
4. @supabase/ssr clears cookies automatically
5. onAuthStateChange fires → AuthContext sets user to null
6. UI updates (user is logged out)
```

---

## Why Cookie Callbacks Are Needed

**The Problem:**

- `@supabase/ssr` needs to read/write cookies
- Pages Router doesn't have a standard cookie API
- We must tell it HOW to read/write cookies

**The Solution:**

```tsx
cookies: {
  getAll() {
    // Tell @supabase/ssr: "Here's how to read cookies"
    return Object.entries(req.cookies).map(...)
  },
  setAll(cookiesToSet) {
    // Tell @supabase/ssr: "Here's how to write cookies"
    cookiesToSet.forEach(({ name, value, options }) => {
      res.setHeader('Set-Cookie', ...)
    })
  }
}
```

**Why this pattern?**

- `@supabase/ssr` is framework-agnostic
- It needs adapters for different frameworks (Next.js App Router, Pages Router, SvelteKit, etc.)
- We provide the adapter for Pages Router

---

## Key Design Decisions

### 1. Client-Side Login (Not API Route)

**Why:** Security - passwords never touch your server

### 2. Middleware Token Refresh

**Why:** Prevents users from being logged out when tokens expire

### 3. Cookie-Based Sessions

**Why:**

- Works with SSR (server can read cookies)
- More secure than localStorage (HttpOnly cookies)
- Automatic sync between client and server

### 4. Multiple Client Types

**Why:**

- Browser client: For React components
- Server client (API): For API routes
- Server client (SSR): For getServerSideProps
- Each needs different cookie handling

### 5. Auth Context

**Why:**

- Centralized auth state
- Reactive updates via `onAuthStateChange`
- Easy to use anywhere in the app

---

## Summary

**The core challenge:** Keeping auth state in sync between browser and server.

**The solution:**

1. Browser client handles login/logout (secure, direct to Supabase)
2. Cookies store session tokens (accessible to both client and server)
3. Middleware refreshes tokens automatically (prevents expiration issues)
4. Server clients read cookies to verify auth (for protected routes)
5. Auth Context provides React state (for UI updates)

All of this works together to provide seamless authentication that works on both client and server.
