# DevOps Portfolio Website

A modern, interactive portfolio showcasing DevOps expertise with real-time monitoring, CI/CD visualizations, and infrastructure as code examples. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

- 🚀 **Real-time Monitoring Dashboard** - Visualize system metrics and performance
- 🔄 **CI/CD Pipeline Visualization** - Interactive pipeline with build status
- 🏗️ **Infrastructure as Code** - Terraform and CloudFormation examples
- 🐳 **Container Orchestration** - Kubernetes cluster visualization
- 📊 **Performance Analytics** - Detailed metrics and logging
- 🌓 **Dark/Light Mode** - Built-in theme support
- 📱 **Responsive Design** - Works on all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git
- (Optional) Docker for containerized development

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/sanket363/Portfolio.git
   cd Portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   # Update the .env.local file with your configuration
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14+
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom theme
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [Recharts](https://recharts.org/)
- **State Management**: React Context API
- **Container Orchestration**: [Kubernetes](https://kubernetes.io/) (visualization only)
- **Infrastructure**: [Terraform](https://www.terraform.io/) & [AWS](https://aws.amazon.com/)

## 📂 Project Structure

```
src/
├── app/                    # App router pages and layouts
├── components/            # Reusable components
│   ├── devops/            # DevOps specific components
│   ├── ui/                # UI components
│   └── ...
├── lib/                   # Utility functions and configurations
├── styles/                # Global styles and Tailwind config
└── types/                 # TypeScript type definitions
```

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsanket363%2FPortfolio)

1. Push your code to a GitHub repository
2. Import the project on Vercel
3. Set up environment variables in Vercel's project settings
4. Deploy!

### Docker

1. Build the Docker image:

   ```bash
   docker build -t portfolio .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 portfolio
   ```

### Static Export

1. Build the static files:

   ```bash
   npm run build
   npm run export
   ```

2. Deploy the `out` directory to any static hosting service (Netlify, GitHub Pages, etc.)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Chart.js](https://www.chartjs.org/docs/)

## 📬 Contact

- GitHub: [@sanket363](https://github.com/sanket363)
- LinkedIn: [Sanket Bhalke](https://linkedin.com/in/sanketbhalke)
- Email: [your.email@example.com](mailto:your.email@example.com)
