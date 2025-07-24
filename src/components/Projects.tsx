'use client';

import SectionWrapper from './SectionWrapper';
import ProjectCard from './ProjectCard';
import type { Project } from '@/types';

const projectsData: Project[] = [
  {
    title: 'Cloud-Native CI/CD Pipeline',
    description: 'A fully automated CI/CD pipeline for a microservices application using Jenkins, Docker, and Kubernetes on AWS EKS.',
    tags: ['Jenkins', 'Docker', 'Kubernetes', 'AWS', 'Helm'],
    imageUrl: '/placeholder.svg',
    githubUrl: 'https://github.com/sanket363',
    liveUrl: '#',
    ciCdBrief: 'Jenkins pipeline triggered by GitHub webhooks, builds Docker images, pushes to ECR, and deploys to EKS using Helm charts.',
  },
  {
    title: 'Terraform IaC for Multi-Cloud',
    description: 'Infrastructure as Code setup using Terraform to provision a VPC, subnets, security groups, and EC2 instances on both AWS and Azure.',
    tags: ['Terraform', 'AWS', 'Azure', 'IaC'],
    imageUrl: '/placeholder.svg',
    githubUrl: 'https://github.com/sanket363',
    ciCdBrief: 'GitHub Actions workflow runs `terraform plan` on PRs and `terraform apply` on merge to main.',
  },
  {
    title: 'Prometheus & Grafana Monitoring Stack',
    description: 'A complete monitoring and alerting solution for a Kubernetes cluster using Prometheus for metrics collection and Grafana for visualization.',
    tags: ['Prometheus', 'Grafana', 'Kubernetes', 'Alertmanager'],
    imageUrl: '/placeholder.svg',
    githubUrl: 'https://github.com/sanket363',
    liveUrl: '#',
    ciCdBrief: 'Deployed via Helm. Alerts configured in Alertmanager and sent to Slack for critical issues.',
  },
];

const Projects = () => {
  return (
    <SectionWrapper id="projects" title="Projects Showcase">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Projects;
