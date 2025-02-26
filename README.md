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
The server is built with Express.js and uses TypeScript. The main entry point is `server.js` in the root directory, which imports the server from `server/dist/index.js`. The TypeScript source files are located in `server/src` and are compiled to JavaScript in `server/dist`.

The project uses ES modules throughout, with the `"type": "module"` setting in package.json.

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

## Testing
```
yarn test
``` 