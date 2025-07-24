import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, Cpu, HardDrive, Network, RefreshCw, Server, Activity } from 'lucide-react';

const NODES = [
  {
    id: 'node-1',
    name: 'k8s-node-1',
    status: 'Ready',
    cpu: 35,
    memory: 60,
    pods: 8,
    role: 'worker',
    ip: '10.0.1.5'
  },
  {
    id: 'node-2',
    name: 'k8s-node-2',
    status: 'Ready',
    cpu: 45,
    memory: 70,
    pods: 6,
    role: 'worker',
    ip: '10.0.1.6'
  },
  {
    id: 'node-3',
    name: 'k8s-master',
    status: 'Ready',
    cpu: 25,
    memory: 40,
    pods: 4,
    role: 'control-plane',
    ip: '10.0.1.4'
  }
];

const PODS = [
  { id: 'pod-1', name: 'frontend-xyz', status: 'Running', node: 'k8s-node-1', cpu: '10m', memory: '128Mi' },
  { id: 'pod-2', name: 'backend-abc', status: 'Running', node: 'k8s-node-1', cpu: '100m', memory: '256Mi' },
  { id: 'pod-3', name: 'database-123', status: 'Running', node: 'k8s-node-2', cpu: '200m', memory: '512Mi' },
  { id: 'pod-4', name: 'cache-redis', status: 'Running', node: 'k8s-node-2', cpu: '50m', memory: '128Mi' },
  { id: 'pod-5', name: 'monitoring', status: 'Running', node: 'k8s-master', cpu: '100m', memory: '256Mi' },
];

const ContainerOrchestration: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clusterStatus, setClusterStatus] = useState('Healthy');
  const [pods, setPods] = useState(PODS);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Simulate pod status changes
    const podUpdateInterval = setInterval(() => {
      setPods(prevPods => 
        prevPods.map(pod => ({
          ...pod,
          cpu: `${Math.max(10, Math.min(300, parseInt(pod.cpu) + (Math.random() > 0.5 ? 5 : -5)))}m`,
          memory: `${Math.max(64, Math.min(1024, parseInt(pod.memory) + (Math.random() > 0.5 ? 8 : -8)))}Mi`
        }))
      );
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(podUpdateInterval);
    };
  }, []);

  const filteredPods = selectedNode 
    ? pods.filter(pod => pod.node === selectedNode) 
    : pods;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="w-5 h-5" />
          Container Orchestration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                clusterStatus === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">Cluster Status: {clusterStatus}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span>CPU: 35%</span>
              </div>
              <div className="flex items-center gap-1">
                <HardDrive className="w-4 h-4 text-purple-500" />
                <span>Memory: 65%</span>
              </div>
              <div className="flex items-center gap-1">
                <Box className="w-4 h-4 text-green-500" />
                <span>Pods: {pods.length}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NODES.map((node) => (
              <motion.div
                key={node.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedNode(selectedNode === node.name ? null : node.name)}
                className={`p-4 rounded-lg border ${
                  selectedNode === node.name
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      {node.name}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                        {node.role}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{node.ip}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                      {node.status}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>CPU: {node.cpu}%</span>
                      <span>{node.pods} pods</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${node.cpu}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs mb-1">Memory: {node.memory}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${node.memory}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-medium">Pods {selectedNode ? `on ${selectedNode}` : 'in Cluster'}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  {filteredPods.length} pods
                </span>
                <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Node</th>
                    <th className="px-4 py-2 text-right">CPU</th>
                    <th className="px-4 py-2 text-right">Memory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPods.map((pod) => (
                    <tr key={pod.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-2 font-medium">{pod.name}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center gap-1.5`}>
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(pod.status)}`}></span>
                          {pod.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{pod.node}</td>
                      <td className="px-4 py-2 text-right">{pod.cpu}</td>
                      <td className="px-4 py-2 text-right">{pod.memory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContainerOrchestration;
