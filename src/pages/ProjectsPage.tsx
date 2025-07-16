import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { catppuccinTheme } from '../styles/theme';

const ProjectsContainer = styled(motion.div)`
  padding: 100px 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  background: ${catppuccinTheme.colors.base};
  min-height: 100vh;
`;

const ProjectCard = styled(motion.div)`
  background: ${catppuccinTheme.colors.surface0};
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
`;

const projects = [
  {
    title: "CI/CD Pipeline Automation",
    description: "Automated deployment pipeline using Jenkins, Docker, and Kubernetes",
    tech: ["Jenkins", "Docker", "K8s"]
  },
  // Add more projects...
];

const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-page py-16 px-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">My Projects</h2>
        <ProjectsContainer>
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.h3>{project.title}</motion.h3>
              <motion.p>{project.description}</motion.p>
              <motion.div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {project.tech.map((tech) => (
                  <motion.span
                    key={tech}
                    style={{
                      background: catppuccinTheme.colors.surface1,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.5rem',
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>
            </ProjectCard>
          ))}
        </ProjectsContainer>
      </div>
    </div>
  );
};

export default ProjectsPage;