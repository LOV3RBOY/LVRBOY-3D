'use client';

import { useEffect, useRef } from 'react';

interface VimeoPlayerProps {
  videoId: string;
  onClose: () => void;
}

export default function VimeoPlayer({ videoId, onClose }: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Handle touch events for mobile
    const handleTouchOutside = (event: TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('touchstart', handleTouchOutside);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('touchstart', handleTouchOutside);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={containerRef}
        className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors touch-manipulation"
          aria-label="Close video"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 md:h-6 md:w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
        <div className="absolute inset-0">
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?h=&autoplay=1&title=0&byline=0&portrait=0`}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
} 