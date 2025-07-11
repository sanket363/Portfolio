import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  name: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveDemoLink?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ name, description, technologies, githubLink, liveDemoLink }) => {
  return (
    <div className="project-card backdrop-blur-lg bg-white/5 dark:bg-black/10 rounded-xl shadow-2xl p-6 border border-white/10 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-white/20 hover:bg-white/10 dark:hover:bg-black/20">
      <h3 className="text-2xl font-bold mb-3 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        {name}
      </h3>
      <p className="text-gray-300 mb-5">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {technologies.map((tech, index) => (
          <span 
            key={index} 
            className="bg-white/10 text-white text-sm font-medium px-3 py-1 rounded-full border border-white/10 hover:bg-white/20 transition-colors duration-300"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex space-x-4">
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-white hover:text-blue-400 transition-colors duration-300"
        >
          <Github size={20} className="mr-2" /> GitHub
        </a>
        {liveDemoLink && (
          <a
            href={liveDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white hover:text-purple-400 transition-colors duration-300"
          >
            <ExternalLink size={20} className="mr-2" /> Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;