# Replit.md - Sanket Bhalke Portfolio

## Overview

This is a modern, animated personal portfolio website for Sanket Bhalke, a DevOps Engineer and Cloud Architect. The application is built as a full-stack web application with a React frontend and Express backend, showcasing professional experience, skills, projects, and contact information with advanced animations and smooth interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Animation Libraries**: Framer Motion for smooth animations and transitions
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: CSS-in-JS with Tailwind CSS custom properties for theming

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM (configured but minimal usage)
- **Session Management**: Basic in-memory storage with potential for database integration
- **API Design**: RESTful endpoints with JSON responses

### Build System
- **Development**: Vite dev server with HMR (Hot Module Replacement)
- **Production**: Vite build + esbuild for server bundling
- **Static Assets**: Served through Express in production

## Key Components

### Frontend Components
1. **Hero Section**: Animated landing area with typewriter effects and particle animations
2. **About Section**: Personal introduction with animated counters and statistics
3. **Skills Section**: Interactive skill grid with hover effects and animations
4. **Experience Section**: Timeline-based experience display with staggered animations
5. **Projects Section**: Portfolio showcase with gradient cards and interactive elements
6. **Contact Section**: Contact form with validation and toast notifications
7. **Navigation**: Smooth scrolling navigation with glassmorphism effects
8. **Theme Provider**: Dark/light theme switching with system preference detection

### Backend Components
1. **Contact API**: Endpoint for handling contact form submissions
2. **Static File Serving**: Express middleware for serving built frontend assets
3. **Error Handling**: Global error handling with structured responses
4. **Development Integration**: Vite development server integration

### Database Schema
- **Users Table**: Basic user structure with username and password (minimal implementation)
- **Drizzle Configuration**: PostgreSQL setup with migrations support
- **Current Usage**: Primarily for demonstration; main functionality doesn't require database

## Data Flow

1. **Client-Side Rendering**: React components render on the client with hydration
2. **API Communication**: Frontend makes HTTP requests to `/api/*` endpoints
3. **Form Handling**: Contact form submissions are processed server-side
4. **State Management**: React Query manages server state and caching
5. **Theme Persistence**: Theme preferences stored in localStorage
6. **Animation Triggers**: Intersection Observer API triggers animations on scroll

## External Dependencies

### Frontend Libraries
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Animation**: Framer Motion for complex animations and transitions
- **Icons**: Lucide React icons and React Icons (for brand icons)
- **Forms**: React Hook Form with Zod validation
- **Utilities**: clsx, tailwind-merge for className management

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL with Drizzle ORM
- **Session**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution, esbuild for bundling

### Build Tools
- **Vite**: Frontend build tool with React plugin
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Automatic refresh on file changes
- **Error Overlay**: Runtime error modal for debugging
- **Type Checking**: Continuous TypeScript compilation

### Production Deployment
- **Build Process**: 
  1. Vite builds frontend assets to `dist/public`
  2. esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend from `dist/public`
- **Environment Variables**: Database URL and other configs via environment
- **Process Management**: Single Node.js process serving both frontend and API

### Database Setup
- **Migration System**: Drizzle Kit for schema migrations
- **Connection**: Neon serverless PostgreSQL via connection string
- **Schema Evolution**: Version-controlled database schema changes

The application is designed to be a showcase portfolio with emphasis on visual appeal, smooth animations, and professional presentation of DevOps and cloud engineering skills.