# FocusAI — Intelligent Productivity & Daily Schedule Planner

FocusAI is an industry-grade, full-stack productivity workspace that combines task management with AI-powered schedule optimization. By analyzing task priorities, deadlines, estimated duration, and cognitive energy levels, FocusAI utilizes a Llama-3 model via Groq SDK to auto-generate a structured, chronological daily schedule.

---

## 🚀 Key Features

*   **Smart Task Management**: Add, modify, delete, and categorize tasks with rich metadata (deadlines, priorities, estimated minutes, and required energy level from 1 to 5).
*   **AI Daily Schedule Generation**: Instantly maps out an optimized timeline of task blocks and breaks using a custom LLM prompt, ensuring high-priority and high-energy tasks are placed early.
*   **Performance & Coaching Analytics**: Dynamic metrics tracking active work units, task completion rates, and personalized daily AI coaching reviews.
*   **Robust Security & Auth**: Implements custom JWT authentication with automatic refresh token rotation (stored securely as SHA-256 hashes in the database) and HTTPOnly cookies.
*   **Optimized AI API Calls**: Integrates a fetch-first caching approach, only hitting the AI generation endpoint if requested by the user or if no schedule has been generated yet for the current day.

---

## 🛠️ Tech Stack

### Frontend
*   **React 19 & Next.js 16 (App Router)**: Hybrid server-client rendering and file-based API routing.
*   **Zustand 5**: Ultra-lightweight, reactive global state stores.
*   **Axios**: Configured client with automatic JWT token insertion and credentials support.
*   **Tailwind CSS 4**: Modern styling utility classes and variables.

### Backend
*   **Next.js API Route Handlers**: Decoupled, modular CRUD routes.
*   **Prisma ORM**: Type-safe query building and database modeling.
*   **PostgreSQL**: Scalable database layer hosted on Neon.
*   **Groq SDK**: Connects to the `llama-3.3-70b-versatile` engine for sub-second schedule generation.
*   **jsonwebtoken & bcryptjs**: Password hashing and secure token signatures.

---

## 📁 Project Architecture

```text
my-app/
├── components/             # Reusable UI layout elements & cards
│   ├── layout/             # Sidebar, Navbar, and Mobile Navigation
│   └── ui/                 # Atomic Shadcn components (Button, Input, Card, Badge)
├── prisma/                 # Prisma config, Schema definition, Migrations
├── src/
│   ├── app/                # Next.js App Router folders and routes
│   │   ├── (dashboard)/    # Layout-wrapped routes: dashboard, tasks, schedule, stats
│   │   ├── api/            # API Route handlers (Auth, Tasks, Schedules)
│   │   └── page.tsx        # Auth page root mount
│   ├── features/           # Frontend feature modules (e.g., auth pages, fetch layers)
│   ├── lib/                # Shared connectors (axios, prisma, groq, prompts)
│   ├── schema/             # Zod validation schemas
│   ├── services/           # Backend database queries and logic
│   ├── store/              # Zustand global states (authStore, taskStore, aiGenrateStore)
│   ├── types/              # Unified TypeScript definitions
│   ├── utils/              # Token utilities & auth verifications
│   └── proxy.ts            # Next.js 16 route protection guard
└── README.md               # Documentation
```

---

## ⚙️ Configuration & Setup

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** or **bun** installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the project root:
```env
# Database connection (hosted Neon Postgres recommended)
DATABASE_URL="postgresql://neondb_owner:npg_...xxx.../neondb?sslmode=require"

# JWT Signatures
ACCESS_TOKEN_SECRET="your-strong-access-token-secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="your-strong-refresh-token-secret"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Third-party Integrations
GROQ_API_KEY="gsk_..."
```

### 4. Database Setup & Sync
Generate the Prisma client:
```bash
npx prisma generate
```
Apply migrations to sync your schema with PostgreSQL:
```bash
npx prisma migrate dev
```

### 5. Run the Application
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📡 API Reference

### Auth Endpoints
*   `POST /api/auth/register`: Creates a new user profile with password hashing.
*   `POST /api/auth/login`: Validates credentials, issues JWTs, and sets the secure HttpOnly cookie.
*   `POST /api/auth/me`: Retrieves current authenticated user context.
*   `POST /api/auth/refresh`: Evaluates, rotates, and sets new secure tokens.
*   `POST /api/auth/logout`: Clears both cookie keys and invalidates refresh hashes in the DB.

### Task Endpoints
*   `GET /api/task`: Gets all tasks of the authenticated user.
*   `POST /api/task`: Creates a task under Zod validation schemas.
*   `PATCH /api/task/[taskId]`: Partially updates a specific task's parameters.
*   `DELETE /api/task/[taskId]`: Removes a task.

