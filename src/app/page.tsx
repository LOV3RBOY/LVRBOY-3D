'use client';

import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('../components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#ffc0eb] flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  )
});

export default function Home() {
  return (
    <main>
      <Scene />
    </main>
  );
} 