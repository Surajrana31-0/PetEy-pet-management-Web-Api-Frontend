import Link from 'next/link';
import type { IPet } from '@/lib/types/pet';
import { PetStatus } from '@/lib/types/pet';

interface PetCardProps {
  pet: IPet;
}

function statusClass(status: PetStatus): string {
  if (status === PetStatus.AVAILABLE) return 'dash-status--available';
  if (status === PetStatus.PENDING) return 'dash-status--pending';
  return 'dash-status--adopted';
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <article className="dash-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #fff8f5, #fef3ec)',
          padding: '28px 24px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 48, lineHeight: 1 }}>{pet.emoji}</span>
        <span className={`dash-status ${statusClass(pet.status)}`}>{pet.status}</span>
      </div>
      <div style={{ padding: '20px 24px 24px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-dark)',
            marginBottom: 4,
          }}
        >
          {pet.name}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
          {pet.breed} • {pet.species} • {pet.age}
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {pet.description}
        </p>
        {pet.status === PetStatus.AVAILABLE ? (
          <Link
            href={`/dashboard/user/adoptions/new/${pet._id}`}
            className="btn-primary"
            style={{ marginTop: 16, width: '100%', justifyContent: 'center', display: 'flex' }}
          >
            Apply to Adopt
          </Link>
        ) : (
          <button
            type="button"
            className="btn-primary"
            style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
            disabled
          >
            Not Available
          </button>
        )}
      </div>
    </article>
  );
}
