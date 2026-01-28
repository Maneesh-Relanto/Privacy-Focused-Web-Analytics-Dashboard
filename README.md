# PrivacyMetrics

> Privacy-Focused Web Analytics Dashboard

A development-stage analytics dashboard built with React, Express, and modern web technologies. This is an MVP (Minimum Viable Product) focused on core dashboard functionality.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)](https://nodejs.org)

**[📚 Documentation Index](#-documentation-hub)** | **[🚀 Quick Start](#-quick-start)** | **[🛠️ Tech Stack](#-tech-stack)**

---

## 📋 What This Project Is

PrivacyMetrics is a **dashboard interface for analytics data**. It provides:

- A modern, responsive dashboard UI for displaying analytics metrics
- Backend API structure for serving analytics data
- Authentication system (registration and login)
- TypeScript-based frontend and backend
- SQLite database integration

## ⚠️ What This Project Is NOT (Yet)

This is a **work-in-progress MVP**. The following are not yet implemented:

- ❌ Data collection/tracking script for websites
- ❌ Real analytics data ingestion from live websites
- ❌ Production-ready API documentation
- ❌ Custom event tracking
- ❌ Data export functionality
- ❌ Advanced analytics features
- ❌ Webhook integrations

---

## 🎯 Current Features

### Dashboard UI

- **Clean Dashboard Interface**: Modern design with metric cards displaying analytics data
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Date Range Filtering**: UI to select different time periods
- **Chart Visualizations**: Line charts for trends, bar charts for comparisons, pie charts for distributions

### Displayed Metrics

The dashboard displays the following metrics:

- Page Views (with trend percentage)
- Unique Visitors (with trend percentage)
- Average Session Duration (with trend percentage)
- Bounce Rate (with trend percentage)
- Top Pages by view count
- Traffic sources/referrers
- Device distribution (mobile/desktop/tablet)
- Geographic data (top locations)

### Backend Infrastructure

- **User Authentication**: Register and login endpoints
- **API Routes**: Dashboard data endpoints with Bearer token authentication
- **Database**: SQLite with Prisma ORM for data persistence
- **Type Safety**: Full TypeScript implementation

### Development Features

- **React 18**: Modern component architecture
- **Vite**: Fast development server with hot reload
- **TypeScript**: Full type safety throughout
- **Tailwind CSS & Radix UI**: Styling and component library
- **Express.js**: Backend server framework
- **Open Source**: MIT licensed

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10.14.0+

### 1. Installation

```bash
git clone <repository>
cd privacy-metrics
pnpm install
```

### 2. Database Setup

```bash
# Initialize SQLite database
npx prisma migrate dev --name init
```

### 3. Start Development

```bash
# Frontend (port 5173) and Backend (port 3000)
pnpm dev
```

### 4. Access the Application

- **Landing Page**: http://localhost:8080
- **Dashboard**: http://localhost:8080/dashboard (requires login)

---

## 📚 Documentation

Technical documentation and guides:

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Detailed setup and development guide
- **[FRONTEND_BACKEND_INTEGRATION_GUIDE.md](./docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md)** - How frontend and backend communicate
- **[PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)** - Code organization and architecture
- **[FILE_ORGANIZATION_NOTES.md](./docs/FILE_ORGANIZATION_NOTES.md)** - Configuration and file layout

---

## 🛠️ Available Commands

```bash
# Development
pnpm dev              # Start dev server with hot reload

# Building
pnpm build            # Build both client and server
pnpm build:client     # Build React SPA only
pnpm build:server     # Build Node.js server only

# Production
pnpm start            # Run production build

# Quality
pnpm test             # Run tests with Vitest
pnpm typecheck        # TypeScript validation
pnpm format.fix       # Format code with Prettier
```

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI
- **Backend**: Express.js with Node.js
- **Database**: SQLite with Prisma ORM
- **Charts**: Recharts for visualizations
- **Testing**: Vitest
- **Icons**: Lucide React

---

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── pages/             # Route pages
│   ├── components/        # Reusable React components
│   ├── hooks/             # Custom React hooks
│   └── styles/            # CSS files
├── server/                # Express backend
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom middleware
│   └── services/          # Business logic
├── shared/                # Shared TypeScript types
├── prisma/                # Database schema and migrations
├── docs/                  # Technical documentation
└── config/                # Build configuration
```

---

## 💾 Data & Privacy

### Current Phase

This is a **demonstration and development project**. The dashboard displays **sample/mock data** for UI/UX testing purposes. There is no live data collection from websites yet.

### Design Philosophy

The project is designed with privacy considerations in mind:

- User data is stored in a self-hosted database (SQLite)
- Authentication is required to access dashboard data
- No personal identifiable information (PII) is collected by the dashboard itself
- Full control over data stored on your own servers

### Future Considerations

As the project develops, privacy-respecting data collection practices will be implemented, including:

- Minimal data collection
- No cross-site tracking
- No personal data collection
- Compliance with privacy regulations

---

## 🔐 Authentication

The project includes a basic authentication system:

- **User Registration**: Create new accounts with email and password
- **User Login**: Authenticate with credentials
- **API Authentication**: Bearer token-based authentication for API endpoints
- **Password Security**: Bcrypt hashing for stored passwords

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

---

## 🔗 Resources

- **Documentation**: [/docs](./docs) - Technical documentation
- **Getting Started**: [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup instructions
- **Integration Guide**: [FRONTEND_BACKEND_INTEGRATION_GUIDE.md](./docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md) - API integration

---

**Created as an open-source project**

_A clean, modern dashboard for analytics data._
