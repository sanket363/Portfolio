# Use the official Node.js 18 image as a base image
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
FROM base AS deps
RUN npm ci

# Copy the rest of the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./

# Install production dependencies only
RUN npm install next

# Expose the port the app runs on
EXPOSE 3000

# Set the environment to production
ENV NODE_ENV production

# Start the application
CMD ["npm", "start"]
