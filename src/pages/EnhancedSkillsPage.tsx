import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
import styled from '@emotion/styled';
import { cyberpunkTheme } from '../styles/theme';
import { 
  Cloud, 
  Server, 
  Shield, 
  Code, 
  HardHat, 
  GitBranch, 
  Monitor, 
  Database, 
  Cpu, 
  Network,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

// Styled Components
const SkillsContainer = styled(motion.div)`
  background: ${cyberpunkTheme.colors.background};
  color: ${cyberpunkTheme.colors.textPrimary};
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  overflow-x: hidden;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: bold;
  background: ${cyberpunkTheme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ControlPanel = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${cyberpunkTheme.glassmorphism.border};
  backdrop-filter: blur(${cyberpunkTheme.glassmorphism.blurLevels.medium});
  border-radius: 1rem;
  border: ${cyberpunkTheme.glassmorphism.border};
`;

const SearchInput = styled(motion.input)`
  background: ${cyberpunkTheme.colors.surface};
  border: 2px solid transparent;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: ${cyberpunkTheme.colors.textPrimary};
  font-size: 1rem;
  min-width: 250px;
  
  &:focus {
    outline: none;
    border-color: ${cyberpunkTheme.colors.primary};
    box-shadow: ${cyberpunkTheme.shadows.neon};
  }
  
  &::placeholder {
    color: ${cyberpunkTheme.colors.textSecondary};
  }
`;

const FilterButton = styled(motion.button)<{ active?: boolean }>`
  background: ${props => props.active ? cyberpunkTheme.colors.primary : cyberpunkTheme.colors.surface};
  color: ${props => props.active ? cyberpunkTheme.colors.background : cyberpunkTheme.colors.textPrimary};
  border: 2px solid ${props => props.active ? cyberpunkTheme.colors.primary : 'transparent'};
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${cyberpunkTheme.animations.durations.normal};
  
  &:hover {
    background: ${props => props.active ? cyberpunkTheme.colors.primary : cyberpunkTheme.stateColors.hover};
    box-shadow: ${cyberpunkTheme.shadows.hover};
  }
`;

const ViewModeButton = styled(FilterButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const SkillCard = styled(motion.div)`
  background: ${cyberpunkTheme.glassmorphism.border};
  backdrop-filter: blur(${cyberpunkTheme.glassmorphism.blurLevels.medium});
  border: ${cyberpunkTheme.glassmorphism.border};
  border-radius: 1rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${cyberpunkTheme.gradients.primary};
    opacity: 0;
    transition: opacity ${cyberpunkTheme.animations.durations.normal};
    z-index: -1;
  }
  
  &:hover::before {
    opacity: 0.1;
  }
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SkillIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const SkillLevel = styled(motion.div)`
  font-size: 0.875rem;
  color: ${cyberpunkTheme.colors.textSecondary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${cyberpunkTheme.colors.surface};
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled(motion.div)<{ level: number }>`
  height: 100%;
  background: ${cyberpunkTheme.gradients.primary};
  border-radius: 4px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SkillTag = styled(motion.span)`
  background: ${cyberpunkTheme.colors.surface};
  color: ${cyberpunkTheme.colors.textSecondary};
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  border: 1px solid ${cyberpunkTheme.colors.primary}40;
`;

const TimelineContainer = styled(motion.div)`
  position: relative;
  padding: 2rem 0;
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
`;

const TimelineDot = styled(motion.div)`
  width: 16px;
  height: 16px;
  background: ${cyberpunkTheme.colors.primary};
  border-radius: 50%;
  margin-right: 2rem;
  box-shadow: ${cyberpunkTheme.shadows.neon};
  z-index: 2;
`;

const TimelineLine = styled(motion.div)`
  position: absolute;
  left: 8px;
  top: 16px;
  bottom: -16px;
  width: 2px;
  background: ${cyberpunkTheme.colors.primary}40;
`;

const ComparisonChart = styled(motion.div)`
  background: ${cyberpunkTheme.glassmorphism.border};
  backdrop-filter: blur(${cyberpunkTheme.glassmorphism.blurLevels.medium});
  border: ${cyberpunkTheme.glassmorphism.border};
  border-radius: 1rem;
  padding: 2rem;
  margin: 2rem 0;
`;

const ChartBar = styled(motion.div)<{ value: number; maxValue: number }>`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  .label {
    min-width: 120px;
    font-weight: 600;
  }
  
  .bar {
    flex: 1;
    height: 24px;
    background: ${cyberpunkTheme.colors.surface};
    border-radius: 12px;
    margin: 0 1rem;
    overflow: hidden;
    position: relative;
  }
  
  .fill {
    height: 100%;
    background: ${cyberpunkTheme.gradients.primary};
    border-radius: 12px;
    width: ${props => (props.value / props.maxValue) * 100}%;
    transition: width 1s ease-out;
  }
  
  .value {
    min-width: 40px;
    text-align: right;
    font-weight: 600;
    color: ${cyberpunkTheme.colors.primary};
  }
`;

const QuizContainer = styled(motion.div)`
  background: ${cyberpunkTheme.glassmorphism.border};
  backdrop-filter: blur(${cyberpunkTheme.glassmorphism.blurLevels.medium});
  border: ${cyberpunkTheme.glassmorphism.border};
  border-radius: 1rem;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
`;

const QuizQuestion = styled(motion.div)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: ${cyberpunkTheme.colors.textPrimary};
`;

const QuizOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuizOption = styled(motion.button)<{ selected?: boolean; correct?: boolean; incorrect?: boolean }>`
  background: ${props => 
    props.correct ? cyberpunkTheme.colors.success : 
    props.incorrect ? cyberpunkTheme.colors.error :
    props.selected ? cyberpunkTheme.colors.primary : 
    cyberpunkTheme.colors.surface
  };
  color: ${props => props.selected || props.correct || props.incorrect ? cyberpunkTheme.colors.background : cyberpunkTheme.colors.textPrimary};
  border: 2px solid transparent;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all ${cyberpunkTheme.animations.durations.normal};
  
  &:hover {
    background: ${props => props.selected ? cyberpunkTheme.colors.primary : cyberpunkTheme.stateColors.hover};
  }
`;

// Types
interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  experience: number;
  icon: React.ReactNode;
  description: string;
  tags: string[];
  certifications?: string[];
  projects?: string[];
  yearStarted: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  skill: string;
}

// Data
const skillsData: Skill[] = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    category: 'Cloud Platforms',
    level: 90,
    experience: 5,
    icon: <Cloud className="text-orange-500" />,
    description: 'Comprehensive cloud infrastructure management and deployment',
    tags: ['EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation'],
    certifications: ['AWS Solutions Architect', 'AWS DevOps Engineer'],
    projects: ['Multi-region deployment', 'Serverless architecture'],
    yearStarted: 2019
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'Container Orchestration',
    level: 85,
    experience: 4,
    icon: <Server className="text-blue-600" />,
    description: 'Container orchestration and microservices management',
    tags: ['Pods', 'Services', 'Ingress', 'Helm', 'Operators'],
    certifications: ['CKA', 'CKAD'],
    projects: ['Multi-cluster setup', 'GitOps implementation'],
    yearStarted: 2020
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'Containerization',
    level: 95,
    experience: 6,
    icon: <Server className="text-blue-400" />,
    description: 'Application containerization and deployment',
    tags: ['Dockerfile', 'Compose', 'Registry', 'Multi-stage'],
    projects: ['CI/CD integration', 'Microservices architecture'],
    yearStarted: 2018
  },
  {
    id: 'terraform',
    name: 'Terraform',
    category: 'Infrastructure as Code',
    level: 88,
    experience: 4,
    icon: <GitBranch className="text-purple-500" />,
    description: 'Infrastructure provisioning and management',
    tags: ['HCL', 'Modules', 'State', 'Providers'],
    projects: ['Multi-cloud deployment', 'Infrastructure automation'],
    yearStarted: 2020
  },
  {
    id: 'ansible',
    name: 'Ansible',
    category: 'Configuration Management',
    level: 82,
    experience: 3,
    icon: <HardHat className="text-red-500" />,
    description: 'Configuration management and automation',
    tags: ['Playbooks', 'Roles', 'Inventory', 'Vault'],
    projects: ['Server provisioning', 'Application deployment'],
    yearStarted: 2021
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Programming Languages',
    level: 92,
    experience: 7,
    icon: <Code className="text-yellow-500" />,
    description: 'Automation scripting and application development',
    tags: ['Django', 'Flask', 'Automation', 'APIs'],
    projects: ['DevOps tools', 'Monitoring scripts'],
    yearStarted: 2017
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Observability',
    category: 'Monitoring',
    level: 87,
    experience: 4,
    icon: <Monitor className="text-green-500" />,
    description: 'System monitoring and performance optimization',
    tags: ['Prometheus', 'Grafana', 'ELK', 'Jaeger'],
    projects: ['Full-stack monitoring', 'Alert management'],
    yearStarted: 2020
  },
  {
    id: 'security',
    name: 'DevSecOps',
    category: 'Security',
    level: 80,
    experience: 3,
    icon: <Shield className="text-red-600" />,
    description: 'Security integration in DevOps pipelines',
    tags: ['SAST', 'DAST', 'Compliance', 'Vulnerability'],
    projects: ['Security automation', 'Compliance monitoring'],
    yearStarted: 2021
  }
];

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which AWS service is best for serverless computing?',
    options: ['EC2', 'Lambda', 'ECS', 'Fargate'],
    correctAnswer: 1,
    skill: 'aws'
  },
  {
    id: 'q2',
    question: 'What is the smallest deployable unit in Kubernetes?',
    options: ['Container', 'Pod', 'Service', 'Deployment'],
    correctAnswer: 1,
    skill: 'kubernetes'
  },
  {
    id: 'q3',
    question: 'Which Terraform command applies the configuration?',
    options: ['terraform plan', 'terraform apply', 'terraform init', 'terraform validate'],
    correctAnswer: 1,
    skill: 'terraform'
  }
];

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: cyberpunkTheme.animations.springs.stiffness,
      damping: cyberpunkTheme.animations.springs.damping
    }
  }
};

const cardHoverVariants = {
  hover: {
    scale: cyberpunkTheme.motion.hoverScale,
    rotateY: 5,
    z: 50,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: cyberpunkTheme.motion.pressScale
  }
};

// Main Component
export const EnhancedSkillsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'comparison' | 'quiz'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  // Filtered skills
  const filteredSkills = useMemo(() => {
    return skillsData.filter(skill => {
      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(skillsData.map(skill => skill.category)));
    return ['all', ...cats];
  }, []);

  // Effects
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Handlers
  const handleSkillSelect = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowAnswer(false);
      } else {
        // Quiz completed
        setQuizMode(false);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setQuizScore(0);
    setQuizMode(true);
  };

  // Render functions
  const renderSkillCard = (skill: Skill) => (
    <SkillCard
      key={skill.id}
      variants={itemVariants}
      whileHover="hover"
      whileTap="tap"
      {...cardHoverVariants}
      onClick={() => setExpandedCard(expandedCard === skill.id ? null : skill.id)}
      style={{ perspective: 1000 }}
    >
      <SkillHeader>
        <SkillIcon>
          <motion.div
            animate={{ rotate: expandedCard === skill.id ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {skill.icon}
          </motion.div>
          {skill.name}
        </SkillIcon>
        <SkillLevel>{skill.level}%</SkillLevel>
      </SkillHeader>
      
      <ProgressBar>
        <ProgressFill
          level={skill.level}
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </ProgressBar>
      
      <motion.p
        style={{ color: cyberpunkTheme.colors.textSecondary, marginBottom: '1rem' }}
      >
        {skill.description}
      </motion.p>
      
      <SkillTags>
        {skill.tags.map((tag, index) => (
          <SkillTag
            key={tag}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 1 }}
          >
            {tag}
          </SkillTag>
        ))}
      </SkillTags>
      
      <AnimatePresence>
        {expandedCard === skill.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden', marginTop: '1rem' }}
          >
            <div style={{ padding: '1rem 0' }}>
              <h4 style={{ color: cyberpunkTheme.colors.primary, marginBottom: '0.5rem' }}>
                Experience: {skill.experience} years
              </h4>
              {skill.certifications && (
                <div style={{ marginBottom: '1rem' }}>
                  <h5 style={{ color: cyberpunkTheme.colors.accent, marginBottom: '0.5rem' }}>
                    Certifications:
                  </h5>
                  {skill.certifications.map(cert => (
                    <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={16} />
                      {cert}
                    </div>
                  ))}
                </div>
              )}
              {skill.projects && (
                <div>
                  <h5 style={{ color: cyberpunkTheme.colors.accent, marginBottom: '0.5rem' }}>
                    Key Projects:
                  </h5>
                  {skill.projects.map(project => (
                    <div key={project} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Target size={16} />
                      {project}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SkillCard>
  );

  const renderTimeline = () => (
    <TimelineContainer>
      <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: cyberpunkTheme.colors.primary }}>
        Skills Development Timeline
      </h3>
      {skillsData
        .sort((a, b) => a.yearStarted - b.yearStarted)
        .map((skill, index) => (
          <TimelineItem
            key={skill.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <TimelineDot
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
            {index < skillsData.length - 1 && <TimelineLine />}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                {skill.icon}
                <h4 style={{ color: cyberpunkTheme.colors.textPrimary }}>{skill.name}</h4>
                <span style={{ color: cyberpunkTheme.colors.textSecondary }}>
                  {skill.yearStarted} - Present ({skill.experience} years)
                </span>
              </div>
              <p style={{ color: cyberpunkTheme.colors.textSecondary }}>
                {skill.description}
              </p>
            </div>
          </TimelineItem>
        ))}
    </TimelineContainer>
  );

  const renderComparison = () => {
    const maxLevel = Math.max(...filteredSkills.map(s => s.level));
    
    return (
      <ComparisonChart>
        <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: cyberpunkTheme.colors.primary }}>
          Skills Comparison
        </h3>
        {filteredSkills.map((skill, index) => (
          <ChartBar
            key={skill.id}
            value={skill.level}
            maxValue={maxLevel}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="label">{skill.name}</div>
            <div className="bar">
              <motion.div
                className="fill"
                initial={{ width: 0 }}
                animate={{ width: `${(skill.level / maxLevel) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
            <div className="value">{skill.level}%</div>
          </ChartBar>
        ))}
      </ComparisonChart>
    );
  };

  const renderQuiz = () => {
    if (!quizMode) {
      return (
        <QuizContainer>
          <h3 style={{ color: cyberpunkTheme.colors.primary, marginBottom: '1rem' }}>
            Skills Assessment Quiz
          </h3>
          <p style={{ marginBottom: '2rem', color: cyberpunkTheme.colors.textSecondary }}>
            Test your DevOps knowledge with our interactive quiz!
          </p>
          <motion.button
            onClick={resetQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: cyberpunkTheme.colors.primary,
              color: cyberpunkTheme.colors.background,
              border: 'none',
              borderRadius: '0.5rem',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Start Quiz
          </motion.button>
        </QuizContainer>
      );
    }

    const question = quizQuestions[currentQuestion];
    
    return (
      <QuizContainer>
        <div style={{ marginBottom: '1rem', color: cyberpunkTheme.colors.textSecondary }}>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </div>
        <QuizQuestion>{question.question}</QuizQuestion>
        <QuizOptions>
          {question.options.map((option, index) => (
            <QuizOption
              key={index}
              onClick={() => !showAnswer && handleQuizAnswer(index)}
              selected={selectedAnswer === index}
              correct={showAnswer && index === question.correctAnswer}
              incorrect={showAnswer && selectedAnswer === index && index !== question.correctAnswer}
              whileHover={{ scale: showAnswer ? 1 : 1.02 }}
              whileTap={{ scale: showAnswer ? 1 : 0.98 }}
              disabled={showAnswer}
            >
              {option}
            </QuizOption>
          ))}
        </QuizOptions>
        <div style={{ color: cyberpunkTheme.colors.primary }}>
          Score: {quizScore} / {currentQuestion + (showAnswer ? 1 : 0)}
        </div>
      </QuizContainer>
    );
  };

  return (
    <SkillsContainer
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <Header variants={itemVariants}>
        <Title>Skills & Expertise</Title>
        <motion.p
          variants={itemVariants}
          style={{ 
            fontSize: '1.2rem', 
            color: cyberpunkTheme.colors.textSecondary,
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          Explore my technical skills through interactive visualizations, timelines, and assessments
        </motion.p>
      </Header>

      <ControlPanel variants={itemVariants}>
        <SearchInput
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          whileFocus={{ scale: 1.02 }}
        />
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <FilterButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category === 'all' ? 'All Skills' : category}
            </FilterButton>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <ViewModeButton
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 size={20} />
            Grid
          </ViewModeButton>
          <ViewModeButton
            active={viewMode === 'timeline'}
            onClick={() => setViewMode('timeline')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp size={20} />
            Timeline
          </ViewModeButton>
          <ViewModeButton
            active={viewMode === 'comparison'}
            onClick={() => setViewMode('comparison')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 size={20} />
            Compare
          </ViewModeButton>
          <ViewModeButton
            active={viewMode === 'quiz'}
            onClick={() => setViewMode('quiz')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Target size={20} />
            Quiz
          </ViewModeButton>
        </div>
      </ControlPanel>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' && (
          <SkillsGrid
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredSkills.map(renderSkillCard)}
          </SkillsGrid>
        )}
        
        {viewMode === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderTimeline()}
          </motion.div>
        )}
        
        {viewMode === 'comparison' && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderComparison()}
          </motion.div>
        )}
        
        {viewMode === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderQuiz()}
          </motion.div>
        )}
      </AnimatePresence>
    </SkillsContainer>
  );
};

export default EnhancedSkillsPage;