FROM node:18-alpine

WORKDIR /app/server

# Copy package files
COPY server/package.json server/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY server/src ./src
COPY server/tsconfig.json ./

# Build
RUN yarn build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Start the server
CMD ["yarn", "start:prod"] 