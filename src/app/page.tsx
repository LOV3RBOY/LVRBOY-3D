import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white text-xl">Loading 3D Scene...</div>
    </div>
  ),
  timeout: 20000 // 20 seconds timeout
});

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#ffc0eb]">
      <div className="absolute inset-0">
        <Scene />
      </div>
    </main>
  );
} 