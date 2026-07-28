import { PawPrint } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" role="status" aria-label="Loading" />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}
