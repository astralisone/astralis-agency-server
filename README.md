# Astralis Agency Server

## Overview
This is the server for the Astralis Agency application, providing API endpoints for the client application.

## Setup

### Prerequisites
- Node.js (v16+)
- Yarn
- PostgreSQL

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   yarn install
   ```

### Environment Variables
The application uses environment variables for configuration. These are managed through a root `.env` file and automatically generated for both client and server.

1. Create a `.env` file in the root directory using the following template:
   ```
   # Database credentials
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=astralis

   # Environment
   NODE_ENV=development

   # Database URLs
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/astralis?schema=public"
   TEST_DATABASE_URL="postgresql://postgres:your_password@localhost:5432/astralis_test?schema=public"

   # Email settings
   EMAIL_USER=your_email
   EMAIL_APP_PASSWORD=your_email_password
   CONTACT_EMAIL_RECIPIENT=your_email

   # Server settings
   PORT=4000
   CLIENT_URL=http://localhost:5173

   # JWT Authentication
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

2. Generate environment files for client and server:
   ```
   yarn generate:env
   yarn generate:server-env
   ```

These scripts will automatically create `.env` files in the client and server directories with the appropriate variables.

### Database Setup
1. Create the database:
   ```
   createdb astralis
   ```

2. Run migrations:
   ```
   npx prisma migrate dev
   ```

3. Seed the database:
   ```
   yarn seed
   ```

4. Create an admin user:
   ```
   yarn create:admin
   ```
   This will create an admin user with the following credentials:
   - Email: admin@astralis.one
   - Password: 45tr4l15
   
   **Important**: Change this password after first login for security reasons.

## Development

### Running the application
To run both client and server in development mode:
```
yarn dev:all
```

To run only the server:
```
yarn server:dev
```

To run only the client:
```
yarn client:dev
```

### Building for production
```
yarn build
```

## Project Structure

### Server Architecture
The server is built with Express.js and uses TypeScript with Prisma ORM for database operations. The main entry point is `server.js` in the root directory, which imports the server from `server/dist/index.js`. The TypeScript source files are located in `server/src` and are compiled to JavaScript in `server/dist`.

The project uses ES modules throughout, with the `"type": "module"` setting in package.json.

### Directory Structure
```
/
├── build/                     # Frontend production build files
├── client/                    # React/Vite frontend application
│   ├── src/
│   │   ├── components/        # React components (UI, sections, providers)
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── blog/          # Blog-related components
│   │   │   ├── cart/          # Shopping cart components
│   │   │   ├── checkout/      # Payment and checkout components
│   │   │   ├── contact/       # Contact form components
│   │   │   ├── marketplace/   # Marketplace components
│   │   │   ├── providers/     # Context providers (auth, theme, payment)
│   │   │   ├── sections/      # Homepage sections (hero, services, testimonials)
│   │   │   └── ui/            # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions and configurations
│   │   ├── pages/             # Page components and routing
│   │   └── types/             # TypeScript type definitions
│   └── dist/                  # Client build output
├── server/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Database and application configuration
│   │   ├── controllers/       # Route controllers and business logic
│   │   ├── lib/               # Shared libraries (Prisma client)
│   │   ├── middleware/        # Express middleware (auth, validation)
│   │   ├── models/            # Database models (legacy, migrated to Prisma)
│   │   ├── routes/            # API route definitions
│   │   ├── scripts/           # Database and setup scripts
│   │   ├── services/          # External services (email)
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   └── dist/                  # Compiled JavaScript output
├── prisma/                    # Prisma ORM schema and migrations
└── logs/                      # Application log files
```

## Authentication System

### Overview
The authentication system uses JSON Web Tokens (JWT) for secure user authentication. It includes:

- User model with role-based access control (USER and ADMIN roles)
- Authentication middleware for protecting routes
- Controllers for user registration, login, and profile management
- Protected routes for admin-only access

### Authentication Flow
1. User logs in or registers through the client application
2. Server validates credentials and returns a JWT token
3. Client stores the token in localStorage
4. Client includes the token in the Authorization header for subsequent requests
5. Server validates the token and grants access to protected resources

### Client-Side Authentication
The client uses an authentication provider (`AuthProvider`) to manage the authentication state. This provider:
- Stores the JWT token and user data in localStorage
- Provides login, logout, and register functions
- Exposes authentication state (isAuthenticated, isAdmin, etc.)
- Handles redirection based on user role

