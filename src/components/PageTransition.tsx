import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const PageWrapper = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const pageVariants = {
  initial: {
    opacity: 0,
    x: '-100%',
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: '100%',
    scale: 1.2
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

export const PageTransition = ({ children }) => {
  return (
    <PageWrapper
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </PageWrapper>
  );
};
