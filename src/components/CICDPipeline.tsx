'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight,
  Code,
  TestTube,
  Package,
  Rocket,
  Shield,
  Database,
  Server,
  AlertCircle
} from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  duration: string;
  description: string;
}

interface Pipeline {
  id: string;
  branch: string;
  commit: string;
  author: string;
  timestamp: string;
  stages: PipelineStage[];
  overallStatus: 'pending' | 'running' | 'success' | 'failed';
}

const CICDPipeline: React.FC = () => {
  const [activePipeline, setActivePipeline] = useState<Pipeline | null>(null);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const samplePipelines: Pipeline[] = [
    {
      id: 'pipeline-1',
      branch: 'main',
      commit: 'a1b2c3d',
      author: 'sanket363',
      timestamp: '2 minutes ago',
      overallStatus: 'running',
      stages: [
        { id: 'checkout', name: 'Checkout', icon: <GitBranch className="w-4 h-4" />, status: 'success', duration: '15s', description: 'Clone repository and checkout code' },
        { id: 'build', name: 'Build', icon: <Code className="w-4 h-4" />, status: 'success', duration: '2m 30s', description: 'Compile and build application' },
        { id: 'test', name: 'Test', icon: <TestTube className="w-4 h-4" />, status: 'running', duration: '1m 45s', description: 'Run unit and integration tests' },
        { id: 'security', name: 'Security Scan', icon: <Shield className="w-4 h-4" />, status: 'pending', duration: '-', description: 'SAST and dependency vulnerability scan' },
        { id: 'package', name: 'Package', icon: <Package className="w-4 h-4" />, status: 'pending', duration: '-', description: 'Create Docker image and push to registry' },
        { id: 'deploy-staging', name: 'Deploy Staging', icon: <Server className="w-4 h-4" />, status: 'pending', duration: '-', description: 'Deploy to staging environment' },
        { id: 'e2e-tests', name: 'E2E Tests', icon: <TestTube className="w-4 h-4" />, status: 'pending', duration: '-', description: 'Run end-to-end tests' },
        { id: 'deploy-prod', name: 'Deploy Production', icon: <Rocket className="w-4 h-4" />, status: 'pending', duration: '-', description: 'Deploy to production environment' }
      ]
    },
    {
      id: 'pipeline-2',
      branch: 'feature/monitoring',
      commit: 'x9y8z7w',
      author: 'sanket363',
      timestamp: '15 minutes ago',
      overallStatus: 'success',
      stages: [
        { id: 'checkout', name: 'Checkout', icon: <GitBranch className="w-4 h-4" />, status: 'success', duration: '12s', description: 'Clone repository and checkout code' },
        { id: 'build', name: 'Build', icon: <Code className="w-4 h-4" />, status: 'success', duration: '2m 15s', description: 'Compile and build application' },
        { id: 'test', name: 'Test', icon: <TestTube className="w-4 h-4" />, status: 'success', duration: '3m 20s', description: 'Run unit and integration tests' },
        { id: 'security', name: 'Security Scan', icon: <Shield className="w-4 h-4" />, status: 'success', duration: '1m 30s', description: 'SAST and dependency vulnerability scan' },
        { id: 'package', name: 'Package', icon: <Package className="w-4 h-4" />, status: 'success', duration: '45s', description: 'Create Docker image and push to registry' },
        { id: 'deploy-staging', name: 'Deploy Staging', icon: <Server className="w-4 h-4" />, status: 'success', duration: '1m 10s', description: 'Deploy to staging environment' },
        { id: 'e2e-tests', name: 'E2E Tests', icon: <TestTube className="w-4 h-4" />, status: 'success', duration: '4m 30s', description: 'Run end-to-end tests' }
      ]
    },
    {
      id: 'pipeline-3',
      branch: 'hotfix/security-patch',
      commit: 'm5n4o3p',
      author: 'sanket363',
      timestamp: '1 hour ago',
      overallStatus: 'failed',
      stages: [
        { id: 'checkout', name: 'Checkout', icon: <GitBranch className="w-4 h-4" />, status: 'success', duration: '10s', description: 'Clone repository and checkout code' },
        { id: 'build', name: 'Build', icon: <Code className="w-4 h-4" />, status: 'success', duration: '2m 05s', description: 'Compile and build application' },
        { id: 'test', name: 'Test', icon: <TestTube className="w-4 h-4" />, status: 'failed', duration: '1m 20s', description: 'Run unit and integration tests' },
        { id: 'security', name: 'Security Scan', icon: <Shield className="w-4 h-4" />, status: 'skipped', duration: '-', description: 'SAST and dependency vulnerability scan' },
        { id: 'package', name: 'Package', icon: <Package className="w-4 h-4" />, status: 'skipped', duration: '-', description: 'Create Docker image and push to registry' }
      ]
    }
  ];

  useEffect(() => {
    setPipelines(samplePipelines);
    setActivePipeline(samplePipelines[0]);
  }, []);

  // Simulate pipeline progression
  useEffect(() => {
    if (activePipeline && activePipeline.overallStatus === 'running') {
      const interval = setInterval(() => {
        setCurrentStageIndex(prev => {
          const nextIndex = prev + 1;
          if (nextIndex < activePipeline.stages.length) {
            return nextIndex;
          }
          return prev;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [activePipeline]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 border-green-400';
      case 'failed': return 'text-red-400 border-red-400';
      case 'running': return 'text-blue-400 border-blue-400';
      case 'pending': return 'text-gray-400 border-gray-600';
      case 'skipped': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'running': return <Clock className="w-4 h-4 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'skipped': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 font-mono">
            <span className="text-blue-400">$</span> CI/CD Pipeline Visualization
          </h2>
          <p className="text-gray-400 text-lg">Automated deployment pipeline with real-time monitoring</p>
        </motion.div>

        {/* Pipeline Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {pipelines.map((pipeline) => (
              <motion.button
                key={pipeline.id}
                onClick={() => setActivePipeline(pipeline)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  activePipeline?.id === pipeline.id 
                    ? 'border-blue-400 bg-blue-400/10 text-blue-400' 
                    : 'border-gray-600 hover:border-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-4 h-4" />
                  <span>{pipeline.branch}</span>
                  <span className="text-xs text-gray-400">({pipeline.commit})</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active Pipeline Details */}
        {activePipeline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black border border-gray-700 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-blue-400">
                  Pipeline: {activePipeline.branch}
                </h3>
                <p className="text-gray-400">
                  Commit {activePipeline.commit} by {activePipeline.author} • {activePipeline.timestamp}
                </p>
              </div>
              <div className={`flex items-center space-x-2 ${getStatusColor(activePipeline.overallStatus)}`}>
                {getStatusIcon(activePipeline.overallStatus)}
                <span className="font-semibold capitalize">{activePipeline.overallStatus}</span>
              </div>
            </div>

            {/* Pipeline Stages */}
            <div className="space-y-4">
              {activePipeline.stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`flex items-center p-4 rounded-lg border ${
                    stage.status === 'running' ? 'bg-blue-400/5' : 'bg-gray-800/50'
                  } ${getStatusColor(stage.status)}`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`p-2 rounded-full border ${getStatusColor(stage.status)}`}>
                      {stage.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{stage.name}</h4>
                      <p className="text-sm text-gray-400">{stage.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center space-x-2 ${getStatusColor(stage.status)}`}>
                        {getStatusIcon(stage.status)}
                        <span className="font-semibold capitalize">{stage.status}</span>
                      </div>
                      <p className="text-sm text-gray-400">{stage.duration}</p>
                    </div>
                  </div>
                  {index < activePipeline.stages.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-600 ml-4" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pipeline Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Success Rate', value: '94.2%', icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-400' },
            { label: 'Avg Duration', value: '8m 45s', icon: <Clock className="w-5 h-5" />, color: 'text-blue-400' },
            { label: 'Deployments Today', value: '12', icon: <Rocket className="w-5 h-5" />, color: 'text-purple-400' },
            { label: 'Failed Builds', value: '3', icon: <XCircle className="w-5 h-5" />, color: 'text-red-400' }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center"
            >
              <div className={`flex justify-center mb-3 ${metric.color}`}>
                {metric.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-gray-400 text-sm">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* YAML Configuration Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold mb-4 text-blue-400">Pipeline Configuration</h3>
          <div className="bg-black rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-300">
{`name: DevOps Portfolio CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:coverage
        
      - name: Security audit
        run: npm audit --audit-level high
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}`}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CICDPipeline;
