import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink, GitFork, Star, Clock, Box, GitBranch } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

const languageColors: { [key: string]: string } = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-500',
  Python: 'bg-green-500',
  Java: 'bg-red-500',
  Go: 'bg-cyan-500',
  Ruby: 'bg-red-600',
  Shell: 'bg-gray-500',
  HTML: 'bg-orange-500',
  CSS: 'bg-purple-500',
  default: 'bg-gray-400'
};

export function Projects() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get('https://api.github.com/users/sanket363/repos');
        const sortedRepos = response.data.sort((a: Repository, b: Repository) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setRepos(sortedRepos);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch repositories');
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <GitBranch className="w-12 h-12 text-blue-400 animate-spin" />
            <p className="text-white text-lg">Loading repositories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block p-6 bg-red-500/10 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            GitHub Projects
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Explore my latest projects and contributions. Each repository represents a unique challenge
            and solution in the world of DevOps and infrastructure automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.map((repo, index) => (
            <div 
              key={repo.id}
              className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl 
                       transition-all duration-300 hover:-translate-y-2"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'slideUp 0.5s ease-out forwards'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Box className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      <a href={repo.html_url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                        {repo.name}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </h3>
                  </div>
                </div>

                <p className="text-slate-300 mb-6 line-clamp-2 min-h-[3rem]">
                  {repo.description || 'No description available'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  {repo.language && (
                    <span className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${languageColors[repo.language] || languageColors.default}`} />
                      {repo.language}
                    </span>
                  )}
                  
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {repo.stargazers_count}
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    {repo.forks_count}
                  </span>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <span className="text-sm text-slate-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Updated {formatDate(repo.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}