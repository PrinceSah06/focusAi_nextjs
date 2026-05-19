# FocusAI Next.js

FocusAI is a Next.js app with a simple authentication flow. It has signup, login, JWT access tokens, refresh token rotation, Prisma, PostgreSQL, and a responsive Tailwind frontend.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Commands

Run these commands from the `my-app` folder:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Useful check commands:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Build command for Vercel:

```bash
npm run build
```

## Auth Flow

Frontend page:

- `/` shows signup and login forms.

API routes:

- `POST /api/auth/register`: creates a new user.
- `POST /api/auth/login`: verifies email/password, creates access and refresh tokens, stores a hashed refresh token, and sets cookies.
- `POST /api/auth/refresh`: reads the refresh token cookie, verifies it, rotates it, saves the new hashed refresh token, sets the new refresh cookie, and returns a new access token.

Token behavior:

- Access token is short-lived.
- Refresh token is longer-lived.
- Refresh tokens are stored in the database as SHA-256 hashes, not plain text.

## Available Scripts

```bash
npm run dev
```

Runs the app locally with Next.js.

```bash
npm run build
```

Builds the production application.

```bash
npm run start
```

Starts the production server after a successful build.

```bash
npm run lint
```

Runs ESLint.

## Database Schema

The Prisma schema is defined in `prisma/schema.prisma`.

Current models:

- `User`: account profile with email, password, refresh tokens, tasks, schedules, and daily logs
- `RefreshToken`: stored token hashes for auth session refresh
- `Task`: user tasks with priority, status, estimated effort, energy requirement, and deadline
- `Schedule`: daily schedule blocks with optional AI-generated summary
- `DailyLog`: productivity metrics such as completed tasks, missed tasks, score, and AI calls used

Current enums:

- `Priority`: `LOW`, `MEDIUM`, `HIGH`
- `Status`: `TODO`, `IN_PROGRESS`, `COMPLETED`

## Project Structure

```text
app/                         Next.js app routes and layout
app/api/auth/                Auth API routes
app/generated/prisma/        Generated Prisma client
prisma/                      Prisma schema and migrations
public/                      Static assets
src/features/auth/           Frontend auth feature
src/features/auth/api/       Frontend fetch helpers
src/features/auth/components Auth UI components
src/lib/                     Shared app libraries
src/schema/                  Zod validation schemas
src/services/                Backend service logic
src/utils/                   Shared utility functions
prisma.config.ts             Prisma configuration
next.config.ts               Next.js configuration
```

## Prisma Notes

The Prisma client is generated into:

```text
app/generated/prisma
```

That generated folder is ignored by Git. Regenerate it after installing dependencies or changing the schema:

```bash
npx prisma generate
```

## Deployment

## Vercel Deployment

Vercel settings:

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
Root Directory: my-app
```

The `npm run build` command runs:

```bash
prisma generate && next build
```

That is important because the generated Prisma client is ignored by Git and must be generated again on Vercel.

Add these environment variables in Vercel:

```env
DATABASE_URL="your-production-database-url"
ACCESS_TOKEN_SECRET="your-long-access-token-secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="your-long-refresh-token-secret"
REFRESH_TOKEN_EXPIRES_IN="7d"
```

Before deploying, make sure your production environment has:

- `DATABASE_URL` configured
- `ACCESS_TOKEN_SECRET` configured with a strong random value
- `REFRESH_TOKEN_SECRET` configured with a strong random value
- migrations applied to the production database
- a fresh production build from `npm run build`
