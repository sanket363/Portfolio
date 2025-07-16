import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styled from '@emotion/styled';
import { cyberpunkTheme } from '../styles/theme';

const HeroContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: ${cyberpunkTheme.colors.background};
  color: ${cyberpunkTheme.colors.textPrimary};
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  background: linear-gradient(45deg, #CBA6F7, #F5C2E7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SubTitle = styled(motion.p)`
  font-size: 1.5rem;
  color: ${cyberpunkTheme.colors.subtext0};
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
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-item', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <HeroContainer
      ref={containerRef}
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
        Sanket Bhalke
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
            background: cyberpunkTheme.colors.mauve,
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '2rem',
            color: cyberpunkTheme.colors.base,
            cursor: 'pointer',
          }}
        >
          View Projects
        </motion.button>
      </motion.div>
    </HeroContainer>
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
