import React from 'react';
import { Code, Cloud, GitBranch, Server, Shield, HardHat } from 'lucide-react';

const About: React.FC = () => {
  const skills = [
    { name: 'Infrastructure as Code', icon: <Code /> },
    { name: 'Cloud Architecture (AWS, Azure, GCP)', icon: <Cloud /> },
    { name: 'CI/CD Pipelines', icon: <GitBranch /> },
    { name: 'Containerization & Orchestration', icon: <Server /> },
    { name: 'Security Best Practices', icon: <Shield /> },
    { name: 'Monitoring & Logging', icon: <HardHat /> },
  ];

  return (
    <section id="about" className="py-20 px-8 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
        <div className="max-w-3xl mx-auto text-lg leading-relaxed text-center mb-12">
          <p className="mb-4">
            I'm a passionate DevOps Engineer with a strong focus on building scalable, secure, and automated cloud infrastructures.
            My expertise lies in bridging the gap between development and operations, ensuring seamless software delivery and robust system performance.
          </p>
          <p>
            With a deep understanding of cloud-native principles and a commitment to continuous learning, I strive to implement best practices
            in CI/CD, infrastructure as code, container orchestration, and observability.
          </p>
        </div>

        <h3 className="text-3xl font-bold text-center mb-8">My Expertise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
            >
              <div className="text-blue-500 dark:text-blue-400 flex-shrink-0">
                {React.cloneElement(skill.icon as React.ReactElement, { size: 32 })}
              </div>
              <span className="text-xl font-semibold">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;