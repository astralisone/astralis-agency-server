# Astralis Agency - Production Deployment Guide

## Overview
This document outlines the production deployment configuration for the Astralis Agency application running on astralisone.com and astralis.one.

## System Architecture

### Components
- **Frontend**: React/Vite application served as static files
- **Backend**: Node.js/Express API server on port 4000
- **Database**: PostgreSQL with Prisma ORM
- **Web Server**: Caddy v2 with automatic HTTPS
- **Domains**: astralisone.com and astralis.one (both serve same content)

### File Structure
```
/home/ftpuser/ftp/files/astralis-agency-server/
├── build/                 # Frontend build files (served by Caddy)
├── client/               # Frontend source code
├── server/               # Backend source code
├── prisma/               # Database schema and migrations
├── migrations/           # Prisma migration files
└── .env                  # Environment configuration
```

## Caddy Configuration

### Location
- **Config File**: `/etc/caddy/Caddyfile`
- **Logs**: `/var/log/caddy/astralis.log`

### Key Configuration
```caddyfile
# Redirect www subdomains to root domain
www.astralis.one, www.astralisone.com {
    redir https://{labels.1}.{labels.0}{uri} permanent
}

# Main domain config
astralis.one, astralisone.com {
    encode gzip
    
    # Security headers
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
        Referrer-Policy strict-origin-when-cross-origin
    }
    
    # API routes to backend on port 4000
    handle /api/* {
        reverse_proxy localhost:4000
    }
    
    # Static file serving from build directory
    handle {
        root * /home/ftpuser/ftp/files/astralis-agency-server/build
        try_files {path} /index.html
        file_server
    }
}
```

## Environment Configuration

### Root .env File
Contains all configuration variables that are used to generate client and server specific environment files.

Key variables:
- `NODE_ENV=production`
- `DATABASE_URL=postgresql://astralis_user:password@localhost:5432/astralis_production`
- `PORT=4000`
- `VITE_API_URL=` (empty for relative URLs)

### API URL Configuration
The frontend is configured to use **relative URLs** for API calls:
- Client environment: `VITE_API_URL=` (empty)
- Frontend makes calls to `/api/*` (relative to current domain)
- Caddy proxies `/api/*` requests to `localhost:4000`

## Database Configuration

### Database Details
- **Database**: `astralis_production`
- **User**: `astralis_user`
- **Host**: `localhost:5432`

### Schema
- 12 tables including users, posts, marketplace_items, testimonials, etc.
- 2 migrations applied: init + testimonials
- Foreign key relationships and indexes properly configured

### Sample Data
- 1 admin user
- 14 categories
- 35+ tags
- 3 blog posts
- 4 marketplace items
- 5 testimonials

## Deployment Process

### 1. Environment Setup
```bash
cd /home/ftpuser/ftp/files/astralis-agency-server
yarn generate:env  # Creates client/.env with relative API URLs
```

### 2. Frontend Build
```bash
yarn build:client  # Builds client with production settings
yarn postbuild     # Copies dist files to build directory
```

### 3. Database Setup
```bash
yarn prisma migrate deploy              # Apply migrations
yarn run tsx prisma/seed.ts            # Seed main data
yarn run tsx prisma/seed-testimonials.ts  # Seed testimonials
```

### 4. Backend Service
```bash
yarn start  # Starts backend on port 4000
```

### 5. Web Server
```bash
sudo systemctl reload caddy  # Reload Caddy configuration
```

## File Permissions

### Issue Resolution
- **Problem**: Caddy couldn't access files owned by root:root
- **Solution**: Added caddy user to ftpuser group
- **Commands**:
  ```bash
  sudo usermod -a -G ftpuser caddy
  sudo chgrp -R ftpuser /home/ftpuser/ftp/files
  sudo chmod -R g+r /home/ftpuser/ftp/files
  sudo chmod g+x /home/ftpuser/ftp/files /home/ftpuser/ftp/files/astralis-agency-server
  ```

## Troubleshooting

### Common Issues

1. **403 Forbidden Errors**
   - Check file permissions
   - Verify caddy user has access to files
   - Ensure directories have execute permissions

2. **API Connection Refused**
   - Verify backend service is running on port 4000
   - Check Caddy proxy configuration
   - Ensure `/api/*` routing is correct

3. **Frontend Shows Localhost URLs**
   - Rebuild frontend with clean environment
   - Verify VITE_API_URL is empty
   - Clear browser cache

### Service Status Commands
```bash
# Check Caddy status
sudo systemctl status caddy

# Check PostgreSQL
sudo systemctl status postgresql

# Check backend process
ps aux | grep node

# Check port 4000
ss -tlnp | grep :4000

# Test API endpoints
curl https://astralisone.com/api/health
```

## Security Considerations

### Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### SSL/TLS
- Automatic HTTPS via Caddy with Let's Encrypt
- HTTP redirects to HTTPS
- Modern TLS configuration

### Database
- Dedicated database user with limited privileges
- Password-protected connections
- Production database separation

## Monitoring

### Logs
- **Caddy Access Logs**: `/var/log/caddy/astralis.log` (JSON format)
- **Backend Logs**: Console output from yarn start
- **System Logs**: `journalctl -u caddy` for Caddy service logs

### Health Checks
- **API Health**: `GET /api/health`
- **Database Connection**: Verified through API endpoints
- **SSL Certificate**: Automatic renewal via Caddy

## Backup Considerations

### Database Backup
```bash
pg_dump -h localhost -U astralis_user astralis_production > backup.sql
```

### File Backup
- Source code is in Git repository
- Build files can be regenerated
- Environment files should be backed up securely

## Performance Optimization

### Frontend
- Gzip compression enabled via Caddy
- Static file serving with proper caching headers
- Minified and optimized build files

### Backend
- Express.js with efficient routing
- Database connections via Prisma connection pooling
- API response optimization

### Infrastructure
- Caddy reverse proxy for efficient request handling
- HTTP/2 support enabled
- Optimized static file serving