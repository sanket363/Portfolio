import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectProps {
  title: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
}

const ProjectCard: React.FC<ProjectProps> = ({ title, description, technologies, githubLink, liveLink }) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 flex flex-col h-full transform transition-transform duration-300 hover:scale-105">
      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {technologies.map((tech, index) => (
          <span key={index} className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex space-x-4 mt-auto">
        {githubLink && (
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            <Github className="w-5 h-5 mr-2" /> GitHub
          </a>
        )}
        {liveLink && (
          <a
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
          >
            <ExternalLink className="w-5 h-5 mr-2" /> Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const projectsData = [
    {
      title: 'Automated CI/CD Pipeline for Microservices',
      description: 'Designed and implemented a robust CI/CD pipeline using GitHub Actions and ArgoCD for a microservices architecture on Kubernetes, enabling automated testing, building, and deployment.',
      technologies: ['Kubernetes', 'GitHub Actions', 'ArgoCD', 'Docker', 'Helm'],
      githubLink: 'https://github.com/sanket363/microservices-cicd',
    },
    {
      title: 'Multi-Cloud Infrastructure with Terraform',
      description: 'Developed Terraform modules to provision and manage infrastructure across AWS and Azure, ensuring consistency, immutability, and disaster recovery capabilities.',
      technologies: ['Terraform', 'AWS', 'Azure', 'VPC', 'IAM'],
      githubLink: 'https://github.com/sanket363/multi-cloud-terraform',
    },
    {
      title: 'Centralized Logging and Monitoring Stack',
      description: 'Set up an ELK (Elasticsearch, Logstash, Kibana) stack for centralized logging and integrated Prometheus and Grafana for comprehensive application and infrastructure monitoring.',
      technologies: ['ELK Stack', 'Prometheus', 'Grafana', 'Docker Compose'],
      githubLink: 'https://github.com/sanket363/monitoring-logging-stack',
    },
    {
      title: 'Serverless Data Processing Pipeline (AWS Lambda)',
      description: 'Built a cost-effective and scalable serverless data processing pipeline using AWS Lambda, S3, and DynamoDB for real-time data ingestion and transformation.',
      technologies: ['AWS Lambda', 'S3', 'DynamoDB', 'Python', 'Serverless Framework'],
      githubLink: 'https://github.com/sanket363/serverless-data-pipeline',
    },
  ];

  return (
    <section id="projects" className="py-20 px-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

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