# SIMATS Payroll AI

## Overview
Enterprise payroll system dashboard application built with React, TypeScript, and Vite, with a full Express.js backend connected to PostgreSQL database.

## Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Backend**: Express.js with PostgreSQL (pg)
- **Database**: PostgreSQL (Replit Neon-backed)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: TanStack React Query
- **Routing**: React Router DOM v6
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion

## Project Structure
```
src/
├── components/     # UI components (dashboard, modules, ui)
├── data/          # Type definitions for data
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and API client
├── types/         # TypeScript type definitions
├── App.tsx        # Main application component with routing
├── index.css      # Global styles and design system
└── main.tsx       # Application entry point

server/
└── index.js       # Express.js backend API server
```

## Database Schema
- **employees**: Employee records with personal and salary info
- **payroll_records**: Monthly payroll processing records
- **payroll_rules**: Automation rules for payroll processing
- **audit_logs**: System activity and change tracking
- **alerts**: System notifications and alerts
- **departments**: Department definitions

## Development
- Run `npm run dev` to start both backend (port 3001) and frontend (port 5000)
- Backend API proxied through Vite at `/api/*`
- Frontend auto-refreshes with HMR

## API Endpoints
- GET /api/health - Health check
- GET/POST /api/employees - Employee CRUD
- GET/POST /api/payroll - Payroll records
- POST /api/payroll/process - Process new payroll
- GET/POST/PUT/DELETE /api/rules - Automation rules
- GET /api/audit-logs - Audit log history
- GET /api/stats - Dashboard statistics
- GET /api/departments - Department list

## Deployment
Configured for autoscale deployment with Express.js serving the built frontend.

## Recent Changes
- 2026-01-28: Full-stack implementation complete
  - PostgreSQL database with seed data (6 employees, payroll records, automation rules)
  - Express.js backend API with all CRUD endpoints
  - Frontend connected to real database via React Query
  - Real-time data updates with automatic cache invalidation
  - Enhanced animations with Framer Motion throughout
  - Modal forms for adding employees and processing payroll
  - Interactive dashboard with live statistics
