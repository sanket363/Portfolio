import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from 'framer-motion';
import styled from '@emotion/styled';
import { getRepositories } from '../services/github';
import { cyberpunkTheme } from '../styles/theme';

// Types
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  size: number;
}

interface ProjectStats {
  totalProjects: number;
  totalStars: number;
  totalForks: number;
  languages: string[];
}

// Styled Components
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background: ${cyberpunkTheme.colors.background};
  color: ${cyberpunkTheme.colors.textPrimary};
  padding: 2rem;
  position: relative;
  overflow-x: hidden;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${cyberpunkTheme.colors.mauve}, ${cyberpunkTheme.colors.blue});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Controls = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const SearchInput = styled(motion.input)`
  background: ${cyberpunkTheme.colors.surface0};
  border: 2px solid transparent;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: ${cyberpunkTheme.colors.textPrimary};
  font-size: 1rem;
  min-width: 300px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${cyberpunkTheme.colors.mauve};
    box-shadow: 0 0 20px ${cyberpunkTheme.colors.mauve}40;
  }
  
  &::placeholder {
    color: ${cyberpunkTheme.colors.subtext0};
  }
  
  @media (max-width: 768px) {
    min-width: 250px;
  }
`;

const FilterButton = styled(motion.button)<{ active: boolean }>`
  background: ${props => props.active ? cyberpunkTheme.colors.mauve : cyberpunkTheme.colors.surface0};
  color: ${props => props.active ? cyberpunkTheme.colors.background : cyberpunkTheme.colors.textPrimary};
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${cyberpunkTheme.colors.mauve}40;
  }
`;

const ViewToggle = styled(motion.div)`
  display: flex;
  background: ${cyberpunkTheme.colors.surface0};
  border-radius: 0.5rem;
  padding: 0.25rem;
`;

const ViewButton = styled(motion.button)<{ active: boolean }>`
  background: ${props => props.active ? cyberpunkTheme.colors.mauve : 'transparent'};
  color: ${props => props.active ? cyberpunkTheme.colors.background : cyberpunkTheme.colors.textPrimary};
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: ${cyberpunkTheme.colors.surface0};
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid ${cyberpunkTheme.colors.surface1};
`;

const StatNumber = styled(motion.div)`
  font-size: 2rem;
  font-weight: 800;
  color: ${cyberpunkTheme.colors.mauve};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${cyberpunkTheme.colors.subtext0};
  font-size: 0.9rem;
`;

const ProjectsGrid = styled(motion.div)<{ view: string }>`
  display: grid;
  grid-template-columns: ${props => 
    props.view === 'grid' ? 'repeat(auto-fit, minmax(350px, 1fr))' :
    props.view === 'list' ? '1fr' :
    'repeat(auto-fit, minmax(300px, 1fr))'
  };
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ProjectCard = styled(motion.div)<{ view: string }>`
  background: ${cyberpunkTheme.colors.surface0};
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid ${cyberpunkTheme.colors.surface1};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: ${props => props.view === 'list' ? 'flex' : 'block'};
  align-items: ${props => props.view === 'list' ? 'center' : 'stretch'};
  gap: ${props => props.view === 'list' ? '1rem' : '0'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, ${cyberpunkTheme.colors.mauve}10, ${cyberpunkTheme.colors.blue}10);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const ProjectHeader = styled.div<{ view: string }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.view === 'list' ? '0' : '1rem'};
  flex: ${props => props.view === 'list' ? '1' : 'none'};
`;

const ProjectTitle = styled(motion.h3)`
  color: ${cyberpunkTheme.colors.mauve};
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const ProjectDescription = styled(motion.p)`
  color: ${cyberpunkTheme.colors.subtext0};
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.875rem;
  color: ${cyberpunkTheme.colors.subtext1};
  margin-bottom: 1rem;
`;

const ProjectTopics = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Topic = styled(motion.span)`
  background: ${cyberpunkTheme.colors.surface1};
  color: ${cyberpunkTheme.colors.textPrimary};
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.a)`
  background: ${cyberpunkTheme.colors.mauve};
  color: ${cyberpunkTheme.colors.background};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${cyberpunkTheme.colors.blue};
    transform: translateY(-2px);
  }
