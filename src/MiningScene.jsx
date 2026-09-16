import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// ভেক্টর স্টাইল গাছ (Stylized Tree)
function StylizedTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* গুঁড়ি (Trunk) */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 5]} />
        <meshToonMaterial color="#6d4c41" />
      </mesh>
      {/* পাতার লেয়ার ৩টি (Foliage) */}
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.5, 0.7, 5]} />
        <meshToonMaterial color="#2e7d32" />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.4, 0.6, 5]} />
        <meshToonMaterial color="#388e3c" />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <coneGeometry args={[0.25, 0.5, 5]} />
        <meshToonMaterial color="#4caf50" />
      </mesh>
    </group>
  );
}

// ভাসমান ভেক্টর মেঘ (Floating Vector Clouds)
function Cloud({ position, speed = 0.2 }) {
  const cloudRef = useRef();
  useFrame((state, delta) => {
    if (cloudRef.current) {
      cloudRef.current.position.x += delta * speed;
      if (cloudRef.current.position.x > 5) cloudRef.current.position.x = -5;
    }
  });

  return (
    <group ref={cloudRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 7, 7]} />
        <meshToonMaterial color="#ffffff" opacity={0.9} transparent />
      </mesh>
      <mesh position={[0.3, -0.05, 0]}>
        <sphereGeometry args={[0.3, 7, 7]} />
        <meshToonMaterial color="#ffffff" opacity={0.9} transparent />
      </mesh>
      <mesh position={[-0.3, -0.05, 0]}>
        <sphereGeometry args={[0.3, 7, 7]} />
        <meshToonMaterial color="#ffffff" opacity={0.9} transparent />
      </mesh>
    </group>
  );
}

// মাটির ভেতরের GRAM মাইনিং ক্রিস্টাল
function GramCrystal({ status }) {
  const crystalRef = useRef();

  useFrame((state, delta) => {
    if (crystalRef.current) {
      const speed = status === 'MINING' ? 3 : status === 'CLAIMABLE' ? 1.5 : 0.5;
      crystalRef.current.rotation.y += delta * speed;
    }
  });

  const crystalColor = status === 'CLAIMABLE' ? '#ffd700' : status === 'MINING' ? '#00f0ff' : '#00b4d8';

  return (
    <group position={[0, 0.8, 0]}>
      {/* মাটির পাথুরে বেস */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 0.4, 6]} />
        <meshToonMaterial color="#546e7a" />
      </mesh>

      {/* ভাসমান ও ঘূর্ণায়মান GRAM রত্ন */}
      <Float speed={status === 'MINING' ? 5 : 2} floatIntensity={status === 'MINING' ? 1.5 : 0.8}>
        <mesh ref={crystalRef} scale={status === 'MINING' ? 0.75 : 0.65}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color={crystalColor} 
            roughness={0.2} 
            metalness={0.8}
            emissive={crystalColor}
            emissiveIntensity={status === 'MINING' ? 0.8 : status === 'CLAIMABLE' ? 1.2 : 0.2}
            flatShading
          />
        </mesh>
      </Float>
    </group>
  );
}

// মূল প্রাকৃতিক দ্বীপ (Floating Natural Island)
export default function MiningScene({ status }) {
  const islandRef = useRef();

  useFrame((state, delta) => {
    // দ্বীপটি হালকা দোল খাবে
    if (islandRef.current) {
      islandRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <>
      {/* প্রাকৃতিক রোদ ও আলো */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 12, 5]} intensity={1.8} castShadow />
      <pointLight 
        position={[0, 1.5, 0]} 
        intensity={status === 'MINING' ? 5 : 1} 
        color={status === 'CLAIMABLE' ? '#ffd700' : '#00f0ff'} 
      />

      {/* ব্যাকগ্রাউন্ড মেঘ */}
      <Cloud position={[-3, 2.8, -2]} speed={0.15} />
      <Cloud position={[2, 3.4, -3]} speed={0.08} />

      {/* মূল দ্বীপ গ্রুপ */}
      <group ref={islandRef} position={[0, -0.6, 0]}>
        
        {/* উপরের সবুজ ঘাস (Grass Layer) */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[2.2, 2.3, 0.4, 8]} />
          <meshToonMaterial color="#55a630" />
        </mesh>

        {/* নিচের মাটি/পাথর স্তর (Soil / Dirt Layer) */}
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[2.3, 0.4, 1.6, 8]} />
          <meshToonMaterial color="#6f4e37" />
        </mesh>

        {/* চারপাশের গাছপালা (Trees around island) */}
        <StylizedTree position={[-1.2, 0.3, 0.8]} scale={0.7} />
        <StylizedTree position={[1.3, 0.3, 0.6]} scale={0.85} />
        <StylizedTree position={[-1.1, 0.3, -1]} scale={0.9} />
        <StylizedTree position={[1, 0.3, -1.1]} scale={0.75} />
        <StylizedTree position={[0, 0.3, -1.4]} scale={0.65} />

        {/* ছোট ছোট শিলা/পাথর */}
        <mesh position={[-0.7, 0.35, 0.6]} rotation={[0.4, 0.5, 0]}>
          <dodecahedronGeometry args={[0.2, 0]} />
          <meshToonMaterial color="#78909c" />
        </mesh>
        <mesh position={[0.8, 0.35, -0.4]} rotation={[0.2, 0.8, 0]}>
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshToonMaterial color="#90a4ae" />
        </mesh>

        {/* কেন্দ্রবিন্দু: মাটির ক্রিস্টাল মাইনার */}
        <GramCrystal status={status} />
      </group>

      {/* মাইনিং হলে প্রকৃতি থেকে উড়ে আসা আলোর স্পার্ক/স্পোর */}
      <Sparkles 
        count={status === 'MINING' ? 60 : 20} 
        scale={[4, 3, 4]} 
        position={[0, 1, 0]}
        size={status === 'MINING' ? 3.5 : 2} 
        speed={status === 'MINING' ? 2 : 0.6} 
        color={status === 'CLAIMABLE' ? '#ffd700' : '#48cae4'}
      />
    </>
  );
}
