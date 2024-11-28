'use client';

import { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface LvrboyModelProps {
  onEasterEggFound?: () => void;
}

export default function LvrboyModel({ onEasterEggFound }: LvrboyModelProps) {
  const group = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const lastClickTime = useRef(0);
  const faceMesh = useRef<THREE.Mesh | null>(null);
  const originalMaterial = useRef<THREE.Material | null>(null);
  
  const { scene } = useGLTF('/base_basic_shaded.glb', true);

  // Initialize face mesh and materials
  useEffect(() => {
    if (!scene) return;

    // Find face/head mesh
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;

        // Look for face/head mesh by name
        const name = child.name.toLowerCase();
        if (name.includes('face') || name.includes('head')) {
          console.log('Found face mesh:', child.name);
          faceMesh.current = child;

          // Store original material and create new lightened material
          if (child.material instanceof THREE.Material) {
            // Clone the original material
            const newMaterial = child.material.clone();
            originalMaterial.current = newMaterial.clone();
            
            // Lighten the material significantly
            if (newMaterial instanceof THREE.MeshStandardMaterial) {
              // Increase base brightness substantially
              newMaterial.color.setHSL(
                newMaterial.color.getHSL({ h: 0, s: 0, l: 0 }).h,
                0.05, // Very low saturation for brightness
                0.9  // High lightness
              );
              
              // Adjust material properties for better light reflection
              newMaterial.metalness = 0.2;  // Increased for better light interaction
              newMaterial.roughness = 0.2;  // Reduced for more shine
              
              // Add stronger emissive glow
              newMaterial.emissive = new THREE.Color('#ffffff');
              newMaterial.emissiveIntensity = 0.2;  // Increased base glow
            }
            
            child.material = newMaterial;
          }
        }
      }
    });

    setModelLoaded(true);

    return () => {
      if (originalMaterial.current) originalMaterial.current.dispose();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    };
  }, [scene]);

  // Face hover animation
  useFrame((state) => {
    if (!faceMesh.current || !hovered) return;

    const time = state.clock.getElapsedTime();
    
    // Gentle scale pulsing
    const scale = 1 + Math.sin(time * 3) * 0.01;
    faceMesh.current.scale.setScalar(scale);

    // Enhanced emissive glow pulsing
    if (faceMesh.current.material instanceof THREE.MeshStandardMaterial) {
      faceMesh.current.material.emissiveIntensity = 0.2 + Math.sin(time * 2) * 0.1;
    }
  });

  const handlePointerOver = (event: THREE.Event) => {
    event.stopPropagation();
    const mesh = event.object as THREE.Mesh;
    
    if (mesh === faceMesh.current) {
      setHovered(true);
      document.body.style.cursor = 'pointer';

      // Enhanced hover animation
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(mesh.material, {
          emissiveIntensity: 0.4,  // Increased glow on hover
          roughness: 0.1,          // More shine on hover
          duration: 0.3
        });
        gsap.to(mesh.scale, {
          x: 1.02,
          y: 1.02,
          z: 1.02,
          duration: 0.3
        });
      }
    }
  };

  const handlePointerOut = (event: THREE.Event) => {
    event.stopPropagation();
    const mesh = event.object as THREE.Mesh;
    
    if (mesh === faceMesh.current) {
      setHovered(false);
      document.body.style.cursor = 'auto';

      // Reset material properties
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(mesh.material, {
          emissiveIntensity: 0.2,
          roughness: 0.2,
          duration: 0.3
        });
        gsap.to(mesh.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.3
        });
      }
    }
  };

  const handleClick = (event: THREE.Event) => {
    event.stopPropagation();
    const mesh = event.object as THREE.Mesh;
    
    if (mesh !== faceMesh.current) return;

    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime.current;

    if (timeSinceLastClick < 300) { // Double click detected
      // Enhanced celebration animation
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        // Bright flash effect
        gsap.to(mesh.material, {
          emissiveIntensity: 0.8,  // Brighter flash
          roughness: 0.1,
          duration: 0.2,
          yoyo: true,
          repeat: 3,
          onComplete: () => {
            gsap.to(mesh.material, {
              emissiveIntensity: 0.2,
              roughness: 0.2,
              duration: 0.3
            });
          }
        });

        // Pop effect
        gsap.to(mesh.scale, {
          x: 1.1,
          y: 1.1,
          z: 1.1,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            onEasterEggFound?.();
          }
        });
      }
    }
    
    lastClickTime.current = currentTime;
  };

  if (!scene || !modelLoaded) {
    return null;
  }

  return (
    <group ref={group}>
      {/* Main face light */}
      <pointLight
        position={[0, 0.5, 2]}
        intensity={1}           // Increased intensity
        distance={4}
        decay={1.5}
        color="#ffffff"
      />
      
      {/* Additional rim light for better definition */}
      <pointLight
        position={[1, 0.5, -1]}
        intensity={0.5}
        distance={3}
        decay={2}
        color="#ffffff"
      />
      
      {/* Fill light for shadows */}
      <pointLight
        position={[-1, 0, 1]}
        intensity={0.3}
        distance={3}
        decay={2}
        color="#ffffff"
      />
      
      <primitive 
        object={scene} 
        scale={1.2} 
        position={[0, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
    </group>
  );
}

// Preload model
useGLTF.preload('/base_basic_shaded.glb');
  