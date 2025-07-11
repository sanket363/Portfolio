import React, { useEffect, useState } from 'react';
import { Projects } from '../components/Projects';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function ProjectsPage() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(
          'https://api.github.com/users/sanket363/repos?sort=updated&direction=desc'
        );
        setRepos(response.data);
      } catch (error) {
        console.error('Error fetching GitHub repos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-20">
      <div className="container mx-auto px-4">
        <Tabs 
          defaultValue="featured" 
          className="mb-12"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-slate-800">
            <TabsTrigger value="featured" className="data-[state=active]:bg-blue-600 text-white">
              Featured Projects
            </TabsTrigger>
            <TabsTrigger value="github" className="data-[state=active]:bg-blue-600 text-white">
              GitHub Repos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured">
            <Projects />
          </TabsContent>
          
          <TabsContent value="github">
            {loading ? (
              <div className="text-center text-white">
                Loading GitHub projects...
              </div>
            ) : (
              <Projects repos={repos} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}