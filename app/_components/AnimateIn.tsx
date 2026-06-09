'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
  /** Above-the-fold content — visible immediately, still animates in */
  immediate?: boolean;
}

function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
}

export default function AnimateIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  immediate = false,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (immediate) {
      setVisible(true);
      return;
    }

    if (isInViewport(element)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' },
    );

    observer.observe(element);

    const failsafe = window.setTimeout(() => {
      setVisible(true);
      observer.disconnect();
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [immediate]);

  return (
    <div
      ref={ref}
      className={`reveal reveal--${direction}${visible ? ' reveal--visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
