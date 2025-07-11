import React from 'react';
import Projects from '../components/Projects';

const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-page py-16 px-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">My Projects</h2>
        <Projects />
      </div>
    </div>
  );
};

export default ProjectsPage;