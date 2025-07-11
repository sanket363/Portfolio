import React from 'react';

const Blog: React.FC = () => {
  return (
    <section id="blog" className="py-16 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example Blog Post Card */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
            <img src="https://via.placeholder.com/400x250" alt="Blog Post Image" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">My First DevOps Post</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">Published on October 26, 2023</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">A brief overview of my journey into DevOps and some initial thoughts on automation.</p>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Read More &rarr;</a>
            </div>
          </div>

          {/* Add more blog post cards as needed */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
            <img src="https://via.placeholder.com/400x250" alt="Blog Post Image" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Kubernetes Best Practices</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">Published on November 15, 2023</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">Exploring essential practices for deploying and managing applications on Kubernetes.</p>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Read More &rarr;</a>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
            <img src="https://via.placeholder.com/400x250" alt="Blog Post Image" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">CI/CD with GitHub Actions</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">Published on December 1, 2023</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">A step-by-step guide to setting up continuous integration and deployment using GitHub Actions.</p>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Read More &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;