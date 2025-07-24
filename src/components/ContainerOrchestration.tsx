'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Container, 
  Server, 
  Activity, 
  Cpu, 
  HardDrive, 
  Network,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  Shield
} from 'lucide-react';

interface ContainerInstance {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'restarting' | 'error';
  cpu: number;
  memory: number;
  network: number;
  uptime: string;
  replicas: number;
  image: string;
}

interface Node {
  id: string;
  name: string;
  status: 'ready' | 'not-ready' | 'scheduling-disabled';
  cpu: number;
  memory: number;
  pods: number;
  maxPods: number;
  region: string;
}

const ContainerOrchestration: React.FC = () => {
  const [containers, setContainers] = useState<ContainerInstance[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const [autoScale, setAutoScale] = useState(true);

  const initialContainers: ContainerInstance[] = [
    {
      id: 'web-1',
      name: 'devops-portfolio-web',
      status: 'running',
      cpu: 45,
      memory: 67,
      network: 23,
      uptime: '2d 14h',
      replicas: 3,
      image: 'sanket363/devops-portfolio:v1.2.0'
    },
    {
      id: 'api-1',
      name: 'portfolio-api',
      status: 'running',
      cpu: 32,
      memory: 54,
      network: 18,
      uptime: '2d 14h',
      replicas: 2,
      image: 'sanket363/portfolio-api:v1.1.0'
    },
    {
      id: 'worker-1',
      name: 'background-worker',
      status: 'running',
      cpu: 28,
      memory: 41,
      network: 12,
      uptime: '1d 8h',
      replicas: 1,
      image: 'sanket363/portfolio-worker:v1.0.5'
    },
    {
      id: 'cache-1',
      name: 'redis-cache',
      status: 'running',
      cpu: 15,
      memory: 89,
      network: 35,
      uptime: '5d 2h',
      replicas: 1,
      image: 'redis:7-alpine'
    },
    {
      id: 'db-1',
      name: 'postgresql-db',
      status: 'running',
      cpu: 22,
      memory: 78,
      network: 28,
      uptime: '7d 12h',
      replicas: 1,
      image: 'postgres:14-alpine'
    },
    {
      id: 'monitor-1',
      name: 'prometheus',
      status: 'running',
      cpu: 18,
      memory: 45,
      network: 15,
      uptime: '3d 6h',
      replicas: 1,
      image: 'prom/prometheus:latest'
    }
  ];

  const initialNodes: Node[] = [
    {
      id: 'node-1',
      name: 'worker-node-1',
      status: 'ready',
      cpu: 65,
      memory: 72,
      pods: 8,
      maxPods: 12,
      region: 'us-east-1a'
    },
    {
      id: 'node-2',
      name: 'worker-node-2',
      status: 'ready',
      cpu: 43,
      memory: 58,
      pods: 6,
      maxPods: 12,
      region: 'us-east-1b'
    },
    {
      id: 'node-3',
      name: 'worker-node-3',
      status: 'ready',
      cpu: 38,
      memory: 51,
      pods: 5,
      maxPods: 12,
      region: 'us-east-1c'
    }
  ];

  useEffect(() => {
    setContainers(initialContainers);
    setNodes(initialNodes);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setContainers(prev => prev.map(container => ({
        ...container,
        cpu: Math.max(10, Math.min(90, container.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, container.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(5, Math.min(50, container.network + (Math.random() - 0.5) * 6))
      })));

      setNodes(prev => prev.map(node => ({
        ...node,
        cpu: Math.max(20, Math.min(85, node.cpu + (Math.random() - 0.5) * 8)),
        memory: Math.max(30, Math.min(90, node.memory + (Math.random() - 0.5) * 6))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': case 'ready': return 'text-green-400 border-green-400';
      case 'stopped': case 'not-ready': return 'text-red-400 border-red-400';
      case 'restarting': return 'text-yellow-400 border-yellow-400';
      case 'scheduling-disabled': return 'text-gray-400 border-gray-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'stopped': case 'not-ready': return <AlertTriangle className="w-4 h-4" />;
      case 'restarting': return <RotateCcw className="w-4 h-4 animate-spin" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleContainerAction = (containerId: string, action: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? { ...container, status: action === 'restart' ? 'restarting' : action as any }
        : container
    ));

    // Simulate action completion
    setTimeout(() => {
      setContainers(prev => prev.map(container => 
        container.id === containerId 
          ? { ...container, status: action === 'stop' ? 'stopped' : 'running' }
          : container
      ));
    }, 2000);
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 font-mono">
            <span className="text-blue-400">$</span> Container Orchestration
          </h2>
          <p className="text-gray-400 text-lg">Kubernetes cluster management and container lifecycle automation</p>
        </motion.div>

        {/* Cluster Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { 
              icon: <Container className="w-6 h-6" />, 
              label: 'Running Pods', 
              value: containers.filter(c => c.status === 'running').length.toString(),
              color: 'text-green-400'
            },
            { 
              icon: <Server className="w-6 h-6" />, 
              label: 'Active Nodes', 
              value: nodes.filter(n => n.status === 'ready').length.toString(),
              color: 'text-blue-400'
            },
            { 
              icon: <Users className="w-6 h-6" />, 
              label: 'Total Replicas', 
              value: containers.reduce((sum, c) => sum + c.replicas, 0).toString(),
              color: 'text-purple-400'
            },
            { 
              icon: <Zap className="w-6 h-6" />, 
              label: 'Auto-scaling', 
              value: autoScale ? 'Enabled' : 'Disabled',
              color: autoScale ? 'text-green-400' : 'text-red-400'
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center"
            >
              <div className={`flex justify-center mb-3 ${metric.color}`}>
                {metric.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-gray-400 text-sm">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Container Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-blue-400">Container Instances</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoScale}
                  onChange={(e) => setAutoScale(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Auto-scaling</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {containers.map((container, index) => (
              <motion.div
                key={container.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-gray-800 border rounded-lg p-4 hover:border-blue-400/40 transition-colors cursor-pointer ${
                  selectedContainer === container.id ? 'border-blue-400' : 'border-gray-600'
                }`}
                onClick={() => setSelectedContainer(container.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Container className="w-5 h-5 text-blue-400" />
                    <div>
                      <h4 className="font-semibold text-white">{container.name}</h4>
                      <p className="text-xs text-gray-400">{container.image}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 ${getStatusColor(container.status)}`}>
                    {getStatusIcon(container.status)}
                    <span className="text-sm font-medium">{container.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{container.cpu}%</div>
                    <div className="text-xs text-gray-400 flex items-center justify-center">
                      <Cpu className="w-3 h-3 mr-1" />
                      CPU
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{container.memory}%</div>
                    <div className="text-xs text-gray-400 flex items-center justify-center">
                      <HardDrive className="w-3 h-3 mr-1" />
                      Memory
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{container.network}%</div>
                    <div className="text-xs text-gray-400 flex items-center justify-center">
                      <Network className="w-3 h-3 mr-1" />
                      Network
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-400">
                    Uptime: <span className="text-white">{container.uptime}</span>
                  </div>
                  <div className="text-gray-400">
                    Replicas: <span className="text-white">{container.replicas}</span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContainerAction(container.id, 'restart');
                    }}
                    className="flex items-center space-x-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restart</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContainerAction(container.id, container.status === 'running' ? 'stop' : 'start');
                    }}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
                      container.status === 'running' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {container.status === 'running' ? (
                      <>
                        <Pause className="w-3 h-3" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Start</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Node Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-blue-400 mb-6">Cluster Nodes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-800 border border-gray-600 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Server className="w-5 h-5 text-blue-400" />
                    <div>
                      <h4 className="font-semibold text-white">{node.name}</h4>
                      <p className="text-xs text-gray-400">{node.region}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 ${getStatusColor(node.status)}`}>
                    {getStatusIcon(node.status)}
                    <span className="text-xs">{node.status}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">CPU Usage</span>
                    <span className="text-sm text-white">{node.cpu}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${node.cpu}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Memory Usage</span>
                    <span className="text-sm text-white">{node.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${node.memory}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Pod Capacity</span>
                    <span className="text-sm text-white">{node.pods}/{node.maxPods}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(node.pods / node.maxPods) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Kubernetes Commands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-900 border border-gray-700 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold text-blue-400 mb-4">Common Kubernetes Commands</h3>
          <div className="bg-black rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400 mb-2">$ kubectl get pods --all-namespaces</div>
            <div className="text-gray-300 mb-3">NAMESPACE     NAME                           READY   STATUS    RESTARTS   AGE</div>
            <div className="text-gray-300 mb-1">production    devops-portfolio-web-1         1/1     Running   0          2d</div>
            <div className="text-gray-300 mb-1">production    devops-portfolio-web-2         1/1     Running   0          2d</div>
            <div className="text-gray-300 mb-1">production    devops-portfolio-web-3         1/1     Running   0          2d</div>
            <div className="text-gray-300 mb-4">production    portfolio-api-1                1/1     Running   0          2d</div>
            
            <div className="text-green-400 mb-2">$ kubectl describe deployment devops-portfolio-web</div>
            <div className="text-gray-300 mb-1">Name:                   devops-portfolio-web</div>
            <div className="text-gray-300 mb-1">Namespace:              production</div>
            <div className="text-gray-300 mb-1">Replicas:               3 desired | 3 updated | 3 total | 3 available</div>
            <div className="text-gray-300 mb-4">StrategyType:           RollingUpdate</div>
            
            <div className="text-green-400 mb-2">$ kubectl top nodes</div>
            <div className="text-gray-300 mb-1">NAME            CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%</div>
            <div className="text-gray-300 mb-1">worker-node-1   650m         65%    2.9Gi           72%</div>
            <div className="text-gray-300 mb-1">worker-node-2   430m         43%    2.3Gi           58%</div>
            <div className="text-gray-300">worker-node-3   380m         38%    2.0Gi           51%</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContainerOrchestration;
