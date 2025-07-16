import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import styled from '@emotion/styled';
import { cyberpunkTheme } from '../styles/theme';

const Card = styled(motion.div)`
  background: ${cyberpunkTheme.colors.surface};
  border: 1px solid rgba(0, 255, 245, 0.2);
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${cyberpunkTheme.colors.gradient.primary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover:before {
    transform: scaleX(1);
  }
`;

export const ProjectCard = ({ project }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const springConfig = { damping: 25, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  function handleMouse(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    x.set(mouseX - rect.width / 2);
    y.set(mouseY - rect.height / 2);
  }

  return (
    <Card
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.h3
        style={{ color: cyberpunkTheme.colors.text.accent }}
        layoutId={`project-title-${project.id}`}
      >
        {project.title}
      </motion.h3>
      {/* Project content */}
    </Card>
  );
};
