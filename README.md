# FocusAI Next.js

FocusAI is a Next.js app with signup, login, JWT access tokens, refresh token rotation, Prisma, PostgreSQL, and a Tailwind frontend.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL
- Axios
- Zustand
- JWT auth with `jsonwebtoken`
- Password hashing with `bcryptjs`

## Getting Started

Go inside the project folder:

```bash
cd my-app
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
ACCESS_TOKEN_SECRET="your-long-access-token-secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="your-long-refresh-token-secret"
REFRESH_TOKEN_EXPIRES_IN="7d"
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

The production build script runs:

```bash
prisma generate && next build
```

This matters because the generated Prisma client is ignored by Git and must be regenerated after install, schema changes, or deployment.

## Auth Flow

Frontend routes:

- `/`: signup and login page.
- `/home`: protected page that verifies the `accessToken` cookie before rendering.

Auth API routes:

- `POST /api/auth/register`: validates input, hashes the password, and creates a user.
- `POST /api/auth/login`: validates email/password, creates access and refresh tokens, stores a hashed refresh token, and sets `accessToken` and `refreshToken` cookies.
- `GET /api/auth/me`: reads a bearer token or `accessToken` cookie, verifies it, and returns the current user.
- `POST /api/auth/refresh`: reads the `refreshToken` cookie, verifies and rotates it, stores the new hashed refresh token, and sets fresh cookies.
- `POST /api/auth/logout`: deletes the saved refresh token hash and clears auth cookies.

Task API routes:

- `POST /api/task`: validates task input and creates a task for the authenticated user.
- `GET /api/task`: returns all tasks for the authenticated user, newest updates first.
- `GET /api/task/[taskId]`: returns one task only if it belongs to the authenticated user.
- `PATCH /api/task/[taskId]`: validates task input and updates one task only if it belongs to the authenticated user.
- `DELETE /api/task/[taskId]`: deletes one task only if it belongs to the authenticated user.

Task route errors:

- Invalid task data returns `400`.
- Missing or invalid authentication returns `401`.
- Missing tasks return `404`.
- Unexpected server errors return `500`.

Route protection:

- `src/proxy.ts` is the Next.js request guard.
- It redirects unauthenticated users from `/home` to `/`.
- It redirects already-authenticated users from `/` to `/home`.
- JWT verification still happens in route/page code, while the proxy only checks whether an `accessToken` cookie exists.

Token behavior:

- Access tokens are short-lived.
- Refresh tokens are longer-lived.
- Refresh tokens are stored in the database as SHA-256 hashes, not plain text.
- Cookies are `httpOnly`, `sameSite: "lax"`, and `secure` in production.

## Frontend Stores

The app uses simple Zustand stores for frontend state.

Axios instance:

- File: `src/lib/axios.ts`
- Base URL: `/api`
- Sends cookies with requests using `withCredentials: true`
- Adds the saved `accessToken` from `localStorage` to the `Authorization` header

Auth store:

- File: `src/store/authStore.ts`
- Keeps `user`, `token`, `isLoading`, and `error`
- Has `login(data)` for `POST /api/auth/login`
- Saves the access token in `localStorage`
- Has `logout()` for `POST /api/auth/logout`

Task store:

- File: `src/store/taskStore.ts`
- Keeps `tasks`, `stats`, `isLoading`, and `error`
- Has `fetchTasks()`, `addTask()`, `updateTask()`, `deleteTask()`, and `completeTask()`
- Gets task data from the task API routes
- Calculates basic stats from the task list:

```ts
stats: {
  total,
  todo,
  inProgress,
  completed
}
```

## Wiring Status

Checked by reading the code and running `npm run build`:

- Signup UI is wired to `POST /api/auth/register`.
- Login UI uses `useAuthStore`, calls `POST /api/auth/login`, stores the access token, and redirects to `/home`.
- Login and refresh routes set both auth cookies.
- `/home` validates the access token and redirects to `/` when invalid.
- `src/proxy.ts` protects `/` and `/home`.
- `/api/auth/me`, `/api/auth/refresh`, and `/api/auth/logout` exist, but there is no frontend UI currently calling them.
- Task create, list, read, update, and delete API routes are wired to Zod validation and service logic.
- `useTaskStore` is ready for frontend task screens and can also calculate task stats.

## Project Structure

```text
src/app/                    Next.js app routes and layout
src/app/api/auth/           Auth API routes
src/app/api/task/           Task API routes
src/app/home/               Protected home page
src/proxy.ts                Next.js route guard
src/features/auth/          Frontend auth feature
src/features/auth/api/      Frontend fetch helpers
src/features/auth/components Auth UI components
src/lib/                    Shared app libraries
src/schema/                 Zod validation schemas
src/services/               Backend service logic
src/store/                  Zustand auth and task stores
src/types/                  Shared frontend types
src/utils/                  Token utilities
app/generated/prisma/       Generated Prisma client, ignored by Git
prisma/                     Prisma schema and migrations
public/                     Static assets
```

## Database Schema

The Prisma schema is defined in `prisma/schema.prisma`.

Current models:

- `User`: account profile with email, password, refresh tokens, tasks, schedules, and daily logs
- `RefreshToken`: stored token hashes for refresh sessions
- `Task`: user tasks with priority, status, effort, energy requirement, and deadline
- `Schedule`: daily schedule blocks with optional AI-generated summary
- `DailyLog`: productivity metrics such as completed tasks, missed tasks, score, and AI calls used

Current enums:

- `Priority`: `LOW`, `MEDIUM`, `HIGH`
- `Status`: `TODO`, `IN_PROGRESS`, `COMPLETED`

## Prisma Notes

The Prisma client is generated into:

```text
app/generated/prisma
```

That generated folder is ignored by Git. Regenerate it with:

```bash
npx prisma generate
```

## Vercel Deployment

Vercel settings:

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
Root Directory: my-app
```

Add these environment variables in Vercel:

```env
DATABASE_URL="your-production-database-url"
ACCESS_TOKEN_SECRET="your-long-access-token-secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="your-long-refresh-token-secret"
REFRESH_TOKEN_EXPIRES_IN="7d"
```

Before deploying, make sure:

- `DATABASE_URL` is configured
- token secrets are strong random values
- migrations are applied to the production database
- `npm run build` succeeds locally or in CI
