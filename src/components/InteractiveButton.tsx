'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface InteractiveButtonProps {
  onClick: () => void;
}

export default function InteractiveButton({ onClick }: InteractiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Subtle pulse animation when not hovered
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setIsAnimating(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <button
      className={`
        relative
        pointer-events-auto
        transition-all
        duration-300
        transform
        ${isHovered ? 'scale-110' : 'scale-100'}
        ${isAnimating && !isHovered ? 'animate-pulse' : ''}
        hover:rotate-180
        group
        mx-1
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Show Easter Egg Video"
    >
      {/* Glow effect */}
      <div
        className={`
          absolute
          inset-0
          rounded-full
          transition-opacity
          duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
          animate-ping
          bg-white/30
          scale-150
        `}
      />
      
      {/* Rotating ring */}
      <div
        className={`
          absolute
          inset-0
          rounded-full
          border-2
          border-white/50
          transition-all
          duration-300
          ${isHovered ? 'scale-125 rotate-180' : 'scale-100 rotate-0'}
        `}
      />

      {/* Main button image */}
      <Image
        src="/Button3D.PNG"
        alt="O"
        width={80}
        height={80}
        className={`
          relative
          z-10
          transition-all
          duration-300
          ${isHovered ? 'filter brightness-125' : ''}
          group-hover:shadow-lg
        `}
        priority
      />

      {/* Hint text */}
      <span
        className={`
          absolute
          left-1/2
          -bottom-8
          transform
          -translate-x-1/2
          text-white
          text-xs
          font-light
          tracking-wider
          whitespace-nowrap
          transition-opacity
          duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
      >
        Click me!
      </span>
    </button>
  );
} 