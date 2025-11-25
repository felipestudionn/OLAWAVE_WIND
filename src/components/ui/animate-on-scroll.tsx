'use client';

import { useEffect, useRef, useState } from 'react';

type AnimationType = 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: AnimationType;
}

export function AnimateOnScroll({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 0.6,
  animation = 'fade'
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const element = ref.current;
    if (!element) return;

    // Check if element is already in viewport
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => setIsVisible(true), delay);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  // Show content immediately on server/before hydration
  if (!hasMounted) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  // Simple fade - just opacity change, no movement
  const isFadeOnly = animation === 'fade';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}s ease-out`,
      }}
    >
      {children}
    </div>
  );
}
