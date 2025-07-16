import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { getRepositories } from '../services/github';
import { cyberpunkTheme } from '../styles/theme';

const ProjectsContainer = styled(motion.div)`
  padding: 100px 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  background: ${cyberpunkTheme.colors.background};
  color: ${cyberpunkTheme.colors.textPrimary};
  min-height: 100vh;
`;

const ProjectCard = styled(motion.a)`
  background: ${cyberpunkTheme.colors.surface0};
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  text-decoration: none;
  color: ${cyberpunkTheme.colors.text};
`;

export const ProjectsPage: React.FC = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRepositories().then((data) => {
      setRepos(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="projects-page py-16 px-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">My Projects</h2>
        <ProjectsContainer>
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Loading...
            </motion.div>
          ) : (
            repos.map((repo: any, index) => (
              <ProjectCard
                href={repo.html_url}
                target="_blank"
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.h3 style={{ color: cyberpunkTheme.colors.mauve }}>
                  {repo.name}
                </motion.h3>
                <motion.p style={{ color: cyberpunkTheme.colors.subtext0 }}>
                  {repo.description || 'No description available'}
                </motion.p>
                <motion.div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {repo.topics?.map((topic: string) => (
                    <motion.span
                      key={topic}
                      style={{
                        background: cyberpunkTheme.colors.surface1,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
                      }}
                    >
                      {topic}
                    </motion.span>
                  ))}
                </motion.div>
              </ProjectCard>
            ))
          )}
        </ProjectsContainer>
      </div>
    </div>
  );
};

export default ProjectsPage;