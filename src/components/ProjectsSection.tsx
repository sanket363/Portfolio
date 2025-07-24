"use client";
import React from "react";
import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    name: "Portfolio",
    url: "https://github.com/sanket363/Portfolio",
    description: "This very portfolio, built with Next.js, TypeScript, Tailwind, and Framer Motion to showcase DevOps skills and projects."
  },
  {
    name: "90DaysOfDevOps-New",
    url: "https://github.com/sanket363/90DaysOfDevOps-New",
    description: "Documenting a 90-day journey learning DevOps: CI/CD, Kubernetes, cloud, and automation."
  },
  {
    name: "blue-green-deployment",
    url: "https://github.com/sanket363/blue-green-deployment",
    description: "Hands-on example of Blue-Green deployment for zero-downtime releases."
  },
  {
    name: "cloud-native-ecommerce-microservices",
    url: "https://github.com/sanket363/cloud-native-ecommerce-microservices",
    description: "Cloud-native e-commerce platform using microservices, containers, and orchestration."
  },
  {
    name: "Server-Performance-Stats",
    url: "https://github.com/sanket363/Server-Performance-Stats",
    description: "Script to analyze and visualize server performance metrics."
  },
  {
    name: "11Microservices-CI-CD-Pipeline",
    url: "https://github.com/sanket363/11Microservices-CI-CD-Pipeline",
    description: "End-to-end CI/CD pipeline for 11 microservices using modern DevOps tools."
  },
  {
    name: "service-deployment",
    url: "https://github.com/sanket363/service-deployment",
    description: "Automated deployment scripts and IaC for scalable services."
  },
  {
    name: "Log-Archive-Tool",
    url: "https://github.com/sanket363/Log-Archive-Tool",
    description: "CLI tool to compress and archive logs for better system hygiene."
  },
  {
    name: "DevOps-k8s-CircleCI-ArgoCD",
    url: "https://github.com/sanket363/DevOps-k8s-CircleCI-ArgoCD",
    description: "Modern CI/CD with Kubernetes, CircleCI, and ArgoCD."
  },
  {
    name: "cicd-demo-flaskapp",
    url: "https://github.com/sanket363/cicd-demo-flaskapp",
    description: "Demo Flask app with automated CI/CD pipeline."
  },
  {
    name: "Microservices-CICD-Deployment",
    url: "https://github.com/sanket363/Microservices-CICD-Deployment",
    description: "DevOps domain project representing end-to-end application deployments."
  }
];

const ProjectsSection = () => {
  return (
    <section className="py-20 bg-gray-950 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 font-mono">
            <span className="text-blue-400">$</span> Projects
          </h2>
          <p className="text-gray-400 text-lg">A curated showcase of DevOps, Cloud, and Automation projects from my GitHub.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.url}
              className="relative bg-gray-900 rounded-xl shadow-lg border border-gray-800 hover:border-blue-500 transition group overflow-hidden"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-2">
                  <Github className="w-6 h-6 text-blue-400" />
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-blue-300 group-hover:text-blue-400 transition underline flex items-center gap-1"
                  >
                    {project.name}
                    <ExternalLink className="w-4 h-4 inline ml-1" />
                  </a>
                </div>
                <p className="text-gray-300 mb-4 flex-1">{project.description}</p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block px-4 py-2 bg-blue-700 rounded text-white font-semibold hover:bg-blue-600 transition"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
