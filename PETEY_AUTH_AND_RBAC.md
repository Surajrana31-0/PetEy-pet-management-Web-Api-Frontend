# PetEy — Authentication, RBAC & Pet Management Documentation

Complete reference for the **PetEy Pet Adoption Management System** frontend and backend integration.

---

## How to Insert Admin in Database

There are **3 ways** to create an admin account:

### Method 1 — Seed Script (Recommended)

```bash
cd PetEy_pet-adoption-system_backend

# Make sure MongoDB is running and .env is configured
cp .env.example .env

# Run the seed script
npm run seed:admin
```

**Default admin credentials created:**

| Field | Value |
|-------|-------|
| Email | `admin@petey.com` |
| Password | `Admin@1234` |
| Role | `ADMIN` |

**Custom credentials** — set in backend `.env` before running:

```env
ADMIN_EMAIL=youradmin@email.com
ADMIN_PASSWORD=YourSecure@123
ADMIN_NAME=Your Name
```

Then run `npm run seed:admin` again.

> If the email already exists as a `USER`, the script automatically promotes it to `ADMIN`.

---

### Method 2 — MongoDB Compass / mongosh (Manual)

1. Open MongoDB Compass or run `mongosh`
2. Connect to: `mongodb://localhost:27017/petey_adoption`
3. Open the `users` collection
4. Find the user document and set:
   ```json
   { "role": "ADMIN" }
   ```
5. Or insert a new document (password must be bcrypt-hashed — use Method 1 instead)

---

### Method 3 — MongoDB Shell Command

```javascript
// In mongosh — promote existing user to admin
use petey_adoption
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "ADMIN" } }
)
```

---

### Verify Admin Was Created

```javascript
// In mongosh
use petey_adoption
db.users.findOne({ email: "admin@petey.com" }, { fullName: 1, email: 1, role: 1 })
// Expected: { role: "ADMIN" }
```

Then login at `http://localhost:3000/login` — you will be redirected to `/dashboard/admin`.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
4. [Backend Documentation](#backend-documentation)
5. [Frontend Documentation](#frontend-documentation)
6. [API Reference](#api-reference)
7. [Environment Variables](#environment-variables)
8. [Setup & Run Guide](#setup--run-guide)
9. [Testing Guide](#testing-guide)
10. [Security](#security)
11. [Troubleshooting](#troubleshooting)

---

## System Overview

PetEy is a full-stack pet adoption platform with:

- **Enterprise-layered backend** (Express + TypeScript + MongoDB)
- **Next.js App Router frontend** with Server Actions
- **JWT cookie-based authentication** (HttpOnly)
- **Role-based dashboards** for `USER` and `ADMIN`
- **Pet CRUD** for admins; browse-only for users

| Role | Dashboard | Capabilities |
|------|-----------|--------------|
| `USER` | `/dashboard/user` | Browse available pets, view profile |
| `ADMIN` | `/dashboard/admin` | Full pet CRUD, admin overview stats |

---

## Architecture

### Request Flow (Frontend)

```
Component (React Hook Form + Zod)
    ↓
Server Action (lib/actions/)
    ↓
API Layer (lib/api/)
    ↓
Axios Instance (withCredentials: true)
    ↓
Express Backend (port 8088)
```

**Rule:** Components must **never** call APIs directly. Always go through Server Actions.

### Backend Layered Architecture

```
Route → Validation Middleware → Auth Middleware → Role Middleware → Controller → Service → Repository → MongoDB
```

| Layer | Responsibility |
|-------|----------------|
| **Controller** | Receive request, call service, return response |
| **Service** | Business logic only |
| **Repository** | Database communication only |
| **DTO** | Input validation (class-validator) |
| **Middleware** | Auth, role, validation, error handling |

---

## Role-Based Access Control (RBAC)

### Role Enum

```typescript
enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
```

- All self-registrations via `/api/auth/register` are assigned `USER` by default.
- `ADMIN` accounts are created via the seed script or manual DB update.

### Login Redirect Logic

| Role | Redirect After Login |
|------|---------------------|
| `USER` | `/dashboard/user` |
| `ADMIN` | `/dashboard/admin` |

If a `?redirect=` query param is present on login, it is used **only when safe** for that role.

### Route Protection (3 Layers)

#### Layer 1 — Middleware (`middleware.ts`)

- Unauthenticated users → redirected to `/login`
- Authenticated users on `/login` or `/register` → redirected to role dashboard
- `USER` accessing `/dashboard/admin/*` → redirected to `/dashboard/user`
- `ADMIN` accessing `/dashboard/user/*` → redirected to `/dashboard/admin`
- `/dashboard` → auto-redirects based on JWT role

#### Layer 2 — Layout Guards (`lib/auth/guards.ts`)

| Guard | Used In | Behavior |
|-------|---------|----------|
| `requireAuthenticatedUser()` | `app/dashboard/layout.tsx` | Redirects to `/login` if no session |
| `requireUserRole()` | `app/dashboard/user/layout.tsx` | Redirects ADMIN to `/dashboard/admin` |
| `requireAdminRole()` | `app/dashboard/admin/layout.tsx` | Redirects USER to `/dashboard/user` |

#### Layer 3 — Backend Role Middleware

```typescript
roleMiddleware(UserRole.ADMIN)  // on POST, PUT, DELETE /api/pets
```

Returns `403 Forbidden` if role is insufficient.

### Role Detection Flow

```mermaid
flowchart TD
    A[User logs in] --> B[Backend sets accessToken + refreshToken cookies]
    B --> C[loginAction redirects by role]
    C --> D{Role?}
    D -->|USER| E[/dashboard/user]
    D -->|ADMIN| F[/dashboard/admin]
    E --> G[Middleware + requireUserRole guard]
    F --> H[Middleware + requireAdminRole guard]
```

---

## Backend Documentation

**Path:** `PetEy_pet-adoption-system_backend`

### Folder Structure

```
src/
├── controllers/
│   ├── auth.controller.ts
│   └── pet.controller.ts
├── database/
│   └── mongodb.ts
├── dtos/
│   ├── register-user.dto.ts
│   ├── login-user.dto.ts
│   ├── create-pet.dto.ts
│   └── update-pet.dto.ts
├── exceptions/
│   ├── http-exception.ts
│   ├── bad-request.exception.ts
│   ├── unauthorized.exception.ts
│   ├── not-found.exception.ts
│   └── forbidden.exception.ts
├── middlewares/
│   ├── authorized.middleware.ts
│   ├── role.middleware.ts
│   ├── validation.middleware.ts
│   └── error.middleware.ts
├── models/
│   ├── user.model.ts
│   └── pet.model.ts
├── repositories/
│   ├── user.repository.ts
│   └── pet.repository.ts
├── routes/
│   ├── user.route.ts      → mounted at /api/auth
│   └── pet.route.ts       → mounted at /api/pets
├── services/
│   ├── user.service.ts
│   └── pet.service.ts
├── scripts/
│   └── seed-admin.ts
├── types/
│   ├── user.type.ts
│   ├── pet.type.ts
│   └── jwt-payload.type.ts
├── utils/
│   ├── api-response.ts
│   ├── jwt.ts
│   ├── hash.ts
│   └── cookies.ts
├── app.ts
└── index.ts
```

### User Schema

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Auto-generated |
| `fullName` | String | Required |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, hidden (`select: false`), bcrypt hashed |
| `phoneNumber` | String | Optional |
| `address` | String | Optional |
| `location` | String | Optional |
| `role` | Enum | `USER` \| `ADMIN`, default `USER` |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

### Pet Schema

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Auto-generated |
| `name` | String | Required |
| `age` | String | Required (e.g. "2 year") |
| `breed` | String | Required |
| `species` | Enum | `DOG` \| `CAT` |
| `description` | String | Required, min 10 chars |
| `emoji` | String | Optional, default 🐕/🐈 by species |
| `status` | Enum | `AVAILABLE` \| `PENDING` \| `ADOPTED` |
| `createdBy` | ObjectId | Admin who created the listing |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

### JWT Configuration

| Token | Expiry | Cookie Name |
|-------|--------|-------------|
| Access Token | 15 minutes | `accessToken` |
| Refresh Token | 7 days | `refreshToken` |

**JWT Payload:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "USER"
}
```

**Cookie Options:**
```typescript
{
  httpOnly: true,
  secure: true,        // production only
  sameSite: 'strict',
  path: '/'
}
```

### Password Validation Rules

| Rule | Requirement |
|------|-------------|
| Minimum length | 8 characters |
| Uppercase | At least 1 |
| Lowercase | At least 1 |
| Number | At least 1 |
| Special character | At least 1 (`@$!%*?&`) |

### Standard API Response Format

**Success:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 8088) |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled production build |
| `npm run seed:admin` | Create or promote admin user |

---

## Frontend Documentation

**Path:** `PetEy_pet-adoption-system_frontend`

### Folder Structure

```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (site)/
│   ├── layout.tsx          # Public pages with Header + Footer
│   └── page.tsx            # Homepage
├── dashboard/
│   ├── layout.tsx          # Shared auth shell + Navbar
│   ├── page.tsx            # Auto role redirect
│   ├── user/
│   │   ├── layout.tsx      # USER role guard
│   │   ├── page.tsx        # User dashboard home
│   │   └── browse/page.tsx # Browse available pets
│   └── admin/
│       ├── layout.tsx      # ADMIN role guard
│       ├── page.tsx        # Admin dashboard + stats
│       └── pets/
│           ├── page.tsx           # List all pets (table)
│           ├── new/page.tsx       # Create pet
│           └── [id]/edit/page.tsx # Edit pet
├── _components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── Navbar.tsx
│   ├── PetCard.tsx
│   ├── PetForm.tsx
│   ├── schema.ts           # Auth Zod schemas
│   └── pet-schema.ts       # Pet Zod schemas
└── layout.tsx              # Root HTML shell

lib/
├── actions/
│   ├── auth-action.ts      # register, login, logout
│   └── pet-actions.ts      # create, update, delete pets
├── api/
│   ├── auth.ts
│   ├── pets.ts
│   ├── axios-instance.ts
│   └── endpoints.ts
├── auth/
│   ├── roles.ts            # Role helpers + JWT decode
│   ├── session.ts          # getCurrentUser()
│   └── guards.ts           # requireUserRole, requireAdminRole
├── cookies.ts              # Cookie forwarding from backend
└── types/
    ├── auth.ts
    └── pet.ts

components/
├── Header.tsx              # Public site header (role-aware)
└── Footer.tsx

middleware.ts               # Edge route protection + role routing
```

### Route Map

| URL | Access | Description |
|-----|--------|-------------|
| `/` | Public | Homepage |
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/dashboard` | Authenticated | Auto-redirects by role |
| `/dashboard/user` | USER only | User dashboard home |
| `/dashboard/user/browse` | USER only | Browse available pets |
| `/dashboard/admin` | ADMIN only | Admin dashboard + stats |
| `/dashboard/admin/pets` | ADMIN only | Pet list with edit/delete |
| `/dashboard/admin/pets/new` | ADMIN only | Create new pet |
| `/dashboard/admin/pets/[id]/edit` | ADMIN only | Edit existing pet |

### Auth Flow

#### Register
```
RegisterForm → registerAction → authApi.register → POST /api/auth/register
→ Success → redirect to /login
```

#### Login
```
LoginForm → loginAction → authApi.login → POST /api/auth/login
→ Backend sets cookies → setAuthCookiesFromResponse()
→ Redirect: ADMIN → /dashboard/admin | USER → /dashboard/user
```

#### Logout
```
Navbar form → logoutAction → authApi.logout → POST /api/auth/logout
→ clearClientCookies() → redirect to /login
```

#### Get Profile
```
Dashboard layout → authApi.me → GET /api/auth/me (Cookie forwarded)
```

### Pet Flow (Admin)

```
PetForm → createPetAction / updatePetAction → petsApi → Backend
→ revalidatePath() → refresh UI
```

```
Delete button form → deletePetAction → petsApi.delete → redirect /dashboard/admin/pets
```

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` | App Router framework |
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Zod integration for forms |
| `zod` | Client-side validation |
| `axios` | HTTP client |

---

## API Reference

**Base URL:** `http://localhost:8088/api`

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | Public | Register new user (role: USER) |
| `POST` | `/auth/login` | Public | Login, sets auth cookies |
| `POST` | `/auth/logout` | Public | Clears auth cookies |
| `GET` | `/auth/me` | Required | Get current user profile |

#### Register Request Body
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Secure@123"
}
```

#### Login Request Body
```json
{
  "email": "john@example.com",
  "password": "Secure@123"
}
```

### Pet Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/pets` | Public | — | List all pets (`?status=AVAILABLE` optional) |
| `GET` | `/pets/:id` | Public | — | Get single pet |
| `POST` | `/pets` | Required | ADMIN | Create pet |
| `PUT` | `/pets/:id` | Required | ADMIN | Update pet |
| `DELETE` | `/pets/:id` | Required | ADMIN | Delete pet |

#### Create Pet Request Body
```json
{
  "name": "Max",
  "age": "2 year",
  "breed": "Golden Retriever",
  "species": "DOG",
  "description": "Friendly and energetic, loves playing fetch.",
  "emoji": "🐕",
  "status": "AVAILABLE"
}
```

#### Update Pet Request Body (all fields optional)
```json
{
  "name": "Max",
  "status": "ADOPTED"
}
```

---

## Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8088/api
```

Copy from `.env.example`:
```bash
cp .env.example .env.local
```

### Backend (`.env`)

```env
PORT=8088
MONGO_URI=mongodb://localhost:27017/petey_adoption
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Admin seed (optional)
ADMIN_EMAIL=admin@petey.com
ADMIN_PASSWORD=Admin@1234
ADMIN_NAME=PetEy Admin
```

Copy from `.env.example`:
```bash
cp .env.example .env
```

| Variable | Project | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Frontend | Backend API URL |
| `NEXT_PUBLIC_API_URL` | Backend | Frontend origin for CORS |
| `MONGO_URI` | Backend | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Backend | Access token signing key |
| `JWT_REFRESH_SECRET` | Backend | Refresh token signing key |
| `ADMIN_EMAIL` | Backend | Seed script admin email |
| `ADMIN_PASSWORD` | Backend | Seed script admin password |

---

## Setup & Run Guide

### Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)
- Two terminal windows

### Step 1 — Backend

```bash
cd PetEy_pet-adoption-system_backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm install
npm run dev
```

Server starts at: **http://localhost:8088**

### Step 2 — Seed Admin Account

```bash
cd PetEy_pet-adoption-system_backend
npm run seed:admin
```

Default credentials:
- **Email:** `admin@petey.com`
- **Password:** `Admin@1234`

### Step 3 — Frontend

```bash
cd PetEy_pet-adoption-system_frontend
cp .env.example .env.local
npm install
npm run dev
```

App starts at: **http://localhost:3000**

### Step 4 — Production Build (verify)

```bash
# Backend
cd PetEy_pet-adoption-system_backend && npm run build

# Frontend
cd PetEy_pet-adoption-system_frontend && npm run build
```

---

## Testing Guide

### Test 1 — User Registration & Login

1. Open `http://localhost:3000/register`
2. Fill in: Full Name, Email, Password (must meet complexity rules), Confirm Password
3. Submit → redirected to `/login`
4. Login with new credentials
5. **Expected:** Redirected to `/dashboard/user`
6. Click **Browse Pets** → see available pets (empty until admin adds pets)

### Test 2 — Admin Login & Pet CRUD

1. Open `http://localhost:3000/login`
2. Login with `admin@petey.com` / `Admin@1234`
3. **Expected:** Redirected to `/dashboard/admin`
4. Click **Manage Pets** → **Add New Pet**
5. Fill form and submit
6. **Expected:** Pet appears in admin table
7. Click **Edit** → update pet → save
8. Click **Delete** → pet removed from list

### Test 3 — Role Isolation

| Action | Expected Result |
|--------|----------------|
| USER visits `/dashboard/admin` | Redirected to `/dashboard/user` |
| ADMIN visits `/dashboard/user` | Redirected to `/dashboard/admin` |
| Unauthenticated visits `/dashboard` | Redirected to `/login` |
| Logged-in user visits `/login` | Redirected to role dashboard |
| USER calls `POST /api/pets` | `403 Forbidden` from backend |

### Test 4 — Cookie Auth

1. Login as any user
2. Open browser DevTools → Application → Cookies
3. **Expected:** `accessToken` and `refreshToken` present (HttpOnly)
4. Visit `/dashboard` → profile loads from `/auth/me`
5. Logout → cookies cleared

---

## Security

| Feature | Implementation |
|---------|----------------|
| Password hashing | bcryptjs (10 salt rounds) |
| Token storage | HttpOnly cookies (not localStorage) |
| CORS | Credentials enabled, origin whitelist |
| Role enforcement | Middleware + layout guards + backend middleware |
| Input validation | class-validator (backend), Zod (frontend) |
| Password hidden | `select: false` on Mongoose schema |
| Safe redirects | `isSafeRedirect()` prevents open redirects |

### What Is NOT Yet Implemented

- Refresh token rotation endpoint (`/auth/refresh`)
- Server-side token blacklist on logout
- Rate limiting / brute-force protection
- Email verification
- Forgot / reset password
- CSRF tokens
- Adoption application workflow

---

## Troubleshooting

### "Network error" on login/register

- Ensure backend is running on port `8088`
- Check `NEXT_PUBLIC_API_BASE_URL=http://localhost:8088/api` in `.env.local`
- Verify CORS: backend `NEXT_PUBLIC_API_URL=http://localhost:3000`

### Login succeeds but dashboard shows N/A

- Cookies may not be forwarding — restart both servers
- Check browser allows cookies for `localhost`
- Verify `withCredentials: true` in `axios-instance.ts`

### Admin login redirects to user dashboard

- Run `npm run seed:admin` to ensure role is `ADMIN` in MongoDB
- Check user document in MongoDB: `db.users.findOne({ email: "admin@petey.com" })`
- Role field must be `"ADMIN"` (not `"admin"`)

### Pet create fails with 403

- You are logged in as `USER`, not `ADMIN`
- Login with admin credentials

### Pet create fails with 400

- Description must be at least 10 characters
- Species must be `DOG` or `CAT`
- All required fields must be filled

### MongoDB connection error

- Ensure MongoDB is running: `mongod` or Docker container
- Check `MONGO_URI` in backend `.env`

### Build fails on frontend

```bash
Remove-Item -Recurse -Force .next
npm run build
```

---

## Default Accounts

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Admin (seed) | `admin@petey.com` | `Admin@1234` | ADMIN |
| User | Register at `/register` | Your choice | USER |

---

## File Change Log

### Backend — Added

- `src/middlewares/role.middleware.ts`
- `src/exceptions/forbidden.exception.ts`
- `src/types/pet.type.ts`
- `src/models/pet.model.ts`
- `src/dtos/create-pet.dto.ts`
- `src/dtos/update-pet.dto.ts`
- `src/repositories/pet.repository.ts`
- `src/services/pet.service.ts`
- `src/controllers/pet.controller.ts`
- `src/routes/pet.route.ts`
- `src/scripts/seed-admin.ts`
- `src/dtos/register-user.dto.ts`
- `src/dtos/login-user.dto.ts`

### Backend — Modified

- `src/app.ts` — mounted `/api/pets`
- `src/routes/user.route.ts` — updated DTO imports
- `src/services/user.service.ts` — updated DTO imports
- `src/types/user.type.ts` — plain TypeScript interfaces
- `package.json` — added `seed:admin` script
- `.env.example` — added admin seed variables

### Frontend — Added

- `lib/auth/roles.ts`
- `lib/auth/session.ts`
- `lib/auth/guards.ts`
- `lib/types/pet.ts`
- `lib/api/pets.ts`
- `lib/actions/pet-actions.ts`
- `app/dashboard/layout.tsx`
- `app/dashboard/user/` (layout, page, browse)
- `app/dashboard/admin/` (layout, page, pets CRUD)
- `app/_components/PetCard.tsx`
- `app/_components/PetForm.tsx`
- `app/_components/pet-schema.ts`
- `middleware.ts`
- `.env.example`

### Frontend — Modified

- `lib/actions/auth-action.ts` — role-based login redirect
- `lib/api/endpoints.ts` — added `PETS`
- `app/_components/LoginForm.tsx` — `?redirect=` support
- `app/_components/Navbar.tsx` — role-specific navigation
- `components/Header.tsx` — role-aware dashboard link
- `app/dashboard/page.tsx` — auto role redirect
- `app/(auth)/login/page.tsx` — Suspense for search params

### Frontend — Removed

- `app/(auth)/_component/` (old forms)
- `app/(auth)/login/pagees.tsx`
- `app/(auth)/register/pagees.tsx`
- `lib/actions/auth-actions.ts` (replaced by `auth-action.ts`)
- `app/(root)/layout.tsx` (replaced by `(site)/layout.tsx`)

---

*Last updated: June 2026 — PetEy Pet Adoption Management System*
