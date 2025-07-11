import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import anime from 'animejs';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import Blog from './components/Blog';

function App() {
  // Initialize animations on mount
  useEffect(() => {
    // Basic entrance animation for testing
    anime({
      targets: '.app-container',
      opacity: [0, 1],
      duration: 800,
      easing: 'easeInOutQuad'
    });
  }, []);

  return (
    <div className="app-container min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;