import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  NodeTypes,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from 'reactflow';
import { Play, CheckCircle, XCircle, Clock, GitBranch, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Custom node types
const StageNode = ({ data, selected }: any) => {
  const statusColors = {
    success: 'bg-green-500',
    failed: 'bg-red-500',
    running: 'bg-blue-500',
    pending: 'bg-yellow-500',
  };

  const statusIcons = {
    success: <CheckCircle className="w-5 h-5 text-white" />,
    failed: <XCircle className="w-5 h-5 text-white" />,
    running: <RefreshCw className="w-5 h-5 text-white animate-spin" />,
    pending: <Clock className="w-5 h-5 text-white" />,
  };

  return (
    <div className={`px-4 py-2 rounded-lg shadow-md border ${selected ? 'ring-2 ring-indigo-500' : ''} bg-white dark:bg-gray-800`}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusColors[data.status as keyof typeof statusColors]}`}>
          {statusIcons[data.status as keyof typeof statusIcons]}
        </div>
        <div>
          <div className="font-semibold">{data.label}</div>
          <div className="text-xs text-gray-500">{data.duration || '0s'}</div>
        </div>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  stage: StageNode,
};

const PipelineVisualization: React.FC = () => {
  const [pipelineStatus, setPipelineStatus] = useState<'success' | 'failed' | 'running' | 'pending'>('running');
  const [activeStage, setActiveStage] = useState<number>(0);
  
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'stage',
      position: { x: 100, y: 50 },
      data: { 
        label: 'Build', 
        status: 'success',
        duration: '45s',
      },
    },
    {
      id: '2',
      type: 'stage',
      position: { x: 100, y: 150 },
      data: { 
        label: 'Test', 
        status: 'success',
        duration: '1m 23s',
      },
    },
    {
      id: '3',
      type: 'stage',
      position: { x: 100, y: 250 },
      data: { 
        label: 'Deploy to Staging', 
        status: 'running',
        duration: '32s',
      },
    },
    {
      id: '4',
      type: 'stage',
      position: { x: 100, y: 350 },
      data: { 
        label: 'Integration Tests', 
        status: 'pending',
      },
    },
    {
      id: '5',
      type: 'stage',
      position: { x: 100, y: 450 },
      data: { 
        label: 'Deploy to Production', 
        status: 'pending',
      },
    },
  ];

  const initialEdges: Edge[] = [
    { 
      id: 'e1-2', 
      source: '1', 
      target: '2',
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#6366f1',
      },
      style: {
        stroke: '#6366f1',
        strokeWidth: 2,
      },
    },
    { 
      id: 'e2-3', 
      source: '2', 
      target: '3',
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#6366f1',
      },
      style: {
        stroke: '#6366f1',
        strokeWidth: 2,
      },
    },
    { 
      id: 'e3-4', 
      source: '3', 
      target: '4',
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#6366f1',
      },
      style: {
        stroke: '#6366f1',
        strokeWidth: 2,
      },
    },
    { 
      id: 'e4-5', 
      source: '4', 
      target: '5',
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#6366f1',
      },
      style: {
        stroke: '#6366f1',
        strokeWidth: 2,
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const runPipeline = useCallback(() => {
    setPipelineStatus('running');
    setActiveStage(0);
    
    // Simulate pipeline running
    const stages = [...nodes];
    
    const runStage = (index: number) => {
      if (index >= stages.length) {
        setPipelineStatus('success');
        return;
      }
      
      setActiveStage(index);
      
      // Update current stage to running
      stages[index].data.status = 'running';
      setNodes([...stages]);
      
      // Simulate stage completion after delay
      setTimeout(() => {
        stages[index].data.status = 'success';
        if (Math.random() < 0.2) { // 20% chance of failure
          stages[index].data.status = 'failed';
          setPipelineStatus('failed');
          setNodes([...stages]);
          return;
        }
        
        setNodes([...stages]);
        runStage(index + 1);
      }, 2000);
    };
    
    runStage(0);
  }, [nodes, setNodes]);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            CI/CD Pipeline
          </CardTitle>
          <motion.button
            onClick={runPipeline}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              pipelineStatus === 'running'
                ? 'bg-blue-600 text-white'
                : pipelineStatus === 'success'
                ? 'bg-green-600 text-white'
                : pipelineStatus === 'failed'
                ? 'bg-red-600 text-white'
                : 'bg-indigo-600 text-white'
            }`}
          >
            <Play className="w-4 h-4" />
            {pipelineStatus === 'running' ? 'Running...' : 'Run Pipeline'}
          </motion.button>
        </div>
      </CardHeader>
      <CardContent className="h-[500px] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
        >
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
        
        {pipelineStatus === 'running' && (
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border dark:border-gray-700">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
              <span className="font-medium">
                {activeStage >= 0 && nodes[activeStage]?.data.label}
              </span>
              <span className="text-sm text-gray-500">in progress...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PipelineVisualization;
