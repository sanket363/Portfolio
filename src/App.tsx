import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import anime from 'animejs';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import Blog from './components/Blog';
import Contact from './components/Contact';

function App() {
  useEffect(() => {
    anime({
      targets: '.app-container',
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeInOutQuad',
      complete: () => {
        document.querySelector('.app-container')?.classList.add('animate');
      },
    });
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;