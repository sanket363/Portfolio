import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import anime from 'animejs';
import ProjectCard from './ui/ProjectCard';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  homepage: string | null;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<GitHubRepo[]>('https://api.github.com/users/sanket363/repos');
        setProjects(response.data);
      } catch (err) {
        setError('Failed to fetch projects from GitHub.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (!loading && !error && projectsRef.current) {
      anime({
        targets: projectsRef.current.querySelectorAll('.project-card'),
        opacity: [0, 1],
        translateY: [50, 0],
        scale: [0.95, 1],
        easing: 'easeOutElastic(1, .8)',
        duration: 1200,
        delay: anime.stagger(150, { start: 300 })
      });
    }
  }, [loading, error]);

  if (loading) {
    return (
      <section id="projects" className="py-16 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
        <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          My DevOps Projects
        </h2>
        <div className="flex justify-center">
          <div className="animate-pulse h-8 w-8 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-16 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            My DevOps Projects
          </h2>
          <p className="text-center text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          My DevOps Projects
        </h2>
        <div 
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              description={project.description || 'No description provided.'}
              technologies={project.topics || []}
              githubLink={project.html_url}
              liveDemoLink={project.homepage || undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;