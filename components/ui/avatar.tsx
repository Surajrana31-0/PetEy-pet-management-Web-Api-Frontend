'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackIcon?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  fallbackIcon,
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const getInitials = (n?: string) => {
    if (!n) return '';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  // Convert relative backend path to absolute if needed
  const imageUrl = src?.startsWith('/') && !src.startsWith('http')
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088'}${src}`
    : src;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold shadow-inner',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : name ? (
        <span>{getInitials(name)}</span>
      ) : (
        fallbackIcon || <User className="w-1/2 h-1/2 text-slate-400" />
      )}
    </div>
  );
};
