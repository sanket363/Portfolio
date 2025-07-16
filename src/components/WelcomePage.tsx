import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { catppuccinTheme } from '../styles/theme';

const WelcomeContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${catppuccinTheme.colors.base};
  color: ${catppuccinTheme.colors.text};
  padding: 2rem;
  overflow: hidden;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(
    45deg,
    ${catppuccinTheme.colors.mauve},
    ${catppuccinTheme.colors.pink}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SubTitle = styled(motion.p)`
  font-size: 1.5rem;
  color: ${catppuccinTheme.colors.subtext0};
  margin-bottom: 2rem;
`;

const FloatingIcons = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
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
      <FloatingIcons>
        {['⚙️', '🚀', '🔧', '📦', '☁️'].map((icon, index) => (
          <motion.span
            key={index}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          >
            {icon}
          </motion.span>
        ))}
      </FloatingIcons>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        DevOps Engineer
      </Title>
      <SubTitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Automating the future, one pipeline at a time
      </SubTitle>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: catppuccinTheme.colors.mauve,
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '2rem',
            color: catppuccinTheme.colors.base,
            cursor: 'pointer',
          }}
        >
          View Projects
        </motion.button>
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
