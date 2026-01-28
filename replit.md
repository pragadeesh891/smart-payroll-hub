# SIMATS Payroll AI

## Overview
Enterprise payroll system dashboard application built with React, TypeScript, and Vite.

## Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
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
├── components/     # UI components
├── data/          # Mock data
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── test/          # Test setup and files
├── types/         # TypeScript type definitions
├── App.tsx        # Main application component
├── App.css        # Application styles
├── index.css      # Global styles and design system
└── main.tsx       # Application entry point
```

## Development
- Run `npm run dev` to start the development server on port 5000
- Run `npm run build` to build for production
- Run `npm test` to run tests

## Deployment
Configured for static deployment with the `dist` directory as the public folder.

## Recent Changes
- 2026-01-28: Initial Replit setup - configured Vite for port 5000, enabled all hosts for proxy compatibility, fixed CSS import order
