'use client';

import dynamic from 'next/dynamic';
import { Syncopate } from 'next/font/google';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';

const syncopate = Syncopate({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const MIN_LOADING_TIME = 2000; // 2 seconds minimum
const MAX_LOADING_TIME = 5000; // 5 seconds maximum

const LoadingScreen = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, MIN_LOADING_TIME);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen bg-[#ffc0eb] flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <h1 className={`${syncopate.className} text-4xl md:text-6xl font-bold text-white tracking-[0.2em] text-center`}>
          LVRBOY
        </h1>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -inset-8 bg-white/5 blur-2xl rounded-full"
        />
      </motion.div>
      <div className="mt-12 relative">
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white/40 rounded-full"
            animate={{
              x: [-192, 192],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-white/70 text-sm tracking-wider font-light"
        >
          Loading Experience...
        </motion.p>
      </div>
    </div>
  );
};

const Scene = dynamic(() => import('../components/Scene'), {
  loading: LoadingScreen,
  ssr: false
});

const DelayedScene = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, MIN_LOADING_TIME);

    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return <LoadingScreen />;
  }

  return <Scene />;
};

export default function Home() {
  return (
    <main>
      <DelayedScene />
    </main>
  );
} 