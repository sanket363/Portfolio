'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Activity, 
  Database, 
  Cloud, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Cpu,
  HardDrive,
  Wifi,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface MetricData {
  time: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  responseTime: number;
}

const DevOpsMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'API Gateway', status: 'healthy', uptime: '99.9%', responseTime: 45 },
    { name: 'Database', status: 'healthy', uptime: '99.8%', responseTime: 12 },
    { name: 'Redis Cache', status: 'warning', uptime: '98.5%', responseTime: 8 },
    { name: 'Load Balancer', status: 'healthy', uptime: '100%', responseTime: 3 },
    { name: 'Message Queue', status: 'healthy', uptime: '99.7%', responseTime: 15 },
    { name: 'CDN', status: 'critical', uptime: '95.2%', responseTime: 120 }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const generateMetrics = () => {
      const now = new Date();
      const newMetric: MetricData = {
        time: now.toLocaleTimeString(),
        cpu: Math.floor(Math.random() * 40) + 30,
        memory: Math.floor(Math.random() * 30) + 50,
        disk: Math.floor(Math.random() * 20) + 20,
        network: Math.floor(Math.random() * 50) + 10
      };
      
      setMetrics(prev => {
        const updated = [...prev, newMetric];
        return updated.slice(-20); // Keep last 20 data points
      });
    };

    // Initial data
    for (let i = 0; i < 10; i++) {
      setTimeout(() => generateMetrics(), i * 100);
    }

    // Real-time updates
    const interval = setInterval(generateMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-20 bg-black text-green-400">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 font-mono">
            <span className="text-green-400">$</span> DevOps Monitoring Dashboard
          </h2>
          <p className="text-gray-400 text-lg">Real-time infrastructure monitoring and alerting</p>
        </motion.div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: <Cpu className="w-6 h-6" />, label: 'CPU Usage', value: '67%', trend: '+2.3%' },
            { icon: <HardDrive className="w-6 h-6" />, label: 'Memory', value: '4.2GB', trend: '+0.8%' },
            { icon: <Wifi className="w-6 h-6" />, label: 'Network I/O', value: '1.2GB/s', trend: '+15.2%' },
            { icon: <Zap className="w-6 h-6" />, label: 'Requests/sec', value: '2.4K', trend: '+8.7%' }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-900 border border-green-400/20 rounded-lg p-6 hover:border-green-400/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-green-400">{metric.icon}</div>
                <span className="text-green-400 text-sm flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metric.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-gray-400 text-sm">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Real-time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 border border-green-400/20 rounded-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">System Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #10B981',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="cpu" stroke="#10B981" strokeWidth={2} name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#F59E0B" strokeWidth={2} name="Memory %" />
                <Line type="monotone" dataKey="network" stroke="#3B82F6" strokeWidth={2} name="Network %" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 border border-green-400/20 rounded-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">Resource Utilization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #10B981',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="disk" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Disk %" />
                <Area type="monotone" dataKey="memory" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Memory %" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Service Status Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900 border border-green-400/20 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold mb-6 text-green-400">Service Health Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-green-400/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">{service.name}</h4>
                  <div className={`flex items-center ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uptime:</span>
                    <span className="text-white">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response:</span>
                    <span className="text-white">{service.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={getStatusColor(service.status)}>{service.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Terminal Output Simulation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 bg-gray-900 border border-green-400/20 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold mb-4 text-green-400">Live System Logs</h3>
          <div className="bg-black rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400 mb-2">[INFO] 2024-01-24 18:37:19 - System monitoring active</div>
            <div className="text-blue-400 mb-2">[DEBUG] 2024-01-24 18:37:20 - CPU usage: 67% (normal)</div>
            <div className="text-yellow-400 mb-2">[WARN] 2024-01-24 18:37:21 - Redis cache latency increased</div>
            <div className="text-green-400 mb-2">[INFO] 2024-01-24 18:37:22 - Auto-scaling triggered: +2 instances</div>
            <div className="text-red-400 mb-2">[ERROR] 2024-01-24 18:37:23 - CDN endpoint timeout detected</div>
            <div className="text-green-400 mb-2">[INFO] 2024-01-24 18:37:24 - Failover to backup CDN successful</div>
            <div className="text-blue-400">[DEBUG] 2024-01-24 18:37:25 - All systems operational</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DevOpsMonitoring;
