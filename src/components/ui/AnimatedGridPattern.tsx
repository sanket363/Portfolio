import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';

interface AnimatedGridPatternProps {
  size?: number;
  spacing?: number;
  color?: string;
  speed?: number;
}

const GridPoints: React.FC<AnimatedGridPatternProps> = ({
  size = 100,
  spacing = 1,
  color = '#ffffff',
  speed = 0.1,
}) => {
  const ref = useRef<any>();

  const positions = useMemo(() => {
    const numPoints = size * size;
    const arr = new Float32Array(numPoints * 3);
    let i = 0;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        arr[i++] = (x - size / 2) * spacing;
        arr[i++] = (y - size / 2) * spacing;
        arr[i++] = random.float(-1, 1); // Add some random depth
      }
    }
    return arr;
  }, [size, spacing]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color={color}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
};

export const AnimatedGridPattern: React.FC<AnimatedGridPatternProps> = (props) => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <GridPoints {...props} />
    </Canvas>
  );
};