# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Main Project (Root)
- `yarn dev:all` - Run both client and server in development mode
- `yarn build` - Build both client and server for production
- `yarn test` - Run tests using Jest
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage report
- `yarn start` - Start production server (uses tsx server.ts)
- `yarn seed` - Seed database with sample data
- `yarn create:admin` - Create admin user (email: admin@astralis.one, password: 45tr4l15)

### Client Development
- `cd client && yarn dev` - Start Vite dev server (port 5173)
- `cd client && yarn build` - Build client with TypeScript compilation
- `cd client && yarn lint` - Run ESLint with TypeScript support
- `cd client && yarn storybook` - Run Storybook on port 6006

### Server Development
- `yarn server:dev` - Start server in development mode (port 4000)
- `cd server && yarn build` - Build server using tsup
- `cd server && yarn test` - Run server tests
- `cd server && yarn test:watch` - Run server tests in watch mode

### Database Operations
- `npx prisma migrate dev` - Apply migrations in development
- `npx prisma migrate deploy` - Apply migrations in production
- `npx prisma studio` - Open Prisma Studio database browser
- `npx prisma generate` - Generate Prisma client

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Radix UI
- **Backend**: Node.js + Express + TypeScript (ES modules)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT with role-based access (USER/ADMIN)
- **Payment**: PayPal integration
- **UI**: shadcn/ui components + Storybook
- **State Management**: Zustand for cart, React Context for auth

### Project Structure
This is a yarn workspace monorepo with two main packages:
- `client/` - React frontend application
- `server/` - Express backend API

The main server entry point is `server.ts` in the root, which imports routes from `server/src/`. Both client and server use ES modules (`"type": "module"`).

### Key Architectural Patterns

#### Authentication Flow
- JWT tokens stored in localStorage
- `AuthProvider` context manages auth state
- `ProtectedRoute` component handles route protection
- Middleware validates tokens on protected endpoints
- Role-based access control (USER/ADMIN roles)

#### API Design
- RESTful API with `/api/` prefix
- Routes organized by feature: auth, blog, marketplace, contact, admin
- Zod schemas for request validation
- Consistent error handling with proper HTTP status codes

#### Frontend Architecture
- Component-based with shadcn/ui design system
- Feature-based organization (auth, blog, cart, checkout, etc.)
- Custom hooks for API integration (`useApi.ts`)
- Provider pattern for global state (auth, theme, payment)

#### Database Schema
- User-centric design with role-based permissions
- Blog system with posts, categories, tags, comments, likes
- Marketplace with products, categories, wishlists
- Contact forms and testimonials
- All models use UUID primary keys

### Environment Configuration
The project uses a root `.env` file with automated generation scripts:
- `yarn generate:env` - Creates client `.env` with VITE_ variables
- `yarn generate:server-env` - Creates server `.env` with backend config

In production, API calls use relative URLs (empty VITE_API_URL) and are proxied through Caddy.

### Testing Strategy
- Jest for both client and server testing
- Supertest for API endpoint testing
- React Testing Library for component tests
- Storybook for component development, documentation and visual testing

### Development Workflow
1. Start with `yarn dev:all` for full-stack development
2. Use `yarn test:watch` for TDD workflow
3. Do not Run `yarn lint` (client) before commits
4. Database changes require Prisma migrations
5. Always test authentication flows when modifying auth code

### Production Deployment
- Caddy web server with automatic HTTPS
- Backend runs via `yarn start` on port 4000
- Frontend served as static files from `/build`
- Database migrations applied with `npx prisma migrate deploy`
- Environment variables generated before build

### Common Gotchas
- Server uses ES modules - import statements and file extensions matter
- Prisma client must be regenerated after schema changes
- JWT secret must be set in production environment
- PayPal requires both client and server-side configuration
- Relative API URLs in production vs localhost in development