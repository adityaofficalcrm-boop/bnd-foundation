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
| 6+ | Donations + Stripe | ✅ Complete |
| — | Campaigns | ✅ Complete |
| — | Gallery (local images + short videos) | ✅ Complete |
| — | Volunteer applications | ✅ Complete |
| — | Dashboard stats | ✅ Complete |
| — | i18n (English / Nepali) | ✅ Complete (UI + home/mission CMS overlays; more CMS pages can be added) |
| — | Deploy (Vercel + Render + Atlas) | Pending |

### Product decisions (locked)

| Decision | Choice |
| -------- | ------ |
| Back-office users | **Super Admin only** — no multi-admin / invite-Admin feature |
| Public site | Open pages for visitors (browse, contact, donate) |
| Media storage | **Local backend uploads** (`/uploads`) — not Cloudinary |
| Media volume | Few images + ~4–5 short videos |

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
| `/about/history`, `/about/donors`, `/about/impact` | `ABOUT_US` | `GET /api/v1/cms/public/ABOUT_US` |
| `/team` | `ABOUT_US` (`team`, `team-*` slugs) | `GET /api/v1/cms/public/ABOUT_US` |
| `/projects` | `ABOUT_US` (`projects`, `project-*`, `grant-*`) | `GET /api/v1/cms/public/ABOUT_US` |
| `/mission` | `MISSION_VISION` | `GET /api/v1/cms/public/MISSION_VISION` |
| `/contact` | `CONTACT_INFO` | `GET /api/v1/cms/public/CONTACT_INFO` |

Footer content loads from `GET /api/v1/cms/public/FOOTER`. All page content is fetched dynamically — nothing is hardcoded.

**Footer CMS slugs** (FOOTER section):

| Slug | Purpose |
| ---- | ------- |
| `footer-main` | Acknowledgment paragraph + copyright, social URLs, support credit |
| `address-*` | Office addresses (Addresses column) — put address in **Body** |
| `footer-touch-*` | Get in Touch locations (e.g. Oakleigh VIC, Nepal) — **Body** = address line |

Phone and email come from **Contact Information** (`contact-main`). Set **Support credit line** on `footer-main` to e.g. `Supported by Ledger IT.`

**Navigation labels (`nav-*` slugs):** Entries whose slug starts with `nav-` are used **only** for header/footer menu text — they are never shown as page content. Set the **Title** to the label you want (e.g. `Home`, `About Us`). Use any CMS section; slug must be unique.

| Slug | Menu item |
| ---- | --------- |
| `nav-home` | Home |
| `nav-about` | About Us (dropdown parent) |
| `nav-about-history` | Our History |
| `nav-about-donors` | Our Donors |
| `nav-about-impact` | Our Impact |
| `nav-team` | Our Team |
| `nav-projects` | Current Projects |
| `nav-contact` | Contact Us |

**Image uploads:** In `/admin/cms`, use the image uploader on any entry. Files are stored on the backend (`POST /api/v1/media/upload`) and served from `/uploads/...`. You can also paste an external image URL.

**About page content slugs** (ABOUT_US section):

| Page | Intro slug | Section slugs | Notes |
| ---- | ---------- | ------------- | ----- |
| [Our History](https://bndfoundation.org/history-2/) | `history` | `history-*` | Alternating image + text rows |
| [Our Impact](https://bndfoundation.org/impact/) | `impact` | `impact-*` | Use `- item` lines in body for bullet lists |
| [Our Donors](https://bndfoundation.org/our-donors/) | `donors` | `donor-*` | Set meta **Amount** + **Location**; subheading = quote |
| [Our Team](https://bndfoundation.org/our-teams/) | `team` | `team-*` | Set meta **Role** + **Group** (board, advisors, management, nepal-chapter) |
| [Current Projects](https://bndfoundation.org/current-projects/) | `projects` | `project-*`, `grant-*` | Grants use meta **Grant provider**; subheading = amount |

| Slug examples | Reference section |
| ------------- | ----------------- |
| `history-education` | Transforming Futures Through Education |
| `impact-tutoring` | Tutoring and Mentorship Programs |
| `donor-bhaskar-regmi` | Donor spotlight card |
| `team-raju-adhikari` | Board member (group: board) |
| `project-empowered` | Featured ongoing project |
| `grant-casey-maths` | Grant received card |

**Homepage CMS slug conventions** (HOME section):

| Slug pattern | Homepage section |
| ------------ | ---------------- |
| `hero` | Hero banner (uses **Heading** + **Subheading** + **Body** — Title is admin-only) |
| `stats-heading` | Impact section intro (Heading = eyebrow, Title = headline, Body = intro paragraph) |
| `stat-*` | Impact cards — **Title** = card heading, **Body** = description, **Image** = optional icon, **Subheading** = optional highlight (e.g. 100+) |
| `programs-heading` | Programs section title |
| `program-*` | Program cards (What We Do) |
| `testimonials-heading` / `testimonial-*` | Testimonials carousel — **Title** = name, **Body** = quote |
| `donate-banner` / `donate-slide-*` | Donate carousel — **Title** + **Subheading** + **Image** per slide; multiple slides auto-rotate |
| `facebook-updates` | Facebook section — **Title** = heading text, **Facebook page URL** in structured fields |
| `fundraise-heading` / `fundraise-*` | Fundraising highlights |
| `partners-heading` | Our Partnership intro (Heading = Our Partners, Title = Our Partnership, Body = paragraph) |
| `org-stat-*` | Green stats bar above partners — **Subheading** = number (e.g. 30, 12+), **Title** = label (e.g. Staffs, Projects) |
| `partner-*` | Partner logos — upload **Image**, set **Partner group** (Funding Bodies or Community partners) |
| `cta-heading` / `cta-*` | How You Can Help — upload **image** on `cta-heading` for the left photo; `cta-*` cards for Donate / Volunteer / Get Involved (optional image per card = custom icon) |

**Static assets:** When CMS entries omit `imageUrl`, the site uses images from `frontend/public/` (hero, programs, logo, ACNC badge, flags). See `frontend/src/config/site-assets.ts`.

**Public site:** http://localhost:5173/

## Deployment Targets

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas
