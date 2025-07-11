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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105">
      <h3 className="text-2xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {technologies.map((tech, index) => (
          <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex space-x-4">
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Github size={20} className="mr-1" /> GitHub
        </a>
        {liveDemoLink && (
          <a
            href={liveDemoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ExternalLink size={20} className="mr-1" /> Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;