Protected routes are implemented using the `ProtectedRoute` component, which:
- Checks if the user is authenticated
- Redirects to the login page if not authenticated
- Checks if the user has the required role (e.g., ADMIN)
- Shows a loading spinner while checking authentication

### Recent Updates
- Fixed authentication flow to use the auth provider consistently
- Updated login and register pages to use the auth provider hooks
- Ensured proper redirection after login based on user role
- Verified authentication endpoints functionality

## API Endpoints
- `/api/auth` - Authentication endpoints
  - `POST /api/auth/login` - Login with email and password
  - `POST /api/auth/register` - Register a new user
  - `GET /api/auth/me` - Get current user (requires authentication)
  - `POST /api/auth/create-admin` - Create an admin user (for development)
- `/api/products` - Product endpoints
- `/api/contact` - Contact form endpoints
- `/api/health` - Health check endpoint

## Production Deployment

### Server Configuration
The production server is deployed using:
- **Web Server**: Caddy v2 with automatic HTTPS
- **Process Manager**: Backend runs directly via yarn/tsx
- **Database**: PostgreSQL with production schema
- **Domains**: astralisone.com and astralis.one

### Caddy Configuration
The Caddyfile is configured at `/etc/caddy/Caddyfile` with:
- SSL certificates for both domains
- API proxy: `/api/*` → `localhost:4000`
- Static file serving from `/home/ftpuser/ftp/files/astralis-agency-server/build`
- Security headers and gzip compression
- Access logging to `/var/log/caddy/astralis.log`

### Build Process for Production
1. **Environment Setup**: Generate production environment variables
   ```bash
   yarn generate:env
   yarn generate:server-env
   ```

2. **Frontend Build**: Build client with relative API URLs
   ```bash
   yarn build:client
   ```

3. **Copy Build Files**: Deploy to serving directory
   ```bash
   yarn postbuild
   ```

4. **Database Setup**: Apply migrations and seed data
   ```bash
   yarn prisma migrate deploy
   yarn run tsx prisma/seed.ts
   yarn run tsx prisma/seed-testimonials.ts
   ```

5. **Start Services**:
   ```bash
   yarn start  # Backend on port 4000
   sudo systemctl reload caddy  # Reload web server
   ```

### Key Configuration Changes Made
- **API URLs**: Updated to use relative URLs instead of localhost:4000
- **Environment Variables**: VITE_API_URL set to empty string for relative URLs
- **Caddy Proxy**: Fixed handle_path to handle for proper API routing
- **File Permissions**: Added caddy user to ftpuser group for file access
- **Database**: Full migration reset and seeding with sample data

### Environment Files
- **Root `.env`**: Contains all configuration variables
- **Client `.env`**: Auto-generated with VITE_API_URL=(empty for relative URLs)
- **Server `.env`**: Auto-generated with database and server settings

### Sample Data Seeded
- 1 admin user (admin@astralis.one / password from seed script)
- 14 categories (Web Dev, Mobile Dev, UI/UX, etc.)
- 35+ tags (React, Node.js, TypeScript, etc.)
- 3 sample blog posts
- 4 sample marketplace items
- 5 customer testimonials

## Testing
```
yarn test
```

## Recent Updates (2025-06-30)

### Infrastructure & Deployment
- ✅ **Domain Setup**: Configured astralisone.com and astralis.one with Caddy
- ✅ **SSL/HTTPS**: Automatic SSL certificates via Caddy
- ✅ **API Proxy**: Fixed Caddy configuration to properly route /api/* to backend
- ✅ **File Permissions**: Resolved 403 errors by adding caddy to ftpuser group
- ✅ **Static Serving**: Frontend builds served from /build directory

### Frontend & API Integration
- ✅ **Relative URLs**: Updated API calls to use relative URLs instead of localhost:4000
- ✅ **Environment Configuration**: Modified scripts to generate empty VITE_API_URL
- ✅ **Build Process**: Clean rebuild with new API configuration
- ✅ **Asset Updates**: New build files with proper relative API calls

### Database & Content
- ✅ **Migration Reset**: Complete database migration reset and reapplication
- ✅ **Schema Verification**: All 12 tables properly created with relationships
- ✅ **Data Seeding**: Successfully seeded with comprehensive sample data
- ✅ **Production Ready**: Database fully populated and API endpoints functional

### System Integration
- ✅ **Backend Service**: Server running on port 4000 with all API endpoints
- ✅ **Process Management**: Backend service properly started and accessible
- ✅ **End-to-End Testing**: Full system tested and verified working
- ✅ **Documentation**: Updated README with current deployment configuration 