### Schedule Endpoints
*   `GET /api/schedule/today`: Returns the today schedule if it has already been generated.
*   `POST /api/schedule/generate`: Sends tasks to Llama 3 model on Groq, records the resulting blocks array in PostgreSQL, and increments daily AI counters.

---

## 🧠 Interview Prep & Technical Deep-Dive Guide

This section compiles the core engineering concepts, design decisions, and architectural patterns implemented in FocusAI. Use these topics as study modules for technical interviews:

### 1. Advanced JWT Auth & Security Architecture
*   **Short-lived Access Tokens**: Access tokens are kept short-lived (e.g., `15m`) and stored in memory or client-safe short cookies. If an access token is compromised, the attacker's window of opportunity is extremely small.
*   **Refresh Token Rotation (RTR)**: Every time a client requests a new access token using a refresh token, the server issues a *new* refresh token and invalidates the old one. This mitigates token-replay attacks. If a malicious actor intercepts a refresh token, the next attempt by either the user or the attacker to reuse an old refresh token will trigger a security exception, prompting immediate session invalidation.
*   **Cryptographic Hashing in DB**: Refresh tokens are stored in the database as SHA-256 hashes (`tokenHash`), not plain text. If the database is compromised, the attacker cannot read the raw tokens to hijack active sessions.
*   **HTTPOnly, Secure Cookies**: Cookies are configured with `httpOnly: true` (prevents access via Client JavaScript, neutralizing Cross-Site Scripting (XSS) attacks), `sameSite: "lax"` (mitigates Cross-Site Request Forgery (CSRF)), and `secure` (restricted to HTTPS channels in production).

### 2. State Management Paradigms (Zustand vs. Redux/Context)
*   **Why Zustand?**: Zustand is a lightweight state manager based on hooks. Unlike **React Context**, updates in Zustand do not trigger re-renders of the entire component subtree. It bypasses Context Provider wrappers, avoiding the "Provider Hell" anti-pattern.
*   **Selector Optimization**: Components subscribe to specific parts of the store state (e.g., `const tasks = useTaskStore((state) => state.tasks)`). If other variables in the store change (e.g., `editingTask`), the subscribing component does not re-render unless the select slice itself changes.
*   **Transient State Updates**: Zustand allows updating component state directly without reacting to renders, which is useful for highly interactive elements or form validators.

### 3. Database Relations & ORM Modeling (Prisma & PostgreSQL)
*   **Relational Integrity (1-to-Many Relationships)**: A user has many tasks, refresh tokens, and schedules. These are mapped via explicit `@relation` foreign keys pointing from children to the `User` model.
*   **OnDelete Cascading**: All schemas implement `onDelete: Cascade`. If a `User` record is deleted, Prisma and PostgreSQL automatically clean up all associated `Task`, `Schedule`, `RefreshToken`, and `DailyLog` entries. This prevents "orphan rows" and ensures referential integrity.
*   **Database Migrations**: Every schema change is mapped to incremental SQL change files in the `/prisma/migrations` folder, allowing teams to roll forward and backward in database state deterministically.

### 4. Next.js Hydration & Rendering Flow (Client vs. Server Components)
*   **Hydration**: The process where React runs in the browser, reads the pre-rendered HTML sent by the server, attaches event listeners, and initializes state, turning static markup into an interactive single-page app (SPA).
*   **Avoiding Hydration Mismatch**: Hydration mismatches occur if the HTML generated by the server does not exactly match the initial HTML rendered by the client (e.g., referencing client-only state like `localStorage` or `window`). We avoid hydration mismatches by ensuring that initial states of central stores are identical on both server and client (e.g., showing skeleton loaders while data is fetched purely on client mount).
*   **Server Components (RSC)**: React Server Components render entirely on the server. They reduce the JavaScript bundle size shipped to the client, offer direct database access (as seen in API handlers), and improve SEO.

### 5. Prompt Engineering & LLM Type Safety
*   **JSON Enforcement**: When calling Groq's Llama model, we enforce structured JSON returns by explicitly requesting formatted JSON arrays and using Zod schemas (`safeParse`) on the backend response. If the LLM returns invalid structures, the API intercepts it with a `400 Bad Request` before committing corrupt data.
*   **Caching AI Outputs**: Since LLM token usage is expensive, the client queries `GET /api/schedule/today` first. A new schedule is only generated when the user manually triggers it, saving API costs and database write cycles.

---

## 🚀 Production Deployment Checklist

### Vercel Deployment Settings
- **Framework Preset**: Next.js
- **Install Command**: `npm install`
- **Build Command**: `npm run build` (runs `prisma generate && next build`)
- **Output Directory**: `.next`
- **Root Directory**: my-app

### Steps
1. Push your repository to GitHub.
2. Link your repository in Vercel.
3. Configure all `.env` secrets under **Project Settings -> Environment Variables**.
4. Deploy the project and execute database migrations.
