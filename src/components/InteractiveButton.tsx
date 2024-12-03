'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface InteractiveButtonProps {
  onClick: () => void;
}

export default function InteractiveButton({ onClick }: InteractiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Subtle floating animation when not hovered
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
        duration-500
        transform
        ${isHovered ? 'scale-110' : 'scale-100'}
        ${isAnimating && !isHovered ? 'translate-y-[-4px]' : 'translate-y-0'}
        hover:rotate-[360deg]
        group
        mx-1
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Show Easter Egg Video"
    >
      {/* Orbital rings effect */}
      <div
        className={`
          absolute
          inset-0
          rounded-full
          transition-all
          duration-700
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div className="absolute inset-0 rounded-full border border-white/30 animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-0 rounded-full border border-white/20 animate-[spin_4s_linear_infinite_reverse]" style={{ transform: 'scale(1.1)' }} />
        <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_3s_linear_infinite]" style={{ transform: 'scale(1.2)' }} />
      </div>

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
          duration-500
          ${isHovered ? 'brightness-125 contrast-125' : ''}
          group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]
          rounded-full
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
          transition-all
          duration-300
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        Click me!
      </span>
    </button>
  );
} 