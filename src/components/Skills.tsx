'use client';

import SectionWrapper from './SectionWrapper';
import { motion } from 'framer-motion';
import { 
  SiAmazon, SiGooglecloud, SiDocker, SiKubernetes, 
  SiTerraform, SiAnsible, SiJenkins, SiGitlab, SiGithubactions, 
  SiPrometheus, SiGrafana, SiDatadog, SiSplunk, SiElasticsearch, SiKibana, SiGit
} from 'react-icons/si';
import { VscAzure } from 'react-icons/vsc';

const skillsData = [
  {
    category: 'Cloud Platforms',
    tools: [
      { name: 'AWS', icon: <SiAmazon className="h-12 w-12" /> },
      { name: 'Azure', icon: <VscAzure className="h-12 w-12" /> },
      { name: 'GCP', icon: <SiGooglecloud className="h-12 w-12" /> },
    ],
  },
  {
    category: 'Containerization & Orchestration',
    tools: [
      { name: 'Docker', icon: <SiDocker className="h-12 w-12" /> },
      { name: 'Kubernetes', icon: <SiKubernetes className="h-12 w-12" /> },
    ],
  },
  {
    category: 'Infrastructure as Code (IaC)',
    tools: [
      { name: 'Terraform', icon: <SiTerraform className="h-12 w-12" /> },
      { name: 'Ansible', icon: <SiAnsible className="h-12 w-12" /> },
    ],
  },
  {
    category: 'CI/CD',
    tools: [
      { name: 'Jenkins', icon: <SiJenkins className="h-12 w-12" /> },
      { name: 'GitLab CI', icon: <SiGitlab className="h-12 w-12" /> },
      { name: 'GitHub Actions', icon: <SiGithubactions className="h-12 w-12" /> },
    ],
  },
  {
    category: 'Monitoring & Observability',
    tools: [
      { name: 'Prometheus', icon: <SiPrometheus className="h-12 w-12" /> },
      { name: 'Grafana', icon: <SiGrafana className="h-12 w-12" /> },
      { name: 'Datadog', icon: <SiDatadog className="h-12 w-12" /> },
      { name: 'Splunk', icon: <SiSplunk className="h-12 w-12" /> },
      { name: 'ELK Stack', icon: <div className="flex gap-2"><SiElasticsearch className="h-12 w-12" /><SiKibana className="h-12 w-12" /></div> },
    ],
  },
  {
    category: 'Version Control',
    tools: [
      { name: 'Git', icon: <SiGit className="h-12 w-12" /> },
    ],
  },
];

const Skills = () => {
  return (
    <SectionWrapper id="skills" title="Skills & Tools">
      <div className="space-y-12">
        {skillsData.map((skillCategory, index) => (
          <div key={index}>
            <h3 className="text-2xl font-semibold text-ctp-sky mb-6 text-center">{skillCategory.category}</h3>
            <div className="flex flex-wrap justify-center gap-8">
              {skillCategory.tools.map((tool, toolIndex) => (
                <motion.div
                  key={toolIndex}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: toolIndex * 0.1 }}
                  className="flex flex-col items-center gap-2 p-4 bg-ctp-surface0 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 w-36"
                >
                  <div className="text-ctp-lavender">{tool.icon}</div>
                  <p className="text-ctp-text font-medium">{tool.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Skills;
