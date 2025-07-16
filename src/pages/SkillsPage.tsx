import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { cyberpunkTheme } from '../styles/theme';

const SkillsContainer = styled(motion.div)`
  background: ${cyberpunkTheme.colors.background};
  color: ${cyberpunkTheme.colors.textPrimary};
  min-height: 100vh;
`;

const SkillGroup = styled(motion.div)`
  margin-bottom: 2rem;
`;

const skills = {
  "Cloud & Infrastructure": ["AWS", "Docker", "Kubernetes", "Terraform"],
  "CI/CD & Automation": ["Jenkins", "GitLab CI", "Ansible", "Shell Scripting"],
  "Monitoring & Logging": ["Grafana", "Prometheus", "ELK Stack"],
  "Programming": ["Python", "JavaScript/TypeScript", "Bash"],
  "Version Control": ["Git", "GitHub", "GitLab"]
};

export const SkillsPage: React.FC = () => {
  return (
    <SkillsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {Object.entries(skills).map(([category, skillList], index) => (
        <SkillGroup
          key={category}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 }}
        >
          <h2 style={{ color: cyberpunkTheme.colors.accent, marginBottom: '1rem' }}>
            {category}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {skillList.map((skill) => (
              <motion.div
                key={skill}
                whileHover={{ scale: 1.1 }}
                style={{
                  background: cyberpunkTheme.colors.card,
                  padding: '0.5rem 1rem',
                  borderRadius: '1rem',
                  color: cyberpunkTheme.colors.textPrimary
                }}
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </SkillGroup>
      ))}
    </SkillsContainer>
  );
};
};
