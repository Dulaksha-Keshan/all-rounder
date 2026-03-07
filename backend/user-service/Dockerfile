FROM node:20-alpine

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# user-service: Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "run", "dev"]


