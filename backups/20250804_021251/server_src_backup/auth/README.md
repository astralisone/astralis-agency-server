# Authentication System

This document provides an overview of the authentication system implemented for the Astralis Agency Server.

## Overview

The authentication system uses JSON Web Tokens (JWT) for secure user authentication. It includes:

- User model with role-based access control
- Authentication middleware for protecting routes
- Controllers for user registration, login, and profile management
- Protected routes for admin-only access

## Setup Instructions

### 1. Generate JWT Secret

First, generate a secure JWT secret by running:

```bash
# From the server directory
yarn generate:jwt
```

This will create or update the JWT_SECRET in your .env file.

### 2. Create Admin User

Create an initial admin user by running:

```bash
# From the server directory
yarn create:admin
```

This will create an admin user with the following credentials:
- Email: admin@astralis.com
- Password: 45tr4l15
- Role: ADMIN

**Important**: Change the admin password after the first login for security reasons.

## Authentication Flow

1. **Registration**: Users can register through the `/api/auth/register` endpoint
2. **Login**: Users can login through the `/api/auth/login` endpoint
3. **Authentication**: Protected routes require a valid JWT token in the Authorization header
4. **Authorization**: Admin-only routes check for the ADMIN role

## API Endpoints

### Public Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user profile (requires authentication)

### Protected Endpoints

All admin routes (`/api/admin/*`) are protected and require:
1. A valid JWT token
2. User with ADMIN role

## Client-Side Implementation

The client-side implementation includes:

- Authentication context provider for managing user state
- Login and registration forms
- Protected routes component for securing admin pages
- Navbar integration with login/logout functionality

## Security Considerations

- JWT tokens expire after 7 days (configurable in .env)
- Passwords are hashed before storage
- Role-based access control prevents unauthorized access
- HTTPS should be used in production 