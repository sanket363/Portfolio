import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const Grid = () => {
  const gridRef = useRef<THREE.GridHelper>();
  
  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.position.z = (clock.getElapsedTime() * 0.5) % 1;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[100, 100, '#ff00ff', '#00fff5']}
      position={[0, -5, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    />
  );
};

export const Background = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <fog attach="fog" args={['#0a0a0f', 5, 15]} />
        <Grid />
      </Canvas>
    </div>
  );
};
