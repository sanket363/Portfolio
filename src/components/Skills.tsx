import React from 'react';
import { GitBranch, Cloud, Server, Shield, Code, HardHat } from 'lucide-react';

const skillsData = [
  { name: 'AWS', icon: <Cloud size={40} className="text-orange-500" /> },
  { name: 'Azure', icon: <Cloud size={40} className="text-blue-500" /> },
  { name: 'GCP', icon: <Cloud size={40} className="text-green-500" /> },
  { name: 'Kubernetes', icon: <Server size={40} className="text-blue-600" /> },
  { name: 'Docker', icon: <Server size={40} className="text-blue-400" /> },
  { name: 'Terraform', icon: <GitBranch size={40} className="text-purple-500" /> },
  { name: 'Ansible', icon: <HardHat size={40} className="text-red-500" /> },
  { name: 'Python', icon: <Code size={40} className="text-yellow-500" /> },
  { name: 'Bash', icon: <Code size={40} className="text-gray-500" /> },
  { name: 'CI/CD', icon: <Code size={40} className="text-green-600" /> },
  { name: 'Monitoring', icon: <Shield size={40} className="text-pink-500" /> },
  { name: 'Security', icon: <Shield size={40} className="text-red-600" /> },
];

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-16 px-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Skills & Technologies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {skillsData.map((skill, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
            >
              {skill.icon}
              <p className="mt-4 text-xl font-semibold">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;