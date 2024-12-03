'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VimeoPlayerProps {
  videoId: string;
  onClose: () => void;
}

export default function VimeoPlayer({ videoId, onClose }: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    // Preload the video iframe
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'iframe';
    link.href = `https://player.vimeo.com/video/${videoId}`;
    document.head.appendChild(link);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      document.head.removeChild(link);
    };
  }, [onClose, videoId]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-md z-50 p-4 md:p-6"
        role="dialog"
        aria-modal="true"
      >
        <motion.div 
          ref={containerRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden shadow-2xl bg-black"
        >
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors touch-manipulation backdrop-blur-sm"
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

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                <div className="mt-4 text-white/80 text-sm font-light">Loading video...</div>
              </div>
            </div>
          )}

          <div className="absolute inset-0">
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0&quality=1080p&dnt=1&controls=1&app_id=122963&autopause=0&background=0&loop=0&muted=0&transparent=0&responsive=1&playsinline=1`}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="eager"
              onLoad={handleIframeLoad}
              style={{
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out'
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 