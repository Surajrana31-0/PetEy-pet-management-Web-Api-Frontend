import { CardSkeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="dash-page max-w-2xl space-y-6">
      <CardSkeleton />
    </div>
  );
}
