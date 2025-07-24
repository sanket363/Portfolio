"use client";

import React from "react";
import { Briefcase, Award, ExternalLink } from "lucide-react";

const experiences = [
  {
    role: "DevOps Engineer",
    company: "[Your Company]",
    period: "2023 - Present",
    description: "Building and automating CI/CD pipelines, managing cloud infrastructure, and ensuring system reliability.",
    link: "https://www.linkedin.com/in/sanket-bhalke-devops/"
  },
  {
    role: "Cloud Intern",
    company: "[Previous Company]",
    period: "2022 - 2023",
    description: "Worked on AWS migrations, automated deployment scripts, and monitored production systems.",
    link: "https://www.linkedin.com/in/sanket-bhalke-devops/"
  }
];

const certifications = [
  {
    name: "AWS Certified Solutions Architect Associate",
    issuer: "Amazon Web Services",
    year: "2023",
    link: "https://www.credly.com/"
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation",
    year: "2023",
    link: "https://www.cncf.io/"
  },
  {
    name: "Docker Certified Associate",
    issuer: "Docker",
    year: "2022",
    link: "https://www.docker.com/certification/"
  }
];

const ExperienceCertsSection: React.FC = () => (
  <section className="py-20 bg-gray-950 text-white">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 font-mono">
          <span className="text-yellow-400">$</span> Experience & Certifications
        </h2>
        <p className="text-gray-400 text-lg">Professional journey and achievements</p>
      </div>

      {/* Experience Timeline */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6 text-yellow-400 flex items-center"><Briefcase className="w-6 h-6 mr-2"/>Experience</h3>
        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-700 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="font-semibold text-lg text-yellow-300">{exp.role}</div>
                <div className="text-gray-300">{exp.company}</div>
                <div className="text-gray-400 text-sm mb-2">{exp.period}</div>
                <div className="text-gray-400 text-sm">{exp.description}</div>
              </div>
              <a href={exp.link} target="_blank" rel="noopener noreferrer" className="mt-4 md:mt-0 text-yellow-400 hover:underline flex items-center">
                <ExternalLink className="w-4 h-4 mr-1"/>View
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-yellow-400 flex items-center"><Award className="w-6 h-6 mr-2"/>Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
              <div className="font-semibold text-lg text-yellow-300 mb-2">{cert.name}</div>
              <div className="text-gray-300 mb-1">{cert.issuer}</div>
              <div className="text-gray-400 text-xs mb-2">{cert.year}</div>
              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline flex items-center justify-center">
                <ExternalLink className="w-4 h-4 mr-1"/>Verify
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ExperienceCertsSection;
