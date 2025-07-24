import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Cpu, HardDrive, Network, Memory } from 'lucide-react';

interface Metric {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  networkIn: number;
  networkOut: number;
}

const SystemMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time data
    const interval = setInterval(() => {
      const newMetric: Metric = {
        timestamp: new Date().toISOString(),
        cpu: Math.random() * 100,
        memory: 30 + Math.random() * 70, // 30-100%
        disk: 10 + Math.random() * 40,    // 10-50%
        networkIn: Math.random() * 100,
        networkOut: Math.random() * 80,
      };
      
      setMetrics(prev => {
        const updated = [...prev, newMetric].slice(-10); // Keep last 10 data points
        return updated;
      });
      
      setIsLoading(false);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: metrics.map((_, i) => i),
    datasets: [
      {
        label: 'CPU %',
        data: metrics.map(m => m.cpu),
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.1,
      },
      {
        label: 'Memory %',
        data: metrics.map(m => m.memory),
        borderColor: 'rgb(236, 72, 153)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard 
                icon={<Cpu className="w-6 h-6" />} 
                title="CPU" 
                value={`${metrics[metrics.length - 1]?.cpu.toFixed(1)}%`} 
                trend="up"
              />
              <MetricCard 
                icon={<Memory className="w-6 h-6" />} 
                title="Memory" 
                value={`${metrics[metrics.length - 1]?.memory.toFixed(1)}%`} 
                trend="up"
              />
              <MetricCard 
                icon={<HardDrive className="w-6 h-6" />} 
                title="Disk" 
                value={`${metrics[metrics.length - 1]?.disk.toFixed(1)}%`} 
                trend="stable"
              />
              <MetricCard 
                icon={<Network className="w-6 h-6" />} 
                title="Network" 
                value={`${(metrics[metrics.length - 1]?.networkIn / 10).toFixed(1)} MB/s`} 
                trend="down"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ icon, title, value, trend }: { icon: React.ReactNode; title: string; value: string; trend: 'up' | 'down' | 'stable' }) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-yellow-500',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→',
  };

  return (
    <motion.div 
      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
        <span className={`text-2xl font-bold ${trendColors[trend]}`}>
          {trendIcons[trend]}
        </span>
      </div>
    </motion.div>
  );
};

export default SystemMetrics;
