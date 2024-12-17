# Use the official Node.js image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Set entrypoint to npm (optional for convenience)
ENTRYPOINT ["npm"]

