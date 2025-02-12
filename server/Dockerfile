FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files for both server and client
COPY package*.json ./
COPY ../client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .
COPY ../client ./client

# Build both server and client
RUN npm run build

# Expose port
EXPOSE 3001

# Start the server
CMD ["npm", "start"] 