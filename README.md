# BND Foundation Platform

Modern rebuild of [bndfoundation.org](https://bndfoundation.org) using React, Node.js, and MongoDB.

## Monorepo Structure

```
bnd-foundation/
├── frontend/          # React 19 + Vite public website
├── backend/           # Express + MongoDB API
├── package.json       # Workspace root scripts
├── tsconfig.base.json # Shared TypeScript defaults
├── eslint.config.js   # Shared ESLint baseline
└── .prettierrc        # Shared formatting rules
```

## Tech Stack

| Layer    | Technologies |
| -------- | ------------ |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, ShadCN UI, TanStack Query, React Router, React Hook Form, Zod |
| Backend  | Node.js, Express, TypeScript, MongoDB, Mongoose |
| Tooling  | ESLint, Prettier, npm workspaces |

## Prerequisites

- Node.js 20+
- MongoDB (local or MongoDB Atlas)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update `backend/.env` with your MongoDB connection string.

4. Start both apps:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Run frontend and backend concurrently |
| `npm run dev:frontend` | Run Vite dev server only |
| `npm run dev:backend` | Run Express dev server only |
| `npm run build` | Build frontend and backend |
| `npm run lint` | Lint all workspaces |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Type-check all workspaces |

## Development Phases

| Phase | Scope | Status |
| ----- | ----- | ------ |
| 1 | Monorepo setup | ✅ Complete |
| 2 | Backend architecture | Pending |
| 3 | Authentication | Pending |
| 4 | Public website | Pending |
| 5+ | Admin, CMS, modules | Pending |

See [PROJECT_REQUIREMENTS.md](./PROJECT_REQUIREMENTS.md) for full specifications.

## Deployment Targets

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas
