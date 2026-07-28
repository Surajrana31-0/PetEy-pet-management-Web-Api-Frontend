# Backend Authentication Fixes — Required Changes

> **Purpose:** This document lists every backend change needed so the frontend's
> role-based authentication, login, sign-up, and password-reset flows work
> correctly. The frontend has been updated to match the backend contract below.
> **You must apply these changes manually in the backend.**

---

## 1. Cookie Names — Already Correct ✅

The backend already sets cookies named `accessToken` and `refreshToken`
(see `src/utils/cookies.ts`). **No change needed.** The frontend has been
updated to read these exact names.

| Cookie Name     | Set By Backend | Read By Frontend |
|-----------------|----------------|------------------|
| `accessToken`   | ✅ `CookieUtil.setAuthCookies` | ✅ `cookies.ts`, `middleware.ts` |
| `refreshToken`  | ✅ `CookieUtil.setAuthCookies` | ✅ (available for refresh) |

---

## 2. Register Endpoint — `username` Field Required

**File:** `src/dtos/user.dto.ts` (line 7-13)

The `CreateUserDto` picks `username` from `UserSchema`, which requires
`z.string().min(3)`. The frontend now sends `username` in the register
payload.

**Current (no change needed if you want username):**
```ts
export const CreateUserDto = UserSchema.pick({
  fullName: true,
  username: true,   // ← frontend now sends this
  email: true,
  password: true,
  profileImage: true,
});
```

**If you prefer to make `username` optional** (frontend generates it from
`fullName`), change `UserSchema`:
```ts
// src/types/user.type.ts
username: z.string().min(3).optional(),  // add .optional()
```

And in `user.service.ts`, auto-generate username if not provided:
```ts
async registerUser(userData: CreateUserDto) {
  // ... existing checks ...
  const username = userData.username || `${userData.fullName.toLowerCase().replace(/\s+/g, '.')}${Date.now()}`;
  // use `username` in the create call
}
```

---

## 3. Email Verification — Required for Login

**Files:** `src/services/user.service.ts` (lines 128-130, 177-179),
`src/controllers/user.controller.ts` (lines 27-29)

The backend sets `emailVerified: false` on registration and **blocks login**
with a `403` if the email isn't verified. The frontend now includes a
**Verify Email** page at `/verify-email?token=...`.

### What the frontend expects:

1. **Registration** → backend sends a verification email with a link like:
   ```
   http://localhost:3000/verify-email?token=<verificationToken>
   ```
   This is already done in `user.service.ts` line 424:
   ```ts
   const verificationLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
   ```
   ✅ **No change needed.**

2. **Verify Email endpoint** → `POST /api/v1/auth/verify-email` with body
   `{ token: string }`. Already exists in `user.route.ts` (line 63-67).
   ✅ **No change needed.**

3. **Login** → after email is verified, login proceeds normally.

### Optional: Auto-verify in development

If you want to skip email verification during development, modify
`user.service.ts` `loginUser` to skip the `emailVerified` check when
`NODE_ENV === 'development'`:

```ts
// src/services/user.service.ts — inside loginUser(), after password check
if (!user.emailVerified && process.env.NODE_ENV !== 'development') {
  throw new HttpException(403, "Please verify your email before logging in");
}
```

---

## 4. Password Complexity — Frontend Is Stricter (OK)

| Field              | Backend Min | Frontend Min | Notes |
|--------------------|-------------|--------------|-------|
| Register password  | 6 chars     | 8 chars + complexity | Frontend stricter — ✅ fine |
| Reset password     | 6 chars     | 8 chars + complexity | Frontend stricter — ✅ fine |
| Change password    | 6 chars     | 8 chars + complexity | Frontend stricter — ✅ fine |

**No backend change needed.** The frontend enforces stronger passwords than
the backend, which is a security best practice.

---

## 5. CORS — Ensure Frontend Origin Is Allowed

**File:** `src/config/environment.ts` (line 29)

```ts
allowedOrigins: (process.env.ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').split(','),
```

Make sure your `.env` includes the frontend URL:
```env
ALLOWED_ORIGINS=http://localhost:3000
# or
NEXT_PUBLIC_API_URL=http://localhost:3000
```

The frontend axios instance now sends `withCredentials: true`, so the
backend **must** have `credentials: true` in CORS (already set in `app.ts`
line 26). ✅

---

## 6. JWT Payload — Already Includes `role` ✅

**File:** `src/services/user.service.ts` (lines 39-45)

```ts
const payload = {
  id: user._id.toString(),
  email: user.email,
  role: user.role,           // ← frontend decodes this for RBAC
  tokenVersion: user.tokenVersion ?? 0,
};
```

The frontend `decodeAccessTokenRole()` in `lib/auth/roles.ts` decodes the
JWT payload to extract `role`. ✅ **No change needed.**

---

## 7. Refresh Token Endpoint — Already Exists ✅

**File:** `src/routes/user.route.ts` (lines 39-43)

`POST /api/v1/auth/refresh-token` with body `{ refreshToken?: string }`.
The frontend can call this when the access token expires. ✅

---

## 8. Logout — Already Clears Cookies ✅

**File:** `src/controllers/user.controller.ts` (lines 372-394)

The logout endpoint calls `CookieUtil.clearAuthCookies(res)` which clears
both `accessToken` and `refreshToken`. ✅

---

## Summary of Backend Changes

| # | Change | File | Status |
|---|--------|------|--------|
| 1 | Cookie names match frontend | `cookies.ts` | ✅ Already correct |
| 2 | Register accepts `username` | `user.dto.ts` | ✅ Frontend sends it |
| 3 | Email verification flow | `user.service.ts` | ✅ Already implemented |
| 4 | Password complexity | `user.dto.ts` | ✅ Frontend stricter (OK) |
| 5 | CORS allows frontend origin | `environment.ts` | ⚠️ Verify `.env` |
| 6 | JWT includes `role` | `user.service.ts` | ✅ Already correct |
| 7 | Refresh token endpoint | `user.route.ts` | ✅ Already exists |
| 8 | Logout clears cookies | `user.controller.ts` | ✅ Already correct |

**Bottom line:** The backend is already well-structured. The main issues
were on the **frontend** side — cookie name mismatches, missing
`withCredentials`, missing `username` in registration, and no email
verification UI. All of these have been fixed in the frontend code.
