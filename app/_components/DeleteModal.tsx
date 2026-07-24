'use client';

import { ConfirmDialog } from '@/components/ui/dialog';

interface DeleteModalProps {
  isOpen: boolean | null;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
}: DeleteModalProps) {
  return (
    <ConfirmDialog
      open={Boolean(isOpen)}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      description={description}
      confirmLabel="Delete"
      variant="destructive"
      isLoading={isLoading}
    />
  );
}
