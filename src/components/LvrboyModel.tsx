'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';

interface LvrboyModelProps {
  onLoad?: () => void;
}

export default function LvrboyModel({ onLoad }: LvrboyModelProps) {
  const group = useRef<Group>(null);
  const { nodes, materials } = useGLTF('/base_basic_shaded.glb');
  const [hovered, setHovered] = useState(false);
  const [faceHovered, setFaceHovered] = useState(false);

  useEffect(() => {
    if (nodes && materials && onLoad) {
      onLoad();
    }
  }, [nodes, materials, onLoad]);

  useFrame((state) => {
    if (group.current) {
      // Existing animation logic...
    }
  });

  return (
    <group 
      ref={group}
      dispose={null}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      {/* Your existing model JSX */}
    </group>
  );
}

useGLTF.preload('/base_basic_shaded.glb');
  