import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  if (loading) {
    return (
      <section id="projects" className="py-16 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">My DevOps Projects</h2>
          <p className="text-center">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-16 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">My DevOps Projects</h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
  return (
    <section id="projects" className="py-16 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">My DevOps Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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