`;

const LoadingCard = styled(motion.div)`
  background: ${cyberpunkTheme.colors.surface0};
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid ${cyberpunkTheme.colors.surface1};
`;

const SkeletonLine = styled(motion.div)<{ width?: string }>`
  height: 1rem;
  background: ${cyberpunkTheme.colors.surface1};
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  width: ${props => props.width || '100%'};
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: ${cyberpunkTheme.colors.surface0};
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${cyberpunkTheme.colors.textPrimary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  
  &:hover {
    background: ${cyberpunkTheme.colors.surface1};
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.98
  }
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2
    }
  }
};

// Counter animation hook
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return count;
};

// Main component
export const EnhancedProjectsPage: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [view, setView] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [selectedProject, setSelectedProject] = useState<GitHubRepo | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  
  // Fetch repositories
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const data = await getRepositories();
        setRepos(data);
        setFilteredRepos(data);
      } catch (error) {
        console.error('Failed to fetch repositories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRepos();
  }, []);
  
  // Filter and sort repositories
  useEffect(() => {
    let filtered = repos.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesLanguage = selectedLanguage === 'all' || repo.language === selectedLanguage;
      return matchesSearch && matchesLanguage;
    });
    
    // Sort repositories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });
    
    setFilteredRepos(filtered);
  }, [repos, searchTerm, selectedLanguage, sortBy]);
  
  // Calculate statistics
  const stats: ProjectStats = useMemo(() => {
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];
    
    return {
      totalProjects: repos.length,
      totalStars,
      totalForks,
      languages
    };
  }, [repos]);
  
  // Animated counters
  const animatedProjects = useCounter(stats.totalProjects);
  const animatedStars = useCounter(stats.totalStars);
  const animatedForks = useCounter(stats.totalForks);
  const animatedLanguages = useCounter(stats.languages.length);
  
  // Get unique languages for filter
  const languages = useMemo(() => {
    return [...new Set(repos.map(repo => repo.language).filter(Boolean))];
  }, [repos]);
  
  // Load more projects (infinite scroll simulation)
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 12, filteredRepos.length));
  }, [filteredRepos.length]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);
  
  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <ProjectsGrid view={view}>
      {Array.from({ length: 6 }).map((_, index) => (
        <LoadingCard
          key={index}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <SkeletonLine width="60%" />
          <SkeletonLine width="100%" />
          <SkeletonLine width="80%" />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <SkeletonLine width="60px" />
            <SkeletonLine width="80px" />
            <SkeletonLine width="70px" />
          </div>
        </LoadingCard>
      ))}
    </ProjectsGrid>
  );
  
  // Render project card
  const renderProjectCard = (repo: GitHubRepo, index: number) => (
    <ProjectCard
      key={repo.id}
      view={view}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      transition={{ delay: index * 0.05 }}
      onClick={() => setSelectedProject(repo)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setSelectedProject(repo);
        }
      }}
      aria-label={`View details for ${repo.name}`}
    >
      <ProjectHeader view={view}>
        <div style={{ flex: 1 }}>
          <ProjectTitle
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.1 }}
          >
            {repo.name}
          </ProjectTitle>
          <ProjectMeta>
            <span>⭐ {repo.stargazers_count}</span>
            <span>🍴 {repo.forks_count}</span>
            {repo.language && <span>💻 {repo.language}</span>}
          </ProjectMeta>
        </div>
      </ProjectHeader>
      
      <ProjectDescription
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 + 0.2 }}
      >
        {repo.description || 'No description available'}
      </ProjectDescription>
      
      {repo.topics && repo.topics.length > 0 && (
        <ProjectTopics>
          {repo.topics.slice(0, 5).map((topic, topicIndex) => (
            <Topic
              key={topic}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.3 + topicIndex * 0.05 }}
              whileHover={{ scale: 1.1 }}
            >
              {topic}
            </Topic>
          ))}
        </ProjectTopics>
      )}
      
      <ProjectActions>
        <ActionButton
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Code
        </ActionButton>
        {repo.homepage && (
          <ActionButton
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Live Demo
          </ActionButton>
        )}
      </ProjectActions>
    </ProjectCard>
  );
  
  return (
    <PageContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header ref={headerRef}>
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          My Projects
        </Title>
        
        {!loading && (
          <StatsContainer
            variants={containerVariants}
            initial="hidden"
            animate={isHeaderInView ? "visible" : "hidden"}
          >
            <StatCard variants={itemVariants}>
              <StatNumber>{animatedProjects}</StatNumber>
              <StatLabel>Projects</StatLabel>
            </StatCard>
            <StatCard variants={itemVariants}>
              <StatNumber>{animatedStars}</StatNumber>
              <StatLabel>Stars</StatLabel>
            </StatCard>
            <StatCard variants={itemVariants}>
              <StatNumber>{animatedForks}</StatNumber>
              <StatLabel>Forks</StatLabel>
            </StatCard>
            <StatCard variants={itemVariants}>
              <StatNumber>{animatedLanguages}</StatNumber>
              <StatLabel>Languages</StatLabel>
            </StatCard>
          </StatsContainer>
        )}
      </Header>
      
      {!loading && (
        <Controls
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <SearchInput
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variants={itemVariants}
            whileFocus={{ scale: 1.02 }}
          />
          
          <motion.select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            variants={itemVariants}
            style={{
              background: cyberpunkTheme.colors.surface0,
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              color: cyberpunkTheme.colors.textPrimary
            }}
          >
            <option value="all">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </motion.select>
          
          <motion.select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            variants={itemVariants}
            style={{
              background: cyberpunkTheme.colors.surface0,
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              color: cyberpunkTheme.colors.textPrimary
            }}
          >
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
            <option value="name">Name</option>
            <option value="stars">Stars</option>
          </motion.select>
          
          <ViewToggle variants={itemVariants}>
            <ViewButton
              active={view === 'grid'}
              onClick={() => setView('grid')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Grid
            </ViewButton>
            <ViewButton
              active={view === 'list'}
              onClick={() => setView('list')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              List
            </ViewButton>
            <ViewButton
              active={view === 'timeline'}
              onClick={() => setView('timeline')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Timeline
            </ViewButton>
          </ViewToggle>
        </Controls>
      )}
      
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderLoadingSkeleton()}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProjectsGrid view={view}>
              {filteredRepos.slice(0, visibleCount).map((repo, index) => 
                renderProjectCard(repo, index)
              )}
            </ProjectsGrid>
            
            {visibleCount < filteredRepos.length && (
              <motion.div
                style={{ textAlign: 'center', marginTop: '2rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FilterButton
                  active={false}
                  onClick={loadMore}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Load More Projects
                </FilterButton>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <Modal
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setSelectedProject(null)}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
            >
              <CloseButton
                onClick={() => setSelectedProject(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </CloseButton>
              
              <motion.h2
                style={{ color: cyberpunkTheme.colors.mauve, marginBottom: '1rem' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {selectedProject.name}
              </motion.h2>
              
              <motion.p
                style={{ color: cyberpunkTheme.colors.subtext0, marginBottom: '1rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {selectedProject.description || 'No description available'}
              </motion.p>
              
              <motion.div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <strong>Language:</strong> {selectedProject.language || 'N/A'}
                </div>
                <div>
                  <strong>Stars:</strong> {selectedProject.stargazers_count}
                </div>
                <div>
                  <strong>Forks:</strong> {selectedProject.forks_count}
                </div>
                <div>
                  <strong>Size:</strong> {Math.round(selectedProject.size / 1024)} KB
                </div>
              </motion.div>
              
              {selectedProject.topics && selectedProject.topics.length > 0 && (
                <motion.div
                  style={{ marginBottom: '1rem' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Topics:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedProject.topics.map((topic, index) => (
                      <Topic
                        key={topic}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        {topic}
                      </Topic>
                    ))}
                  </div>
                </motion.div>
              )}
              
              <motion.div
                style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ActionButton
                  href={selectedProject.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View on GitHub
                </ActionButton>
                {selectedProject.homepage && (
                  <ActionButton
                    href={selectedProject.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Live Demo
                  </ActionButton>
                )}
              </motion.div>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default EnhancedProjectsPage;