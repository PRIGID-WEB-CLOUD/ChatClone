# Overview

This is a comprehensive Learning Management System (LMS) built as a full-stack web application. The platform enables instructors to create and manage courses with modules and lessons, while students can enroll in courses, track progress, and make payments. The system features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and Stripe for payment processing.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Comprehensive component library using Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Session-based authentication integrated with Replit Auth

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design with centralized route handling
- **Authentication**: Replit Auth with OpenID Connect, session management using connect-pg-simple
- **File Handling**: Multer for multipart file uploads with validation
- **Error Handling**: Centralized error middleware with structured error responses

## Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Design**: Relational schema with proper foreign key constraints
  - Users table with role-based access (student, instructor, admin)
  - Courses with hierarchical structure (Course → Module → Lesson)
  - Enrollment system with progress tracking
  - Session storage for authentication state

## Development Patterns
- **Monorepo Structure**: Client, server, and shared code organized in separate directories
- **Shared Types**: Common schemas and types shared between frontend and backend via shared directory
- **Path Aliases**: Configured TypeScript path mapping for clean imports
- **Code Organization**: Feature-based organization with reusable components and hooks

# External Dependencies

## Core Infrastructure
- **Hosting Platform**: Replit (with development tooling integration)
- **Database**: Neon PostgreSQL (serverless PostgreSQL service)
- **Authentication**: Replit Auth (OpenID Connect provider)

## Payment Processing
- **Stripe**: Complete payment infrastructure including customer management, subscriptions, and checkout flows
- **Integration**: Frontend Stripe.js with backend webhook handling for payment events

## Development Tools
- **Vite**: Frontend build tool with HMR and development server
- **ESBuild**: Backend bundling for production builds
- **TypeScript**: Full-stack type safety with strict configuration
- **Drizzle Kit**: Database migration and schema management

## UI and Styling
- **Radix UI**: Accessible component primitives for complex UI patterns
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide Icons**: Consistent icon library throughout the application

## File Storage
- **Local Storage**: File uploads handled via Multer with local filesystem storage (uploads directory)
- **File Validation**: Type and size validation for media files (images and videos)