import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { catppuccinTheme } from '../styles/theme';

const WelcomeContainer = styled(motion.div)`
  background: ${catppuccinTheme.colors.base};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${catppuccinTheme.colors.text};
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export const WelcomePage = () => {
  return (
    <WelcomeContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Title variants={itemVariants}>
        DevOps Portfolio
      </Title>
      <motion.div variants={itemVariants}>
        <ContinuousDeploymentAnimation />
      </motion.div>
    </WelcomeContainer>
  );
};

const ContinuousDeploymentAnimation = () => {
  return (
    <motion.svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      animate={{
        rotate: 360
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {/* Add DevOps-themed SVG elements here */}
    </motion.svg>
  );
};
