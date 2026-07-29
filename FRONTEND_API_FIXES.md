# PetEy Frontend - API Layer Fix & Admin Features

This branch (`feature/api-layer-fix-and-admin-features`) fixes the broken authentication flow and adds all the new admin management features from the backend.

---

## Authentication Fix

### Root Cause
The `accessToken` cookie was set with `httpOnly: true` on the Next.js server side. This meant:
- The client-side `AuthContext` could not read the token from `document.cookie`
- The axios interceptor had no Bearer token to send to the backend
- Every authenticated API request from the browser returned 401

### Fix
1. **`lib/actions/auth-action.ts`**: Changed `accessToken` cookie to `httpOnly: false` so browser JavaScript can read it. The `refreshToken` remains `httpOnly: true` for security.
2. **`lib/api/axios-instance.ts`**: Added client-side cookie reading in the request interceptor. When running in the browser, it reads `accessToken` from `document.cookie` and sets it as the `Authorization: Bearer` header. Also fixed the refresh token interceptor to use `refreshToken` from cookies and prevent concurrent refresh requests.
3. **`lib/contexts/AuthContext.tsx`**: Updated to read the `accessToken` from cookies client-side and fall back to `userData` cookie if the API call fails.

---

## New API Modules

### `lib/api/notifications.ts`
- `getAll(params)` - Get paginated notifications (with optional unread filter)
- `getUnreadCount()` - Get unread notification count
- `markAsRead(id)` - Mark a single notification as read
- `markAllAsRead()` - Mark all notifications as read
- `delete(id)` - Delete a notification
- `deleteAllRead()` - Delete all read notifications

### `lib/api/dashboard.ts`
- `getFullDashboard()` - Get complete dashboard data (overview + monthly reports + activities + trends)
- `getOverview()` - Get overview statistics
- `getMonthlyReports(months)` - Get monthly aggregation reports
- `getRecentActivities(limit)` - Get recent activity log entries
- `getActivityLogs(params)` - Get paginated activity logs with filters
- `getActivityStats()` - Get activity statistics by module/action
- `getAdoptionTrends()` - Get adoption trends by status and species

### `lib/api/admin/user-management.ts`
- `getUsers(params)` - Get users with filters (role, status, search)
- `getStats()` - Get detailed user management statistics
- `suspendUser(id, reason)` - Suspend a user (invalidates their tokens)
- `activateUser(id)` - Activate (unsuspend) a user

### `lib/api/admin/adoptions.ts`
- `getStats()` - Get adoption statistics
- `exportCsv(status)` - Export adoption data as CSV (returns Blob)
- `getByStatus(status, params)` - Get applications filtered by status
- `bulkApprove(ids, notes)` - Bulk approve applications
- `bulkReject(ids, notes)` - Bulk reject applications

### `lib/api/chat-sessions.ts`
- `getSessions()` - List all AI chat sessions for the user
- `deleteSession(sessionId)` - Delete a chat session and all its messages

---

## New Server Actions (`lib/actions/dashboard-actions.ts`)
- `getAdminDashboardData()` - Fetches full admin dashboard data
- `getAdminDashboardOverview()` - Fetches overview stats only
- `getAdminRecentActivities(limit)` - Fetches recent activity logs
- `getMyNotifications(params)` - Fetches user notifications
- `getUnreadNotificationCount()` - Fetches unread count
- `markNotificationRead(id)` - Marks a notification as read
- `markAllNotificationsRead()` - Marks all as read
- `getUserDashboardData()` - Fetches user dashboard data (notifications + applications)

---

## Updated Endpoints (`lib/api/endpoints.ts`)
Added new endpoint groups:
- `NOTIFICATIONS` - All notification endpoints
- `ADMIN.DASHBOARD` - All admin dashboard endpoints
- `ADMIN.USERS_MANAGEMENT` - Enhanced user management with suspend/activate
- `ADMIN.ADOPTIONS` - Admin adoption management with bulk operations
- `AI.SESSIONS` - Chat session management

---

## Updated Types (`lib/types/index.ts`)
Added:
- `INotification`, `NotificationType`
- `IActivityLog`, `ActivityModule`, `ActivityAction`
- `IAdminDashboardData`, `IAdminDashboardOverview`, `IMonthlyReports`, `IAdoptionTrends`
- `IUserDashboardData`
- Updated `IUser` with `isSuspended`, `suspensionReason`, `suspendedAt` fields

---

## Updated Dashboard Pages

### Admin Dashboard (`app/dashboard/admin/page.tsx`)
- Now fetches real data from the backend via `getAdminDashboardData()`
- Shows real statistics: total pets, available, pending adoptions, completed, users, blogs
- Displays recent activity logs from the backend
- Shows adoption trends (status distribution + species breakdown)
- Shows monthly adoption reports
- Graceful error handling with fallback display

### User Dashboard (`app/dashboard/user/page.tsx`)
- Now fetches real data from the backend via `getUserDashboardData()`
- Shows real notification list with unread indicators
- Shows real application count
- Shows real favorites count from user data
- Graceful error handling with fallback display

---

## Data Flow

```
User fills form
    ↓
Component calls Server Action (auth-action.ts / dashboard-actions.ts)
    ↓
Server Action calls API function (lib/api/*.ts)
    ↓
Axios sends HTTP request with Bearer token → Backend
    ↓
Backend validates, queries DB, returns JSON
    ↓
Frontend receives response, saves token, redirects
```

The axios interceptor now correctly:
1. Reads the `accessToken` from cookies (client-side) or cached token (server-side)
2. Sets it as `Authorization: Bearer <token>` header
3. On 401, attempts to refresh using the `refreshToken` cookie
4. On successful refresh, retries the original request
