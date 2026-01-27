# Project Structure

This document outlines the organized structure of the Privacy-Focused Web Analytics Dashboard project.

## Directory Layout

```
project-root/
├── config/                          # Build configuration (Vite)
│   ├── vite.config.ts               # Vite client build configuration
│   └── vite.config.server.ts        # Vite server build configuration
│
├── docs/                            # Documentation
│   ├── FUSION_STARTER.md            # Fusion Starter template documentation
│   └── PROJECT_STRUCTURE.md         # This file
│
├── client/                          # React SPA Frontend
│   ├── pages/                       # Route components
│   │   ├── Index.tsx               # Landing page
│   │   ├── Dashboard.tsx           # Analytics dashboard
│   │   └── NotFound.tsx            # 404 page
│   ├── components/
│   │   ├── ui/                     # Pre-built UI components (Radix UI + Tailwind)
│   │   └── dashboard/              # Dashboard-specific components
│   │       ├── MetricCard.tsx
│   │       ├── PageViewsChart.tsx
│   │       ├── TopPagesChart.tsx
│   │       ├── DeviceDistributionChart.tsx
│   │       └── ReferrerChart.tsx
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useTheme.ts
│   ├── lib/                        # Utility functions
│   │   └── utils.ts
│   ├── App.tsx                     # App entry point with routing
│   └── global.css                  # Global styles and Tailwind theme
│
├── server/                          # Express API Backend
│   ├── index.ts                    # Main server setup
│   ├── node-build.ts               # Node build entry point
│   └── routes/                     # API route handlers
│       └── demo.ts
│
├── shared/                          # Shared Types (Client & Server)
│   └── api.ts                      # API type definitions
│
├── public/                          # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── netlify/                         # Netlify serverless functions
│   └── functions/
│       └── api.ts
│
├── .builder/                        # Builder.io project metadata
│   └── plans/
│       └── zen-tower-streams.md    # Implementation plan
│
├── index.html                       # HTML entry point
├── package.json                     # Project dependencies and scripts
├── pnpm-lock.yaml                   # Lock file for pnpm
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.ts               # Tailwind CSS theme (auto-discovered by PostCSS)
├── postcss.config.js                # PostCSS configuration
├── components.json                  # Shadcn/ui components configuration
├── netlify.toml                     # Netlify deployment configuration
└── .gitignore                       # Git ignore rules

```

## Key Directories

### `/config`
Vite build configuration files. These are explicitly passed to Vite via the `--config` flag:
- **vite.config.ts**: Client development and build configuration
  ```bash
  vite --config config/vite.config.ts
  ```
- **vite.config.server.ts**: Server build configuration for Node.js output
  ```bash
  vite build --config config/vite.config.server.ts
  ```

### Root Level - Configuration Files
The following configuration files remain at the project root because they require **auto-discovery** by build tools:

- **tailwind.config.ts**: Tailwind CSS design tokens and customizations
  - Auto-discovered and loaded by PostCSS
  - Must be at root for PostCSS to find it

- **postcss.config.js**: PostCSS configuration
  - Auto-discovered by Vite and build tools
  - Processes Tailwind CSS at build time

- **components.json**: Shadcn/ui component generator configuration
  - Expected at project root by the CLI tool

- **netlify.toml**: Netlify deployment configuration
  - Auto-discovered by Netlify during deployment

### `/client`
React Single Page Application (SPA) with TypeScript.
- **pages/**: Route components (each page is a route)
- **components/**: Reusable React components
  - **ui/**: Pre-built Radix UI components styled with Tailwind
  - **dashboard/**: Analytics dashboard-specific components
- **hooks/**: Custom React hooks for logic reuse
- **lib/**: Utility functions and helpers
- **global.css**: Global styles and CSS variables for theming

### `/server`
Express.js backend API server.
- Integrated with Vite dev server (single port)
- Handles API routes and server-side logic
- Supports serverless deployment with Netlify functions

### `/shared`
TypeScript interfaces and types shared between client and server.
- Type-safe API communication between frontend and backend

### `/docs`
Project documentation.
- **FUSION_STARTER.md**: Template and tech stack documentation
- **PROJECT_STRUCTURE.md**: This file

## Build & Development

### Scripts
```bash
pnpm dev              # Start development server (client + server on port 8080)
pnpm build            # Build both client and server for production
pnpm build:client     # Build client SPA only
pnpm build:server     # Build server for Node.js execution
pnpm start            # Run production server build
pnpm test             # Run tests with Vitest
pnpm format.fix       # Format code with Prettier
pnpm typecheck        # Validate TypeScript types
```

### Configuration Paths
- Vite configuration is located in `/config/vite.config.ts`
- Tailwind configuration is in `/config/tailwind.config.ts`
- TypeScript configuration in `tsconfig.json` references config files in `/config`

## Tech Stack

- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite
- **Styling**: Tailwind CSS 3 + PostCSS
- **UI Components**: Radix UI + Shadcn/ui
- **Backend**: Express.js
- **Charts**: Recharts
- **Testing**: Vitest
- **Package Manager**: pnpm
- **Icons**: Lucide React

## Deployment

### Netlify
The project is configured for Netlify deployment:
- Client builds to `dist/spa`
- Server functions deploy to `netlify/functions`
- Configuration in `/config/netlify.toml`

See `/config/netlify.toml` for build and deployment settings.

## Code Organization Principles

1. **Separation of Concerns**: Configuration separated from code
2. **Clean Root**: Only essential files in the project root
3. **Component Modularity**: Dashboard-specific components in dedicated folder
4. **Type Safety**: Shared types ensure consistency between client/server
5. **Path Aliases**: Use `@/` for client imports and `@shared/` for shared types
