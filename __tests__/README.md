# Frontend Tests — PetEy

This branch (`test-frontend`) contains the test suite for the PetEy Next.js frontend.

## Running the tests

```bash
npm install
npm test
```

To run in watch mode:

```bash
npm run test:watch
```

To get a coverage report:

```bash
npm run test:coverage
```

## What's covered

| File | Tests |
|------|-------|
| `__tests__/lib/api/endpoints.test.ts` | All API endpoint path constants and dynamic route builders |
| `__tests__/lib/types/auth.test.ts` | UserRole enum, IUser and ILoginResponseData interfaces |
| `__tests__/lib/types/api.test.ts` | IApiResponse interface — success, error, and paginated shapes |
| `__tests__/lib/types/index.test.ts` | Re-exports, PetSpecies, PetStatus, Pet, JWTPayload, NotificationType |
| `__tests__/components/dashboard/dashboard-navbar.test.tsx` | DashboardNavbar — branding, role-based nav items, avatar, sign out |

## Tech stack

- **Jest** — test runner
- **jest-environment-jsdom** — DOM simulation for component tests
- **@testing-library/react** — React component testing utilities
- **@testing-library/jest-dom** — custom DOM matchers (toBeInTheDocument, etc.)
- **babel-jest** — TypeScript/JSX transform via Next.js babel preset

## Adding new tests

1. Create a new file in `__tests__/` mirroring the source path (e.g. `lib/api/auth.ts` -> `__tests__/lib/api/auth.test.ts`).
2. Import using the `@/` alias (e.g. `import { authApi } from '@/lib/api/auth'`).
3. Run `npm test` to execute.

## Notes

- Component tests mock `next/navigation`, `next/link`, and server actions to isolate the component.
- CSS/SCSS imports are stubbed via `identity-obj-proxy` so styles don't interfere with tests.
