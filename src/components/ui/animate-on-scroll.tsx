'use client';

import { useEffect, useRef, useState } from 'react';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'blur';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: AnimationType;
}

const getInitialTransform = (animation: AnimationType): string => {
  switch (animation) {
    case 'fade-up':
      return 'translateY(40px)';
    case 'fade-down':
      return 'translateY(-40px)';
    case 'fade-left':
      return 'translateX(-60px)';
    case 'fade-right':
      return 'translateX(60px)';
    case 'scale':
      return 'scale(0.95)';
    case 'blur':
    default:
      return 'translateX(-60px)';
  }
};

export function AnimateOnScroll({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 0.8,
  animation = 'fade-up'
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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

  const initialTransform = getInitialTransform(animation);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0) scale(1)' : initialTransform,
        transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
      }}
    >
      {children}
    </div>
  );
}
