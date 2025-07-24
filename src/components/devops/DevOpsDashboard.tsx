import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Server, Cpu, BarChart2, Code, Box, Activity } from 'lucide-react';
import SystemMetrics from './monitoring/SystemMetrics';
import PipelineVisualization from './ci-cd/PipelineVisualization';
import InfrastructureAsCode from './iac/InfrastructureAsCode';
import ContainerOrchestration from './containers/ContainerOrchestration';
import PerformanceAnalytics from './analytics/PerformanceAnalytics';

const DevOpsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'monitoring', label: 'Monitoring', icon: <Activity className="w-4 h-4" /> },
    { id: 'ci-cd', label: 'CI/CD', icon: <Terminal className="w-4 h-4" /> },
    { id: 'infrastructure', label: 'Infrastructure', icon: <Server className="w-4 h-4" /> },
    { id: 'containers', label: 'Containers', icon: <Box className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-56 flex-shrink-0">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-600" />
                  DevOps Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === item.id
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className={`${activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </motion.button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SystemMetrics />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">CI/CD Pipeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PipelineVisualization />
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Container Orchestration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContainerOrchestration />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PerformanceAnalytics />
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === 'monitoring' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <SystemMetrics />
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'ci-cd' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CI/CD Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <PipelineVisualization />
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'infrastructure' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Infrastructure as Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <InfrastructureAsCode />
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'containers' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Container Orchestration</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContainerOrchestration />
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'analytics' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceAnalytics />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevOpsDashboard;
