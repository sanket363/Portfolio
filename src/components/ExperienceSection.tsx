import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { experience } from '../data/experience';
import { catppuccinTheme } from '../styles/theme';

const TimelineContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  padding-left: 2rem;
  border-left: 2px solid ${catppuccinTheme.colors.mauve};
  margin-bottom: 2rem;
`;

export const ExperienceSection = () => {
  return (
    <TimelineContainer>
      {experience.map((exp, index) => (
        <TimelineItem
          key={index}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <motion.h3 style={{ color: catppuccinTheme.colors.mauve }}>
            {exp.role} @ {exp.company}
          </motion.h3>
          <motion.p style={{ color: catppuccinTheme.colors.subtext0 }}>
            {exp.duration}
          </motion.p>
          <motion.ul style={{ marginTop: '1rem' }}>
            {exp.description.map((desc, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + i * 0.1 }}
              >
                {desc}
              </motion.li>
            ))}
          </motion.ul>
        </TimelineItem>
      ))}
    </TimelineContainer>
  );
};
