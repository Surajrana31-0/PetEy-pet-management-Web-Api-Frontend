This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# irm https://x.ai/cli/install.ps1 | iex 


<!-- 
You are the senior frontend engineer responsible for completing this frontend project.

IMPORTANT:
You only have access to this frontend project.

However, assume there exists:

1. A production-ready backend that already implements all business logic.
You must continue THIS frontend so that it matches.

================================================

PROJECT GOAL

The goal of the PetEy frontend is to develop a modern, scalable, maintainable, and production-ready web application that fully implements every feature exposed by the PetEy backend while maintaining a consistent architecture, coding style, folder structure, and user experience across the entire project.
Never redesign the project.

Never rewrite the architecture.

Continue the existing implementation.

================================================

YOUR FIRST RESPONSIBILITY

Before writing any code:

Inspect the ENTIRE project.

Read every folder.

Read existing pages.

Read existing components.

Read layouts.

Read hooks.

Read contexts.

Read services.

Read utilities.

Read providers.

Read middleware.

Read types.

Read constants.

Read API functions.

Understand how the project is already written.

Never assume.

================================================

DO NOT CREATE DUPLICATES

Never recreate:

components

hooks

contexts

layouts

providers

services

types

utilities

API clients

interceptors

forms

tables

buttons

cards

dialogs

modals

loaders

If they already exist,

reuse them.

Extend them.

Improve them.

Never duplicate them.

================================================

KEEP THE EXISTING ARCHITECTURE

Do NOT invent another folder structure.

Respect the existing project.

If there is already:

services/

hooks/

api/

components/

shared/

features/

contexts/

lib/

utils/

types/

then continue using them.

================================================

FOLLOW THE SAME ENGINEERING STYLE

Match the existing:

File naming

Folder naming

Import order

Function naming

TypeScript style

React patterns

Hooks

Component composition

Error handling

Loading states

Validation

API layer

Code formatting

Abstraction level

Reuse philosophy

Do not introduce a different coding style.

================================================

FRONTEND MUST MATCH THE BACKEND

The backend already contains complete implementations for:

Authentication

Users

Pets

Favorites

Adoption

Veterinarian

Appointments

AI Assistant

Blogs

Admin Dashboard

Role Management

JWT Authentication

Protected APIs

Validation

DTOs

Error Responses

Pagination

Filtering

Searching

CRUD Operations

Profile Management

The frontend must eventually expose all backend capabilities.

Never invent endpoints.

Always integrate with existing backend APIs.

================================================

FEATURES THAT MUST EXIST

Authentication

- Login
- Register
- Logout
- Session Restore
- Protected Routes
- Role-based Routing
- Profile

User

- Dashboard
- Profile
- Edit Profile
- Favorites
- Adoption History
- Settings

Pets

- Browse
- Detail
- Search
- Filter
- Category
- Pagination
- Gallery
- Favorites
- Adopt

Adoption

- Application
- Status
- Tracking
- Approval Flow
- History

Veterinarian

- Listing
- Details
- Availability
- Booking

Appointments

- Booking
- Calendar
- Upcoming
- History
- Cancel

AI

- Chat
- Recommendations
- History

Admin

- Dashboard
- Users
- Pets
- Veterinarians
- Appointments
- Blogs
- AI
- Analytics

================================================

EVERY FEATURE MUST FOLLOW

Existing Folder Structure

↓

Existing Services

↓

Existing Hooks

↓

Existing Components

↓

Existing Styling

↓

Existing Types

↓

Existing API Layer

Never bypass the project's architecture.

================================================

WHEN IMPLEMENTING A FEATURE

Always answer:

1. What already exists?

2. Which files can be reused?

3. Which files need modification?

4. Which files absolutely need to be created?

If an existing file can be extended,

DO NOT create another one.

================================================

WHEN CREATING NEW FILES

Only create a new file when:

There is no appropriate existing file.

Otherwise,

modify the current implementation.

================================================

DO NOT MASS REFACTOR

Implement features incrementally.

Keep changes localized.

Avoid unnecessary rewrites.

================================================

AFTER EACH TASK

Verify:

No duplicated logic

No duplicated components

No duplicated services

No duplicated hooks

No duplicated contexts

No broken imports

No unused files

Architecture consistency

Type safety

Backend compatibility

================================================

OUTPUT FORMAT

For every task provide:

1. Analysis

2. Existing files reused

