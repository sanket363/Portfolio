import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown, 
  Server, 
  HardDrive, 
  Cpu, 
  Network, 
  Search,
  Filter,
  Download
} from 'lucide-react';

// Mock data for charts
const generateTimeSeriesData = (count: number, min: number, max: number) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

const timeLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const PerformanceAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeRange]);
  
  // Chart data
  const responseTimeData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Response Time (ms)',
        data: generateTimeSeriesData(24, 50, 300),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  const errorRateData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Error Rate (%)',
        data: generateTimeSeriesData(24, 0, 5),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };
  
  const resourceUsageData = {
    labels: ['CPU', 'Memory', 'Disk', 'Network'],
    datasets: [
      {
        label: 'Usage %',
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 50,
          Math.random() * 30,
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(236, 72, 153)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Mock logs data
  const logs = [
    { id: 1, timestamp: '2025-07-24T12:30:45Z', level: 'INFO', message: 'Application started successfully', service: 'api-gateway' },
    { id: 2, timestamp: '2025-07-24T12:31:10Z', level: 'WARN', message: 'High memory usage detected', service: 'user-service' },
    { id: 3, timestamp: '2025-07-24T12:31:25Z', level: 'ERROR', message: 'Database connection failed', service: 'auth-service' },
    { id: 4, timestamp: '2025-07-24T12:32:05Z', level: 'INFO', message: 'Cache refreshed', service: 'cache-service' },
    { id: 5, timestamp: '2025-07-24T12:32:30Z', level: 'ERROR', message: 'Payment processing failed', service: 'payment-service' },
  ];
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-500';
      case 'WARN': return 'text-yellow-500';
      case 'INFO': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Performance Analytics
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1h">Last hour</option>
                <option value="6h">Last 6 hours</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            
            <button className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex space-x-1 mt-4 overflow-x-auto">
          {['overview', 'metrics', 'logs', 'alerts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tab
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard 
                    title="Response Time" 
                    value="142ms" 
                    change={-5.2} 
                    icon={<Clock className="w-5 h-5" />}
                    color="indigo"
                  />
                  <MetricCard 
                    title="Error Rate" 
                    value="0.8%" 
                    change={-1.4} 
                    icon={<AlertTriangle className="w-5 h-5" />}
                    color="red"
                  />
                  <MetricCard 
                    title="Requests" 
                    value="24.5K" 
                    change={12.3} 
                    icon={<Activity className="w-5 h-5" />}
                    color="green"
                  />
                  <MetricCard 
                    title="Uptime" 
                    value="99.98%" 
                    change={0.1} 
                    icon={<Server className="w-5 h-5" />}
                    color="emerald"
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium mb-4">Response Time (ms)</h3>
                    <div className="h-64">
                      <Line data={responseTimeData} options={chartOptions} />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium mb-4">Error Rate (%)</h3>
                    <div className="h-64">
                      <Line data={errorRateData} options={chartOptions} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-4">Resource Usage</h3>
                  <div className="h-64">
                    <Bar data={resourceUsageData} options={chartOptions} />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'logs' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Search logs..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800">
                      <option>All Services</option>
                      <option>api-gateway</option>
                      <option>user-service</option>
                      <option>auth-service</option>
                      <option>payment-service</option>
                    </select>
                    <button className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${getLevelColor(log.level)}`}>
                          {log.level === 'ERROR' ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : log.level === 'WARN' ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <Activity className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {log.message}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span className="truncate">{log.service}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ title, value, change, icon, color }: { title: string; value: string; change: number; icon: React.ReactNode; color: string }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        <span className={`ml-2 flex items-center text-sm font-medium ${
          change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {change >= 0 ? (
            <ArrowUp className="h-4 w-4 flex-shrink-0 self-center" />
          ) : (
            <ArrowDown className="h-4 w-4 flex-shrink-0 self-center" />
          )}
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
