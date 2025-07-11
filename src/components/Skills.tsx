import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { 
  Cloud, 
  Container, 
  GitBranch, 
  LineChart, 
  Terminal, 
  Server, 
  Shield, 
  Code2, 
  Workflow,
  Database
} from 'lucide-react';

const skills = {
  'Cloud Platforms': {
    icon: <Cloud />,
    items: ['AWS', 'Azure', 'GCP', 'Cloud Computing'],
    color: 'bg-blue-500',
    description: 'Multi-cloud infrastructure management and optimization'
  },
  'Containerization & Orchestration': {
    icon: <Container />,
    items: ['Docker', 'Kubernetes'],
    color: 'bg-cyan-500',
    description: 'Container deployment and orchestration at scale'
  },
  'CI/CD & Version Control': {
    icon: <GitBranch />,
    items: ['Jenkins', 'GitHub Actions', 'CI/CD'],
    color: 'bg-orange-500',
    description: 'Automated deployment pipelines and source control'
  },
  'Infrastructure as Code & Scripting': {
    icon: <Terminal />,
    items: ['Ansible', 'Terraform', 'Python', 'Linux'],
    color: 'bg-purple-500',
    description: 'Infrastructure automation and scripting'
  },
  'Monitoring & Observability': {
    icon: <LineChart />,
    items: ['Grafana', 'Prometheus', 'Datadog', 'Zabbix'],
    color: 'bg-green-500',
    description: 'System monitoring and performance analysis'
  },
  'Logging & Access Management': {
    icon: <Database />,
    items: ['ELK', 'Teleport'],
    color: 'bg-red-500',
    description: 'Log management and secure access solutions'
  },
  'Networking': {
    icon: <GitBranch />,
    items: ['Mikrotik', 'StrongSwan', 'Networking'],
    color: 'bg-indigo-500',
    description: 'Network configuration and security'
  }
};

export function Skills() {
  const skillCategoryRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    anime({
      targets: skillCategoryRefs.current,
      opacity: [0, 1],
      translateY: [50, 0],
      easing: 'easeOutQuad',
      duration: 800,
      delay: anime.stagger(100, { start: 500 }),
    });
  }, []);
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50" id="skills">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Technical Skills</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experienced in managing cloud infrastructure, implementing DevOps practices, 
            and building reliable, scalable systems.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, { icon, items, color, description }], index) => (
            <div 
              key={category} 
              ref={el => skillCategoryRefs.current[index] = el}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                       transform hover:-translate-y-1 overflow-hidden group"
              onMouseEnter={(e) => {
                anime({
                  targets: e.currentTarget,
                  scale: 1.02,
                  easing: 'easeOutQuad',
                  duration: 300,
                });
              }}
              onMouseLeave={(e) => {
                anime({
                  targets: e.currentTarget,
                  scale: 1,
                  easing: 'easeOutQuad',
                  duration: 300,
                });
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${color} text-white transform 
                                group-hover:scale-110 transition-transform duration-300`}>
                    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{category}</h3>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className={`px-4 py-2 rounded-lg text-sm font-medium 
                              bg-opacity-10 hover:bg-opacity-20 transition-all duration-300
                              ${color.replace('bg-', 'bg-')} ${color.replace('bg-', 'text-')}
                              cursor-default`}
                      onMouseEnter={(e) => {
                        anime({
                          targets: e.currentTarget,
                          scale: 1.1,
                          easing: 'easeOutQuad',
                          duration: 200,
                        });
                      }}
                      onMouseLeave={(e) => {
                        anime({
                          targets: e.currentTarget,
                          scale: 1,
                          easing: 'easeOutQuad',
                          duration: 200,
                        });
                    >
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}