3. Existing files modified

4. New files created (if unavoidable)

5. Why they were needed

6. Backend integration summary

7. Verification checklist

Never skip the analysis.

Always inspect first.

Always reuse first.

Always continue the existing project. -->

<!-- 
Fix build blockers — Add petsApi / aiApi facades, fix pet-images import, align auth register payload and pet response shapes.
Phase 2 completion — Profile edit, password change pages.
Phase 3 polish — Wire homepage featured pets, connect wishlist to backend favorites.
Phase 4 — User dashboard — Favorites, adoption applications, settings.
Phase 5 — Admin pet management — Pagination, filters, image upload on PetForm.
Phase 6 — Adoption workflow — Application form + admin approval UI.
Phase 7 — AI — Full chat + history.
Phases 8–12 — Admin analytics, vets, appointments, blogs, polish, a11y, QA. -->



I've finished a full inspection of the PetEy frontend. Here is the project audit in your required format.

1. Analysis
Architecture (confirmed — will continue as-is)
React Component / Page
    ↓
Server Action (lib/actions/)
    ↓
API Layer (lib/api/)
    ↓
Axios Instance (Bearer token from auth_token cookie)
    ↓
Backend (http://localhost:8088, /api/v1/*)


Stack: Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4 · React Hook Form + Zod · Axios · react-toastify

Folder conventions:

app/ — routes ((auth), (site), dashboard/user, dashboard/admin)
app/_components/ — route-adjacent shared components (PetForm, Navbar, PetCard)
components/ — reusable UI (components/ui/) and feature components (components/pets/, components/auth/)
lib/api/ — HTTP clients + endpoints.ts
lib/actions/ — server actions
lib/auth/ — guards, roles, session, schemas
lib/types/, lib/constants/, lib/utils/, lib/hooks/
Auth pattern: JWT stored in auth_token cookie → injected as Authorization: Bearer via axios interceptor. RBAC enforced in 3 layers: middleware.ts → layout guards (lib/auth/guards.ts) → backend role middleware.

What exists today
image.png
image.png

Critical build failures (project does not compile)
Running npm run build produces 11 errors:

petsApi missing — 9 files import { petsApi } from lib/api/pets, but that file only exports individual functions (getAllPets, getPetById, etc.). No facade object exists.

aiApi missing — lib/actions/ai-actions.ts imports { aiApi } from lib/api/ai, but only individual exports exist.

Broken import in lib/utils/pet-images.ts — imports ./home-images but the file lives at lib/constants/home-images.ts.

Register payload mismatch — lib/api/auth.ts expects { firstName, lastName, ... } while forms/schemas use { fullName, ... }.

Response shape inconsistency — Admin pages expect petsApi.getAll() → data: IPet[], while /adopt expects data: { pets, total, page } (paginated).

2. Existing files reused (inventory)
Layouts: app/layout.tsx, (site)/layout.tsx, (auth)/layout.tsx, dashboard/layout.tsx, role-specific layouts

Auth: AuthContext, middleware.ts, lib/auth/guards.ts, lib/auth/roles.ts, lib/auth/session.ts, lib/auth/schemas.ts, auth forms

UI library: Full set under components/ui/ (17 components)

Pet features: BrowsePetsView, PublicPetCard, PetQuickPreview, PetWishlistButton, AiMatcherPreview, use-wishlist hook

API layer: endpoints.ts, axios-instance.ts, individual API modules for all domains

Types: lib/types/auth.ts, lib/types/pet.ts, lib/types/ai.ts

3. Existing files modified (in working tree)
Per git status, these have uncommitted changes (mostly API layer work in progress):

lib/api/auth.ts
lib/api/pets.ts (whitespace only — facade never added)
lib/api/ai.ts
lib/utils/pet-images.ts (broken import path)
lib/api/admin/pets.ts
lib/api/admin/appointment.ts (new)
README.md
4. New files created
None required for this audit. The only untracked file is lib/api/admin/appointment.ts, which correctly follows the admin API pattern.

5. Why gaps exist
The project is mid-migration:

Pages and server actions were written against petsApi / aiApi facade objects.
API modules were refactored to named function exports without adding the facade back.
Admin and user features beyond pet CRUD were scaffolded in the API layer but never given pages or actions.
Phase 1 (design system) is largely complete; Phases 2–12 from the README roadmap are partially started.
6. Backend integration summary

image.png
image.png
image.png
image.png