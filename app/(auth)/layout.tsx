// app/(auth)/layout.tsx
// The root layout (app/layout.tsx) already wraps every page with Header + Footer.
// This auth layout only adds auth-specific wrapping if needed in the future
// (e.g. a session redirect guard in Sprint 2).

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}