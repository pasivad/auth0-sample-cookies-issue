## Overview

Small Next.js (App Router) repo reproducing an Auth0 cookie/session issue.

Main pieces:

- `src/lib/auth0.ts`: Auth0 client configuration with helpers (getSession, getAccessToken).
- `src/middleware.ts`: Protects routes, redirects unauthenticated users to `/api/auth/login`.
- `src/app/api/token/rotate/route.ts`: Triggers `getAccessToken()` to rotate/refresh tokens.
- `src/app/page.tsx`: Simple UI with logout and buttons to hit APIs.

## Purpose of this repo

Reproduce and isolate problems where the Auth0 NextJS SDK on accessToken rotation (with configured multi-domain suport via AUTH0_COOKIE_DOMAIN) instead of updating existing session cookies creates a new one session.

## Prerequisites

- Node.js 18+
- pnpm
- Auth0 application (Client ID/Secret, domain)

## Environment

Create `.env` with:

```
AUTH0_DOMAIN=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
AUTH0_SECRET=...
AUTH0_AUDIENCE=... # API audience (in auth0 dashboard under Applications -> APIs )
AUTH0_COOKIE_DOMAIN=.dev.domain.com
```

Update your Auth0 application settings:

- Allowed Callback URLs: `http://local.dev.domain.com:4000/auth/callback`, `http://local.dev.domain.com:4000`
- Allowed Logout URLs: `http://local.dev.domain.com:4000/auth/login`, `http://local.dev.domain.com:4000`
- Allowed Web Origins: `http://local.dev.domain.com:4000`

Install dependencies

```
pnpm install
```

## Run locally on local.dev.domain.com

Add local.dev.domain.com to your /etc/hosts

So the domain points to your local machine:

```
sudo nano /etc/hosts
```

Add this line if it’s not already there:

```
127.0.0.1 local.dev.domain.com
```

👉 Note: Next.js CLI actually uses `--hostname` under the hood. To run the website on custom local domain, use:

```
npx next dev --hostname local.dev.domain.com --port 4000
```

Then open `https://local.dev.domain.com`.
