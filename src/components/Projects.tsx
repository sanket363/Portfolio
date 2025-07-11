import React from 'react';
import { Box, ExternalLink } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
  link?: string;
  technologies: string[];
}

const projects: Project[] = [
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

export function Projects() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            My Projects
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Here are some of the key projects I've worked on, showcasing my skills in DevOps, cloud, and automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl 
                       transition-all duration-300 hover:-translate-y-2"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'slideUp 0.5s ease-out forwards'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Box className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.link ? (
                        <a href={project.link} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                          {project.name}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        project.name
                      )}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-300 mb-6 line-clamp-3 min-h-[4.5rem]">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="px-3 py-1 bg-slate-700 rounded-full text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}