'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import InteractiveButton from './InteractiveButton';
import { Archivo_Black } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';

const archivo = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
});

// Dynamic imports with noSSR option
const LvrboyModel = dynamic(() => import('./LvrboyModel').then(mod => mod.default), {
  ssr: false,
  loading: () => null
});

const VimeoPlayer = dynamic(() => import('./VimeoPlayer').then(mod => mod.default), {
  ssr: false,
  loading: () => null
});

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white text-xl">Loading model...</div>
    </div>
  );
}

export default function Scene() {
  const [showVideo, setShowVideo] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);

  const handleVideoClose = () => {
    setShowVideo(false);
  };

  return (
    <div className="relative w-full h-screen bg-[#ffc0eb]">
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
          
          <LvrboyModel onLoad={() => setIsModelLoading(false)} />
          
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={7}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            autoRotate={false}
            makeDefault
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
            text-[#ffffff]
            text-center 
            uppercase 
            select-none
            transition-all
            duration-300
            hover:tracking-[0.2em]
            ${archivo.className}
          `}
          style={{
            fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
            fontVariantCaps: 'all-small-caps',
          }}
        >
          <span className="mr-1 md:mr-2">
            LVRB
          </span>
          <InteractiveButton onClick={() => setShowVideo(true)} />
          <span className="ml-1 md:ml-2">
            Y
          </span>
        </h1>
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-10 text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white text-base tracking-[0.2em] font-light flex items-center justify-center gap-1 hover:tracking-[0.25em] transition-all duration-300 group"
        >
          <span className="relative inline-block">
            LVRBOY
            <span className="absolute -inset-4 bg-white/5 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </span>
          <span className="relative inline-flex items-start">
            <span className="text-sm align-super ml-0.5 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80 font-medium">©</span>
            <span className="absolute -inset-2 bg-white/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </span>
        </motion.p>
      </div>

      <AnimatePresence mode="wait">
        {showVideo && (
          <VimeoPlayer
            videoId="1035273314"
            onClose={handleVideoClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 