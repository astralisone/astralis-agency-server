# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY server/package.json server/

# Install ALL dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile

# Copy server source code
COPY server/ server/

# Build the server
RUN cd server && yarn build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY server/package.json server/

# Install dependencies (including dev dependencies for now)
RUN yarn install --frozen-lockfile

# Copy built files from builder stage
COPY --from=builder /app/server/dist server/dist
COPY server/src server/src

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose the port
EXPOSE 3001

# Start the server
CMD ["yarn", "workspace", "server", "start:prod"] 