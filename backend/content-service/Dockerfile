FROM node:20-alpine

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev deps for build)
RUN npm ci

# Copy application code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies for a smaller runtime image
RUN npm prune --omit=dev

# Expose port
EXPOSE 3002

# Start application
CMD ["npm", "run", "start"]
