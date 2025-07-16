import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const TimelineContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const ExperienceItem = styled(motion.div)`
  position: relative;
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 1rem;
  class-name: glass-effect;
`;

export const Experience = () => {
  const experiences = [
    {
      role: "DevOps Engineer",
      company: "Teradata",
      period: "03/2022 - Current",
      highlights: [
        "Migrated IBM cloud Infra to AWS Cloud Infra",
        "Upgraded AWS EKS Cluster",
        "Managed containerized applications using Kubernetes"
      ]
    },
    // ... Add other experiences
  ];

  return (
    <TimelineContainer>
      {experiences.map((exp, index) => (
        <ExperienceItem
          key={index}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          viewport={{ once: true }}
        >
          <motion.h3>{exp.role}</motion.h3>
          <motion.h4>{exp.company}</motion.h4>
          <motion.p>{exp.period}</motion.p>
          <motion.ul>
            {exp.highlights.map((highlight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: (index * 0.2) + (i * 0.1) }}
              >
                {highlight}
              </motion.li>
            ))}
          </motion.ul>
        </ExperienceItem>
      ))}
    </TimelineContainer>
  );
};
