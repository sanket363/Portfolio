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

const projectsData = [
  {
    name: 'CI/CD Pipeline with Jenkins & Kubernetes',
    description: 'Automated CI/CD pipeline for a microservices application using Jenkins, Docker, and Kubernetes. Includes automated testing, building, and deployment.',
    technologies: ['Jenkins', 'Kubernetes', 'Docker', 'Groovy', 'Helm'],
    githubLink: 'https://github.com/your-username/jenkins-k8s-cicd',
    liveDemoLink: 'https://demo.example.com/jenkins-k8s',
  },
  {
    name: 'Infrastructure as Code with Terraform & AWS',
    description: 'Terraform modules for provisioning AWS infrastructure including VPC, EC2, S3, and RDS. Emphasizes modularity and reusability.',
    technologies: ['Terraform', 'AWS', 'VPC', 'EC2', 'S3', 'RDS'],
    githubLink: 'https://github.com/your-username/terraform-aws-iac',
  },
  {
    name: 'Monitoring Stack with Prometheus & Grafana',
    description: 'Setup and configuration of a comprehensive monitoring solution using Prometheus for metrics collection and Grafana for visualization and alerting.',
    technologies: ['Prometheus', 'Grafana', 'Alertmanager', 'Node Exporter'],
    githubLink: 'https://github.com/your-username/monitoring-stack',
  },
  {
    name: 'Automated Security Scanning in CI/CD',
    description: 'Integrated security scanning tools (SAST, DAST, SCA) into a GitHub Actions CI/CD pipeline to identify vulnerabilities early in the development lifecycle.',
    technologies: ['GitHub Actions', 'OWASP ZAP', 'Trivy', 'Snyk'],
    githubLink: 'https://github.com/your-username/secure-cicd',
  },
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-16 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">My DevOps Projects</h2>
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