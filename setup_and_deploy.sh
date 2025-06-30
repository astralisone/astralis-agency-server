\#!/bin/bash

# Astralis Agency Deployment Script
# This script automates the deployment of the Astralis Agency application
# Client runs on port 3000, Server runs on port 4000

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES FOR YOUR SERVER
REMOTE_USER="ftpuser"
REMOTE_HOST="your-server.com"
REMOTE_PATH="/home/ftpuser/ftp/files/astralis-agency-server"
LOCAL_PATH="."
CLIENT_PORT=3000
SERVER_PORT=4000
DOMAIN_PRIMARY="astralis.one"
DOMAIN_SECONDARY="astralisone.com"

# Database Configuration
DB_USER="astralis_user"
DB_NAME="astralis_production"
DB_HOST="localhost"
DB_PORT="5432"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check required commands
for cmd in node yarn rsync ssh; do
    if ! command_exists $cmd; then
        print_error "$cmd is not installed or not in PATH"
        exit 1
    fi
done

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_success "Pre-deployment checks passed"

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf client/dist server/dist build
mkdir -p build

# Install dependencies
print_status "Installing dependencies..."
yarn install

# Generate environment files
print_status "Generating environment configuration..."
if [ -f "scripts/generate-env.js" ]; then
    yarn generate:env
fi
if [ -f "scripts/generate-server-env.js" ]; then
    yarn generate:server-env
fi

# Build client (port 3000)
print_status "Building client application (will run on port $CLIENT_PORT)..."
cd client
yarn install
yarn build
cd ..

# Build server (port 4000)
print_status "Building server application (will run on port $SERVER_PORT)..."
cd server
yarn install
yarn build
cd ..

# Copy client build to main build directory
print_status "Preparing deployment package..."
cp -r client/dist/* build/

print_success "Build completed successfully"

# Deploy to server
print_status "Deploying to remote server..."

    cd server && yarn install --production --frozen-lockfile && cd ..

    # Generate Prisma client and run migrations
    echo "Setting up database..."
    npx prisma generate
    npx prisma migrate deploy
    
    # Create PM2 ecosystem file
    echo "Creating PM2 configuration..."
    cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [
    {
      name: 'astralis-server',
      script: 'server/dist/index.js',
      cwd: '$REMOTE_PATH',
      env: {
        NODE_ENV: 'production',
        PORT: $SERVER_PORT
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/server-error.log',
      out_file: './logs/server-out.log',
      log_file: './logs/server-combined.log',
      time: true,
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
EOL

    # Create logs directory
    mkdir -p logs uploads
    
    # Stop existing PM2 processes
    echo "Managing PM2 processes..."
    pm2 stop astralis-server || true
    pm2 delete astralis-server || true
    
    # Start new PM2 process
    pm2 start ecosystem.config.js
    pm2 save
    
    # Create/Update Caddyfile
    echo "Creating Caddy configuration..."
    cat > Caddyfile << 'EOL'
# Primary domain - astralis.one
$DOMAIN_PRIMARY {
    # Serve static files for assets
    handle_path /assets/* {
        root * $REMOTE_PATH/build
        file_server
    }
    
    # Serve favicon
    handle_path /favicon.ico {
        root * $REMOTE_PATH/build
        file_server
    }
    
    # Serve other static files (images, fonts, etc.)
    handle_path /static/* {
        root * $REMOTE_PATH/build
        file_server
    }
    
    # API routes to backend server (port $SERVER_PORT)
    handle /api/* {
        reverse_proxy localhost:$SERVER_PORT {
            header_up Host {host}
            header_up X-Real-IP {remote}
            header_up X-Forwarded-For {remote}
            header_up X-Forwarded-Proto {scheme}
        }
    }
    
    # All other routes serve the React app (SPA)
    handle {
        root * $REMOTE_PATH/build
        try_files {path} /index.html
        file_server
    }
    
    # Security headers
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
        Referrer-Policy strict-origin-when-cross-origin
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
    }
    
    # Enable compression
    encode gzip
    
    # Logging
    log {
        output file /var/log/caddy/astralis.log
        format json
    }
}

# Secondary domain - redirect to primary
$DOMAIN_SECONDARY {
    redir https://$DOMAIN_PRIMARY{uri} permanent
}
EOL

    # Reload Caddy configuration
    echo "Reloading Caddy..."
    sudo caddy reload --config Caddyfile || echo "Caddy reload failed - you may need to start it manually"
    
    echo ""
    echo "==================================="
    echo "Deployment completed successfully!"
    echo "==================================="
    echo ""
    echo "IMPORTANT: Update these values in .env:"
    echo "1. DATABASE_URL password: Change 'CHANGE_THIS_PASSWORD' to your actual database password"
    echo "2. JWT_SECRET: Generate a secure 32+ character secret"
    echo "3. SESSION_SECRET: Generate a secure 32+ character secret"
    echo "4. Configure SMTP settings for email functionality"
    echo ""
    echo "To generate secure secrets, run:"
    echo "openssl rand -base64 32"
    echo ""
    echo "Application URLs:"
    echo "Frontend: https://$DOMAIN_PRIMARY"
    echo "API: https://$DOMAIN_PRIMARY/api"
    echo "Secondary: https://$DOMAIN_SECONDARY (redirects to primary)"
    echo ""
    echo "PM2 Status:"
    pm2 status
    echo ""
    echo "Next steps:"
    echo "2. Restart the application: pm2 restart astralis-server"
    echo "3. Test the application endpoints"
EOF


print_success "Deployment script completed!"
print_status ""
print_status "==================================="
print_status "DEPLOYMENT SUMMARY"
print_status "==================================="
print_status ""
print_status "Architecture:"
print_status "  Frontend: React app on port $CLIENT_PORT (served by Caddy)"
print_status "  Backend: Node.js server on port $SERVER_PORT (managed by PM2)"
print_status "  Database: PostgreSQL with Prisma ORM"
print_status "  Reverse Proxy: Caddy"
print_status ""
print_status "Application URLs:"
print_status "  Primary: https://$DOMAIN_PRIMARY"
print_status "  Secondary: https://$DOMAIN_SECONDARY (redirects to primary)"
print_status "  API: https://$DOMAIN_PRIMARY/api"
print_status ""
print_warning "IMPORTANT: SSH into your server and update the .env file with:"
print_warning "1. Correct database password for $DB_USER"
print_warning "2. Secure JWT_SECRET (32+ characters)"
print_warning "3. Secure SESSION_SECRET (32+ characters)"
print_warning "4. SMTP configuration for email functionality"
print_warning ""
print_warning "Then restart: pm2 restart astralis-server"

# Optional: Run post-deployment tests
echo ""
read -p "Run post-deployment health checks? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Running health checks..."
    
    # Wait a moment for services to start
    sleep 5
    
    # Test API endpoint
    if curl -f -s "https://$DOMAIN_PRIMARY/api/health" > /dev/null; then
        print_success "API health check passed"
    else
        print_warning "API health check failed - check server logs with: ssh $REMOTE_USER@$REMOTE_HOST 'pm2 logs astralis-server'"
    fi
    
    # Test frontend
    if curl -f -s "https://$DOMAIN_PRIMARY" > /dev/null; then
        print_success "Frontend health check passed"
    else
        print_warning "Frontend health check failed - check Caddy configuration"
    fi
fi

print_success "Deployment automation completed!"
