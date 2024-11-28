'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import InteractiveButton from './InteractiveButton';
import { Archivo_Black } from 'next/font/google';

const archivo = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
});

const LvrboyModel = dynamic(() => import('./LvrboyModel'), {
  ssr: false,
  loading: () => null
});

const VimeoPlayer = dynamic(() => import('./VimeoPlayer'), {
  ssr: false,
  loading: () => null
});

function LoadingFallback() {
  return null;
}

export default function Scene() {
  const [showVideo, setShowVideo] = useState(false);

  const handleVideoClose = () => {
    setShowVideo(false);
  };

  return (
    <div className="relative w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={['#ffc0eb', 5, 15]} />
        <color attach="background" args={['#ffc0eb']} />
        
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <LvrboyModel />
          
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={7}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            autoRotate={false}
            enableTouchRotate={true}
            enableTouchZoom={true}
            touchStart={() => {
              // Optional: Add touch start handling
            }}
            touchEnd={() => {
              // Optional: Add touch end handling
            }}
          />
        </Suspense>
      </Canvas>

      <div className="absolute top-6 left-0 right-0 z-10 pointer-events-none px-4">
        <h1 
          className={`
            flex 
            items-center 
            justify-center 
            text-[4rem] 
            md:text-[6rem] 
            lg:text-[8rem] 
            font-black
            tracking-[0.15em] 
            text-white
            text-center 
            uppercase 
            select-none
            [text-shadow:_0_0_40px_rgba(255,255,255,0.4),_4px_4px_2px_rgba(0,0,0,0.15)]
            transition-all
            duration-300
            hover:tracking-[0.2em]
            hover:[text-shadow:_0_0_60px_rgba(255,255,255,0.6),_4px_4px_2px_rgba(0,0,0,0.2)]
            ${archivo.className}
          `}
          style={{
            fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
            fontVariantCaps: 'all-small-caps',
          }}
        >
          <span className="mr-1 md:mr-2 relative">
            LVRB
            <span className="absolute -inset-2 bg-white/10 blur-xl rounded-lg"></span>
          </span>
          <InteractiveButton onClick={() => setShowVideo(true)} />
          <span className="ml-1 md:ml-2 relative">
            Y
            <span className="absolute -inset-2 bg-white/10 blur-xl rounded-lg"></span>
          </span>
        </h1>
      </div>

      {showVideo && (
        <VimeoPlayer
          videoId="1015025973"
          onClose={handleVideoClose}
        />
      )}
    </div>
  );
} 