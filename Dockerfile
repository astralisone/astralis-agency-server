# Use an official Node.js runtime as a base image
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock to leverage caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the TypeScript project
RUN yarn build

# Expose the application's port (adjust if necessary)
EXPOSE 3000

# Set environment variables (if needed)
ENV NODE_ENV=production

# Command to start the application
CMD ["yarn", "start:prod"]
