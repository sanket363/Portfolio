"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  FaCloud, 
  FaServer, 
  FaTerminal, 
  FaCode, 
  FaGitAlt, 
  FaPlay, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaAws 
} from "react-icons/fa";
import { 
  SiGithub, 
  SiLinkedin, 
  SiDocker, 
  SiAmazonaws, 
  SiMicrosoftazure, 
  SiGooglecloud, 
  SiKubernetes, 
  SiHelm, 
  SiTerraform, 
  SiAnsible, 
  SiJenkins, 
  SiGitlab, 
  SiPrometheus, 
  SiGrafana, 
  SiDatadog, 
  SiElasticsearch, 
  SiKibana, 
  SiSplunk, 
  SiCloudflare 
} from "react-icons/si";

const skills = [
  {
    name: "Cloud Platforms",
    items: [
      { label: "AWS", icon: <SiAmazonaws className="w-6 h-6 text-yellow-400" />, link: "https://aws.amazon.com/" },
      { label: "Azure", icon: <SiMicrosoftazure className="w-6 h-6 text-blue-400" />, link: "https://azure.microsoft.com/" },
      { label: "GCP", icon: <SiGooglecloud className="w-6 h-6 text-red-400" />, link: "https://cloud.google.com/" }
    ]
  },
  {
    name: "Containers & Orchestration",
    items: [
      { label: "Docker", icon: <SiDocker className="w-6 h-6 text-blue-300" />, link: "https://www.docker.com/" },
      { label: "Kubernetes", icon: <SiKubernetes className="w-6 h-6 text-blue-500" />, link: "https://kubernetes.io/" },
      { label: "Helm", icon: <SiHelm className="w-6 h-6 text-indigo-400" />, link: "https://helm.sh/" }
    ]
  },
  {
    name: "Infrastructure as Code",
    items: [
      { label: "Terraform", icon: <SiTerraform className="w-6 h-6 text-purple-400" />, link: "https://www.terraform.io/" },
      { label: "CloudFormation", icon: <FaAws className="w-6 h-6 text-orange-400" />, link: "https://aws.amazon.com/cloudformation/" },
      { label: "Ansible", icon: <SiAnsible className="w-6 h-6 text-red-400" />, link: "https://www.ansible.com/" }
    ]
  },
  {
    name: "CI/CD & Automation",
    items: [
      { label: "GitHub Actions", icon: <SiGithub className="w-6 h-6 text-gray-200" />, link: "https://github.com/features/actions" },
      { label: "Jenkins", icon: <SiJenkins className="w-6 h-6 text-red-500" />, link: "https://www.jenkins.io/" },
      { label: "GitLab CI", icon: <SiGitlab className="w-6 h-6 text-pink-400" />, link: "https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/" }
    ]
  },
  {
    name: "Monitoring & Logging",
    items: [
      { label: "Prometheus", icon: <SiPrometheus className="w-6 h-6 text-red-400" />, link: "https://prometheus.io/" },
      { label: "Grafana", icon: <SiGrafana className="w-6 h-6 text-orange-400" />, link: "https://grafana.com/" },
      { label: "Datadog", icon: <SiDatadog className="w-6 h-6 text-purple-400" />, link: "https://www.datadoghq.com/" }
    ]
  },
  {
    name: "Scripting & Languages",
    items: [
      { label: "Bash", icon: <FaTerminal className="w-6 h-6 text-gray-400" />, link: "https://www.gnu.org/software/bash/" },
      { label: "Python", icon: <FaCode className="w-6 h-6 text-yellow-400" />, link: "https://www.python.org/" },
      { label: "Go", icon: <FaTerminal className="w-6 h-6 text-blue-400" />, link: "https://golang.org/" }
    ]
  },
  {
    name: "Version Control",
    items: [
      { label: "Git", icon: <FaGitAlt className="w-6 h-6 text-gray-200" />, link: "https://git-scm.com/" },
      { label: "GitHub", icon: <SiGithub className="w-6 h-6 text-gray-200" />, link: "https://github.com/" },
      { label: "GitLab", icon: <SiGitlab className="w-6 h-6 text-orange-400" />, link: "https://gitlab.com/" }
    ]
  }
];

const links = [
  {
    label: "GitHub",
    icon: <SiGithub className="w-5 h-5" />,
    url: "https://github.com/sanket363",
  },
  {
    label: "LinkedIn",
    icon: <SiLinkedin className="w-5 h-5 text-blue-400" />,
    url: "https://www.linkedin.com/in/sanket-bhalke-devops/",
  },
];

const SkillsSection = () => {
  return (
    <section className="py-20 bg-gray-950 text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 font-mono">
            <span className="text-green-400">$</span> Skills & Tech Stack
          </h2>
          <p className="text-gray-400 text-lg">
            Modern DevOps, Cloud, Automation, and Monitoring tools I use
          </p>
          <div className="flex justify-center gap-6 mt-4">
            {links.map(({ label, icon, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 hover:border-green-400 hover:text-green-400 transition-colors"
              >
                {icon} {label}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {skills.map((category) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 border border-green-400/20 rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-green-300">
                <CheckCircle className="w-5 h-5 text-green-400" />{" "}
                {category.name}
              </h3>
              <ul className="space-y-3">
                {category.items.map(({ label, icon, link }) => (
                  <li key={label}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-lg hover:text-green-400 transition-colors"
                    >
                      {icon}
                      <span>{label}</span>
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
