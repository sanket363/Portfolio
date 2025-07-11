import React from 'react';
import { Box, ExternalLink, Star, GitFork, Clock, Code } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Project {
  id: number;
  name: string;
  description: string;
  link?: string;
  technologies: string[];
  stargazers_count?: number;
  forks_count?: number;
  language?: string;
  updated_at?: string;
}

const staticProjects: Project[] = [
  {
    id: 1,
    name: 'GitOps-CiCd-Pipeline',
    description: 'Deployed Node.js Hello World app using microservices architecture & GitOps with Docker, DockerHub, ArgoCD, Helm, Kustomize, Terraform, Minikube, GitHub Actions.',
    technologies: ['Node.js', 'Docker', 'DockerHub', 'ArgoCD', 'Helm', 'Kustomize', 'Terraform', 'Minikube', 'GitHub Actions'],
  },
  {
    id: 2,
    name: 'AWS DevOps CICD',
    description: 'This project involves creating a CodeCommit deployment and pipeline on AWS. The first step is to create a CodeCommit repository to store your source code.',
    technologies: ['AWS CodeCommit', 'AWS CodePipeline', 'AWS'],
  },
  {
    id: 3,
    name: 'Lambda Api Gateway',
    description: 'This project involves creating a serverless RESTful API using AWS Lambda and API Gateway, which exposes a single endpoint that handles HTTP GET requests.',
    technologies: ['AWS Lambda', 'API Gateway', 'Serverless'],
  },
  {
    id: 4,
    name: 'Deployed End-to-End Nodejs Application',
    description: 'Created a CICD pipeline for the Node.js ToDo app using Jenkins, Docker, and Git integrations, and Docker-compose to automate development, testing, and deployment.',
    technologies: ['Node.js', 'Jenkins', 'Docker', 'Git', 'Docker-compose', 'CI/CD'],
  },
  {
    id: 5,
    name: 'Jenkins Declarative CI/CD Pipeline',
    description: 'This project demonstrates the usage of Jenkins Declarative Pipeline along with Docker, Docker Hub, and Docker Compose for streamlined CI/CD workflows.',
    technologies: ['Jenkins', 'Docker', 'Docker Hub', 'Docker Compose', 'CI/CD'],
  },
  {
    id: 6,
    name: 'Docker-Swarm WebApplication Deployment',
    description: 'The objective of this project is to showcase the implementation of a web application utilising Docker Swarm, a container orchestration tool for the easy management and scaling of containerised applications.',
    technologies: ['Docker Swarm', 'Docker', 'Container Orchestration'],
  },
  {
    id: 7,
    name: 'LogFlow - Unified Log Tracking Solution using Grafana, Promtail, Loki',
    description: 'LogFlow is a project that implements a unified log tracking solution by integrating Grafana, Loki, and Promtail.',
    technologies: ['Grafana', 'Loki', 'Promtail', 'Logging'],
  },
  {
    id: 8,
    name: 'Microservices Web-Application Deployment',
    description: 'Deployed E-commerce microservices on AWS using NodeJS, Java, Python, Golang, PHP, MongoDB, Redis, MySQL, RabbitMQ, Jenkins, Terraform, SonarQube, OWASP, Prometheus, Grafana.',
    technologies: ['AWS', 'NodeJS', 'Java', 'Python', 'Golang', 'PHP', 'MongoDB', 'Redis', 'MySQL', 'RabbitMQ', 'Jenkins', 'Terraform', 'SonarQube', 'OWASP', 'Prometheus', 'Grafana', 'Microservices'],
  },
];

interface ProjectsProps {
  repos?: Project[];
}

export function Projects({ repos }: ProjectsProps) {
  const projects = repos || staticProjects;
  
  return (
    <div className="pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 to-transparent opacity-20 pointer-events-none"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            {repos ? 'My GitHub Projects' : 'My Projects'}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {repos 
              ? "Browse through my open-source contributions and personal projects"
              : "Here are some of the key projects I've worked on, showcasing my skills in DevOps, cloud, and automation."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="group relative bg-slate-800/20 backdrop-blur-lg rounded-xl overflow-hidden hover:shadow-2xl 
                       transition-all duration-300 hover:-translate-y-2 border border-slate-700/30 hover:border-blue-400/30 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'slideUp 0.5s ease-out forwards'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Box className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      <a 
                        href={project.link || `https://github.com/sanket363/${project.name}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors inline-flex items-center gap-2"
                      >
                        {project.name}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </h3>
                  </div>
                  
                  {project.language && (
                    <div className="flex items-center text-sm text-blue-400">
                      <Code className="w-4 h-4 mr-1" />
                      {project.language}
                    </div>
                  )}
                </div>

                <p className="text-slate-300 mb-6 line-clamp-3 min-h-[4.5rem] flex-grow">
                  {project.description || 'No description available'}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  {project.technologies && project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="px-3 py-1 bg-slate-700/50 backdrop-blur-sm rounded-full text-xs border border-slate-600/30 hover:border-blue-400/50 transition-colors">
                      {tech}
                    </span>
                  ))}
                  
                  {project.stargazers_count !== undefined && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {project.stargazers_count}
                    </div>
                  )}
                  
                  {project.forks_count !== undefined && (
                    <div className="flex items-center">
                      <GitFork className="w-4 h-4 mr-1" />
                      {project.forks_count}
                    </div>
                  )}
                  
                  {project.updated_at && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}