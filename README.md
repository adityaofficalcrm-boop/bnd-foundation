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
- Backend API: http://localhost:5000/api/v1
- Health check: http://localhost:5000/api/v1/health

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
| `npm run seed -w backend` | Seed the first SUPER_ADMIN user |

## Auth API (Phase 3)

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/api/v1/auth/login` | No | Admin login |
| POST | `/api/v1/auth/refresh` | No | Refresh access token |
| POST | `/api/v1/auth/logout` | No | Revoke refresh token |
| GET | `/api/v1/auth/me` | Bearer | Get current admin user |

**Roles:** `SUPER_ADMIN`, `ADMIN` — no public registration. Seed the first super admin:

```bash
npm run seed -w backend
```

## Development Phases

| Phase | Scope | Status |
| ----- | ----- | ------ |
| 1 | Monorepo setup | ✅ Complete |
| 2 | Backend architecture | ✅ Complete |
| 3 | Authentication | ✅ Complete |
| 4 | Admin panel foundation | ✅ Complete |
| 4.5 | Design system & UI kit | ✅ Complete |
| 5 | CMS management | ✅ Complete |
| 6 | Public website | ✅ Complete |
| 6+ | CMS, modules | Pending |

See [PROJECT_REQUIREMENTS.md](./PROJECT_REQUIREMENTS.md) for full specifications.

## Backend Architecture (Phase 2)

```
backend/src/
├── config/           # Env validation + app config + MongoDB connection
├── controllers/      # HTTP layer (extends BaseController)
├── services/         # Business logic (extends BaseService)
├── repositories/     # Data access (extends BaseRepository)
├── routes/v1/        # Versioned API routes
├── middleware/       # Validation, error handling
├── errors/           # Custom HTTP error classes
├── utils/            # Logger, ApiResponse, validation helpers
└── types/            # Shared TypeScript types
```

All API endpoints are served under `/api/v1`.

## Admin Panel (Phase 4)

| Route | Description |
| ----- | ----------- |
| `/login` | Admin sign-in |
| `/admin` | Protected dashboard home |

**Auth behavior:**
- Access token stored in memory (React context + session module)
- Refresh token stored in `localStorage`
- Axios interceptor attaches Bearer token and refreshes once on 401
- Unauthenticated users redirect to `/login`
- Role-based nav filtering via `RoleProtectedRoute` component

**Test login** (after seeding backend):
- URL: http://localhost:5173/login
- Email: `admin@bndfoundation.org`
- Password: `ChangeMe123!`

## Design System (Phase 4.5)

Theme tokens and reusable admin components live under:

- `frontend/src/design-system/` — theme configuration
- `frontend/src/components/app/` — App UI kit (AppButton, AppInput, PageHeader, etc.)
- `frontend/src/index.css` — global CSS design tokens

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for brand guidelines.

## CMS API (Phase 5)

### Admin (authenticated)

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/api/v1/cms` | Admin | List CMS pages (search, filter, pagination) |
| GET | `/api/v1/cms/:id` | Admin | Get CMS page by ID |
| POST | `/api/v1/cms` | Admin | Create CMS page |
| PUT | `/api/v1/cms/:id` | Admin | Update CMS page |
| DELETE | `/api/v1/cms/:id` | Admin | Delete CMS page |

### Public (no auth)

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/api/v1/cms/public` | None | All published CMS entries |
| GET | `/api/v1/cms/public/:section` | None | Published CMS entries by section |

**Sections:** `HOME`, `ABOUT_US`, `MISSION_VISION`, `CONTACT_INFO`, `FOOTER`

Public responses omit internal admin fields (`createdBy`, `updatedBy`, `status`) and only include `PUBLISHED` records.

**Admin UI:** http://localhost:5173/admin/cms

## Public Website (Phase 6)

| Route | CMS Section | API |
| ----- | ----------- | --- |
| `/` | `HOME` | `GET /api/v1/cms/public/HOME` |
| `/about` | `ABOUT_US` | `GET /api/v1/cms/public/ABOUT_US` |
| `/mission` | `MISSION_VISION` | `GET /api/v1/cms/public/MISSION_VISION` |
| `/contact` | `CONTACT_INFO` | `GET /api/v1/cms/public/CONTACT_INFO` |

Footer content loads from `GET /api/v1/cms/public/FOOTER`. All page content is fetched dynamically — nothing is hardcoded.

**Homepage CMS slug conventions** (HOME section):

| Slug pattern | Homepage section |
| ------------ | ---------------- |
| `hero` | Hero banner |
| `stats-heading` | Impact statistics section title |
| `stat-*` | Impact stat cards (`subheading` = value, `title` = label) |
| `programs-heading` | Programs section title |
| `program-*` | Program cards |
| `team-heading` | Team section title |
| `team-*` | Team member cards |
| `gallery-heading` | Gallery section title |
| `gallery-*` | Gallery preview items |

**Public site:** http://localhost:5173/

## Deployment Targets

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas
