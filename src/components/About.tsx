import React from 'react';
import { Code, Cloud, Shield, GitBranch, Server, HardHat } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
        <div className="flex flex-col md:flex-row items-center md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src="https://via.placeholder.com/400"
              alt="Profile"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
          <div className="md:w-1/2 text-lg leading-relaxed">
            <p className="mb-4">
              Hello! I'm a passionate DevOps Engineer with a strong background in building and automating scalable, secure, and resilient cloud infrastructure. My expertise lies in bridging the gap between development and operations, ensuring seamless software delivery pipelines.
            </p>
            <p className="mb-4">
              I thrive on optimizing workflows, implementing Infrastructure as Code (IaC), and enhancing system reliability through robust monitoring and logging solutions. I'm always eager to learn new technologies and apply best practices to solve complex challenges.
            </p>
            <p className="mb-4">
              My goal is to create efficient, secure, and cost-effective solutions that empower development teams to deliver high-quality software rapidly.
            </p>
            <h3 className="text-2xl font-semibold mt-8 mb-4">My Expertise:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Cloud className="text-blue-500" size={24} />
                <span>Cloud Platforms (AWS, Azure, GCP)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Code className="text-green-500" size={24} />
                <span>CI/CD & Automation</span>
              </div>
              <div className="flex items-center space-x-3">
                <Server className="text-red-500" size={24} />
                <span>Containerization (Docker, Kubernetes)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="text-purple-500" size={24} />
                <span>Security & Compliance</span>
              </div>
              <div className="flex items-center space-x-3">
                <GitBranch className="text-orange-500" size={24} />
                <span>IaC (Terraform, Ansible)</span>
              </div>
              <div className="flex items-center space-x-3">
                <HardHat className="text-yellow-500" size={24} />
                <span>Monitoring & Logging</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;