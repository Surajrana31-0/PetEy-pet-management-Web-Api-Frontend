'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { HOME_IMAGES } from '@/lib/constants/home-images';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  fallbackSrc = HOME_IMAGES.fallback,
  alt,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      {...props}
      alt={alt}
      src={hasError ? fallbackSrc : currentSrc}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
