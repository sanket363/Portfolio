'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Server, 
  Database, 
  Shield, 
  Network,
  Container,
  Settings,
  Code,
  Play,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface IaCTemplate {
  id: string;
  name: string;
  description: string;
  technology: string;
  icon: React.ReactNode;
  code: string;
  language: string;
  resources: string[];
}

const InfrastructureAsCode: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<string>('terraform-aws');
  const [copiedCode, setCopiedCode] = useState<string>('');

  const iacTemplates: IaCTemplate[] = [
    {
      id: 'terraform-aws',
      name: 'AWS Infrastructure',
      description: 'Complete AWS infrastructure with VPC, ECS, RDS, and Load Balancer',
      technology: 'Terraform',
      icon: <Cloud className="w-5 h-5" />,
      language: 'hcl',
      resources: ['VPC', 'ECS Cluster', 'RDS Database', 'Application Load Balancer', 'Auto Scaling Group'],
      code: `# AWS Infrastructure with Terraform
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "devops-portfolio-vpc"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "devops-portfolio-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-\${count.index + 1}"
    Type = "Public"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "private-subnet-\${count.index + 1}"
    Type = "Private"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "devops-portfolio-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = var.environment
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "devops-portfolio-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false

  tags = {
    Environment = var.environment
  }
}

# RDS Database
resource "aws_db_instance" "main" {
  identifier     = "devops-portfolio-db"
  engine         = "postgres"
  engine_version = "14.9"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true

  db_name  = "portfolio"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = true

  tags = {
    Environment = var.environment
  }
}`
    },
    {
      id: 'kubernetes-deployment',
      name: 'Kubernetes Deployment',
      description: 'Kubernetes deployment with services, ingress, and monitoring',
      technology: 'Kubernetes',
      icon: <Container className="w-5 h-5" />,
      language: 'yaml',
      resources: ['Deployment', 'Service', 'Ingress', 'ConfigMap', 'Secret'],
      code: `# Kubernetes Deployment Configuration
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devops-portfolio
  namespace: production
  labels:
    app: devops-portfolio
    version: v1.0.0
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: devops-portfolio
  template:
    metadata:
      labels:
        app: devops-portfolio
        version: v1.0.0
    spec:
      containers:
      - name: portfolio
        image: sanket363/devops-portfolio:latest
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: devops-portfolio-service
  namespace: production
spec:
  selector:
    app: devops-portfolio
  ports:
  - name: http
    port: 80
    targetPort: 3000
    protocol: TCP
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: devops-portfolio-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - portfolio.sanketbhalke.dev
    secretName: portfolio-tls
  rules:
  - host: portfolio.sanketbhalke.dev
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: devops-portfolio-service
            port:
              number: 80`
    },
    {
      id: 'docker-compose',
      name: 'Docker Compose',
      description: 'Multi-container application with database, cache, and monitoring',
      technology: 'Docker',
      icon: <Container className="w-5 h-5" />,
      language: 'yaml',
      resources: ['Web App', 'PostgreSQL', 'Redis', 'Nginx', 'Prometheus'],
      code: `# Docker Compose Configuration
version: '3.8'

services:
  # Web Application
  web:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: devops-portfolio-web
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/portfolio
      - REDIS_URL=redis://redis:6379
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
    networks:
      - app-network
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL Database
  db:
    image: postgres:14-alpine
    container_name: devops-portfolio-db
    restart: unless-stopped
    environment:
      - POSTGRES_DB=portfolio
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: devops-portfolio-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: devops-portfolio-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
    networks:
      - app-network

  # Prometheus Monitoring
  prometheus:
    image: prom/prometheus:latest
    container_name: devops-portfolio-prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - app-network
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  # Grafana Dashboard
  grafana:
    image: grafana/grafana:latest
    container_name: devops-portfolio-grafana
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:

networks:
  app-network:
    driver: bridge`
    },
    {
      id: 'ansible-playbook',
      name: 'Ansible Playbook',
      description: 'Server configuration and application deployment automation',
      technology: 'Ansible',
      icon: <Settings className="w-5 h-5" />,
      language: 'yaml',
      resources: ['Server Setup', 'Docker Installation', 'App Deployment', 'SSL Configuration'],
      code: `# Ansible Playbook for DevOps Portfolio Deployment
---
- name: Deploy DevOps Portfolio Application
  hosts: webservers
  become: yes
  vars:
    app_name: devops-portfolio
    app_user: portfolio
    app_dir: /opt/{{ app_name }}
    docker_compose_version: "2.21.0"
    
  tasks:
    # System Updates and Dependencies
    - name: Update system packages
      apt:
        update_cache: yes
        upgrade: dist
        cache_valid_time: 3600

    - name: Install required packages
      apt:
        name:
          - curl
          - wget
          - git
          - unzip
          - software-properties-common
          - apt-transport-https
          - ca-certificates
          - gnupg
          - lsb-release
        state: present

    # Docker Installation
    - name: Add Docker GPG key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present

    - name: Add Docker repository
      apt_repository:
        repo: "deb [arch=amd64] https://download.docker.com/linux/ubuntu {{ ansible_distribution_release }} stable"
        state: present

    - name: Install Docker
      apt:
        name:
          - docker-ce
          - docker-ce-cli
          - containerd.io
        state: present

    - name: Start and enable Docker service
      systemd:
        name: docker
        state: started
        enabled: yes

    # Docker Compose Installation
    - name: Install Docker Compose
      get_url:
        url: "https://github.com/docker/compose/releases/download/v{{ docker_compose_version }}/docker-compose-Linux-x86_64"
        dest: /usr/local/bin/docker-compose
        mode: '0755'

    # Application User Setup
    - name: Create application user
      user:
        name: "{{ app_user }}"
        system: yes
        shell: /bin/bash
        home: "{{ app_dir }}"
        create_home: yes

    - name: Add user to docker group
      user:
        name: "{{ app_user }}"
        groups: docker
        append: yes

    # Application Deployment
    - name: Create application directory
      file:
        path: "{{ app_dir }}"
        state: directory
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
        mode: '0755'

    - name: Clone application repository
      git:
        repo: https://github.com/sanket363/devops-portfolio.git
        dest: "{{ app_dir }}/src"
        version: main
        force: yes
      become_user: "{{ app_user }}"

    - name: Copy environment file
      template:
        src: .env.j2
        dest: "{{ app_dir }}/src/.env"
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
        mode: '0600'

    - name: Build and start application
      docker_compose:
        project_src: "{{ app_dir }}/src"
        state: present
        build: yes
      become_user: "{{ app_user }}"

    # SSL Certificate Setup
    - name: Install Certbot
      apt:
        name: certbot
        state: present

    - name: Generate SSL certificate
      command: >
        certbot certonly --standalone
        --email admin@sanketbhalke.dev
        --agree-tos
        --non-interactive
        -d portfolio.sanketbhalke.dev
      args:
        creates: /etc/letsencrypt/live/portfolio.sanketbhalke.dev/fullchain.pem

    # Firewall Configuration
    - name: Configure UFW firewall
      ufw:
        rule: allow
        port: "{{ item }}"
        proto: tcp
      loop:
        - '22'
        - '80'
        - '443'

    - name: Enable UFW
      ufw:
        state: enabled

    # Monitoring Setup
    - name: Create monitoring directory
      file:
        path: "{{ app_dir }}/monitoring"
        state: directory
        owner: "{{ app_user }}"
        group: "{{ app_user }}"

    - name: Copy monitoring configuration
      template:
        src: "{{ item }}.j2"
        dest: "{{ app_dir }}/monitoring/{{ item }}"
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
      loop:
        - prometheus.yml
        - grafana-dashboard.json

  handlers:
    - name: restart docker
      systemd:
        name: docker
        state: restarted

    - name: restart application
      docker_compose:
        project_src: "{{ app_dir }}/src"
        restarted: yes
      become_user: "{{ app_user }}"`
    }
  ];

  const activeTemplateData = iacTemplates.find(t => t.id === activeTemplate);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(activeTemplate);
    setTimeout(() => setCopiedCode(''), 2000);
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
            <span className="text-purple-400">$</span> Infrastructure as Code
          </h2>
          <p className="text-gray-400 text-lg">Automated infrastructure provisioning and configuration management</p>
        </motion.div>

        {/* Template Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {iacTemplates.map((template) => (
              <motion.button
                key={template.id}
                onClick={() => setActiveTemplate(template.id)}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  activeTemplate === template.id 
                    ? 'border-purple-400 bg-purple-400/10 text-purple-400' 
                    : 'border-gray-600 hover:border-gray-400 hover:bg-gray-800/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  {template.icon}
                  <span className="font-semibold">{template.technology}</span>
                </div>
                <h3 className="font-bold text-left">{template.name}</h3>
                <p className="text-sm text-gray-400 text-left mt-1">{template.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active Template Display */}
        {activeTemplateData && (
          <motion.div
            key={activeTemplate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black border border-gray-700 rounded-lg overflow-hidden"
          >
            {/* Template Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-purple-400">{activeTemplateData.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-400">{activeTemplateData.name}</h3>
                    <p className="text-gray-400">{activeTemplateData.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(activeTemplateData.code)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copiedCode === activeTemplate ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {copiedCode === activeTemplate ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Resources */}
              <div className="flex flex-wrap gap-2">
                {activeTemplateData.resources.map((resource, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-400/10 text-purple-400 rounded-full text-sm border border-purple-400/20"
                  >
                    {resource}
                  </span>
                ))}
              </div>
            </div>

            {/* Code Display */}
            <div className="relative">
              <SyntaxHighlighter
                language={activeTemplateData.language}
                style={atomDark}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  background: 'transparent',
                  fontSize: '0.875rem'
                }}
                showLineNumbers
                wrapLines
              >
                {activeTemplateData.code}
              </SyntaxHighlighter>
            </div>
          </motion.div>
        )}

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Code className="w-6 h-6" />,
              title: 'Version Controlled',
              description: 'Infrastructure changes tracked in Git with full audit trail'
            },
            {
              icon: <Play className="w-6 h-6" />,
              title: 'Automated Deployment',
              description: 'Consistent, repeatable infrastructure provisioning'
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Security Compliant',
              description: 'Built-in security best practices and compliance checks'
            }
          ].map((benefit, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center"
            >
              <div className="text-purple-400 flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-400 text-sm">{benefit.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InfrastructureAsCode;
