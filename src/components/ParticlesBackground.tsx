import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const ParticlesBackground: React.FC = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      init={particlesInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        particles: {
          color: {
            value: '#CBA6F7',
          },
          links: {
            color: '#F5C2E7',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
          },
          size: {
            value: { min: 1, max: 3 },
          },
          opacity: {
            value: 0.5,
          },
        },
      }}
      className="absolute top-0 left-0 w-full h-full z-0"
    />
  );
};

export default ParticlesBackground;