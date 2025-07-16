import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import anime from 'animejs';
import { useEffect, useRef } from 'react';

const PreloaderWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.colors.base};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const Preloader = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    anime({
      targets: elementRef.current,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: function(el, i) { return i * 250 },
      direction: 'alternate',
      loop: true
    });
  }, []);

  return (
    <PreloaderWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <svg ref={elementRef} width="100" height="100" viewBox="0 0 100 100">
        <path
          fill="none"
          stroke={catppuccinTheme.colors.mauve}
          strokeWidth="4"
          d="M25,2 L2,2 L2,98 L98,98 L98,2 L75,2"
        />
      </svg>
    </PreloaderWrapper>
  );
};
