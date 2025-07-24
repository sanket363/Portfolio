import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Cpu, Database, Network, RefreshCw } from 'lucide-react';
import ReactJson from 'react-json-view';

const INFRA_ITEMS = [
  {
    id: 'vpc',
    name: 'VPC',
    icon: <Network className="w-5 h-5" />,
    type: 'aws_vpc',
    config: { cidr_block: '10.0.0.0/16', enable_dns: true }
  },
  {
    id: 'ecs',
    name: 'ECS Cluster',
    icon: <Cpu className="w-5 h-5" />,
    type: 'aws_ecs_cluster',
    config: { name: 'production', container_insights: true }
  },
  {
    id: 'rds',
    name: 'RDS',
    icon: <Database className="w-5 h-5" />,
    type: 'aws_db_instance',
    config: { engine: 'postgres', instance_class: 'db.t3.micro' }
  }
];

const InfrastructureAsCode: React.FC = () => {
  const [selected, setSelected] = useState(INFRA_ITEMS[0].id);
  const [isDeploying, setIsDeploying] = useState(false);
  const selectedItem = INFRA_ITEMS.find(item => item.id === selected);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 2000);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          Infrastructure as Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[500px]">
          <div className="space-y-2 overflow-y-auto">
            {INFRA_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelected(item.id)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selected === item.id
                    ? 'bg-indigo-100 dark:bg-indigo-900 border-l-4 border-indigo-500'
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{selectedItem?.name}</h3>
              <motion.button
                onClick={handleDeploy}
                disabled={isDeploying}
                whileHover={{ scale: 1.03 }}
                className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2"
              >
                {isDeploying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Deploying...
                  </>
                ) : 'Deploy'}
              </motion.button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 h-[400px] overflow-auto">
              <pre className="text-green-400 text-sm">
                {JSON.stringify(selectedItem?.config, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfrastructureAsCode;
