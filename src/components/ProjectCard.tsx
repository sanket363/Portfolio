'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { SiGithub } from 'react-icons/si';
import type { Project } from '@/types';

const ProjectCard = ({ title, description, tags, imageUrl, githubUrl, liveUrl, ciCdBrief }: Project) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="bg-ctp-surface0 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border-2 border-ctp-surface1"
    >
      <div className="relative w-full h-56">
        <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-ctp-mauve mb-2">{title}</h3>
        <p className="text-ctp-subtext1 mb-4 flex-grow">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="bg-ctp-surface1 text-ctp-sky text-sm font-semibold px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-ctp-surface2">
          <p className="text-ctp-green text-sm mb-3"><span className="font-bold">CI/CD:</span> {ciCdBrief}</p>
          <div className="flex justify-between items-center">
            <p className="text-ctp-yellow text-sm italic">Arch Diagram: [WIP]</p>
            <div className="flex items-center gap-4">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-ctp-lavender hover:text-ctp-pink transition-colors">
                <SiGithub size={24} />
              </a>
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-ctp-lavender hover:text-ctp-pink transition-colors">
                  <FaExternalLinkAlt size={22} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
