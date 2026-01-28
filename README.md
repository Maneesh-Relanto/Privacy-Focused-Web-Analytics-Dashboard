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

## 📚 Documentation Hub

### 🎯 Start Here (Choose Your Path)

**New to this project?** Start with one of these based on your role:

| Role | Start With | Then Read | Time |
|------|-----------|-----------|------|
| **Complete Beginner** | [📖 Developer Guide](./docs/DEVELOPER_GUIDE.md) | [🚀 Quick Start Auth](./docs/QUICK_START_AUTHENTICATION.md) | 30 min |
| **Backend Developer** | [🗄️ Backend Setup](./docs/BACKEND_SETUP_GUIDE.md) | [📡 API Docs](./docs/API_DOCUMENTATION.md) | 45 min |
| **Frontend Developer** | [📁 Project Structure](./docs/PROJECT_STRUCTURE.md) | [🔗 Integration Guide](./docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md) | 40 min |
| **DevOps/Deployment** | [🚀 GitHub Pages](./docs/GITHUB_PAGES_DEPLOYMENT.md) | [🔍 Code Quality](./docs/CODE_QUALITY_SCANNING_GUIDE.md) | 30 min |

### 📖 Full Documentation Index

#### **Getting Started**
- **[📚 Documentation Index](./docs/INDEX.md)** - Master navigation guide for all documentation
- **[📖 Developer Guide](./docs/DEVELOPER_GUIDE.md)** - Complete setup, API usage, integration examples
- **[🚀 Quick Start - Authentication](./docs/QUICK_START_AUTHENTICATION.md)** - 5-minute auth setup

#### **API & Backend**
- **[📡 API Documentation](./docs/API_DOCUMENTATION.md)** - Complete API reference with all endpoints
- **[🗄️ Backend Setup Guide](./docs/BACKEND_SETUP_GUIDE.md)** - Database and Express.js configuration
- **[🌐 Website Management Guide](./docs/WEBSITE_MANAGEMENT_GUIDE.md)** - Website CRUD operations and examples

#### **Frontend & Architecture**
- **[📁 Project Structure](./docs/PROJECT_STRUCTURE.md)** - Folder organization and code architecture
- **[🔗 Frontend-Backend Integration](./docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md)** - How frontend connects to backend API

#### **Deployment & Infrastructure**
- **[🚀 GitHub Pages Deployment](./docs/GITHUB_PAGES_DEPLOYMENT.md)** - Deploy landing page to GitHub Pages
- **[🔍 Code Quality Scanning](./docs/CODE_QUALITY_SCANNING_GUIDE.md)** - SonarCloud and code quality setup

#### **Reference & Notes**
- **[📝 File Organization Notes](./docs/FILE_ORGANIZATION_NOTES.md)** - Notes about file structure and organization
- **[📚 Fusion Starter Notes](./docs/FUSION_STARTER.md)** - Original Fusion starter template reference
- **[🗺️ Documentation Structure](./docs/DOCUMENTATION_STRUCTURE.md)** - Complete documentation map and navigation guide

### 🔍 Quick Document Overview

| Document | Purpose | Best For |
|----------|---------|----------|
| [docs/INDEX.md](./docs/INDEX.md) | Navigation hub for all docs | Finding what to read |
| [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) | Complete setup & usage guide | Getting up and running |
| [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) | All API endpoints & examples | API integration |
| [docs/BACKEND_SETUP_GUIDE.md](./docs/BACKEND_SETUP_GUIDE.md) | Database & server setup | Backend developers |
| [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) | Code organization & architecture | Understanding codebase |
| [docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md](./docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md) | Frontend-API integration | Frontend developers |
| [docs/WEBSITE_MANAGEMENT_GUIDE.md](./docs/WEBSITE_MANAGEMENT_GUIDE.md) | Website CRUD with examples | Website operations |
| [docs/QUICK_START_AUTHENTICATION.md](./docs/QUICK_START_AUTHENTICATION.md) | Fast auth setup | Quick testing |
| [docs/GITHUB_PAGES_DEPLOYMENT.md](./docs/GITHUB_PAGES_DEPLOYMENT.md) | Deploy to GitHub Pages | Landing page deployment |
| [docs/CODE_QUALITY_SCANNING_GUIDE.md](./docs/CODE_QUALITY_SCANNING_GUIDE.md) | Code quality setup | DevOps & CI/CD |

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

## 🔗 Resources & Links

### Documentation
- **[📚 Documentation Index](./docs/INDEX.md)** - Master guide for navigating all documentation
- **[/docs](./docs)** - All technical documentation files
- **[📖 Developer Guide](./docs/DEVELOPER_GUIDE.md)** - Complete setup and usage guide

### Community & Links
- **[GitHub Repository](https://github.com/Maneesh-Relanto/Privacy-Focused-Web-Analytics-Dashboard)** - Source code
- **[GitHub Pages](https://maneesh-relanto.github.io/Privacy-Focused-Web-Analytics-Dashboard/)** - Live landing page
- **License**: [MIT](./LICENSE)

### Development
- **[🚀 Quick Start](#-quick-start)** - Installation and first steps
- **[🛠️ Available Commands](#-available-commands)** - npm scripts
- **[🏗️ Project Structure](#-project-structure)** - Codebase organization

---

## 📋 Complete Documentation Links

### Essential Reading
```
1. README.md (this file) ← You are here
2. docs/INDEX.md (documentation roadmap)
3. docs/DEVELOPER_GUIDE.md (setup & usage)
4. docs/API_DOCUMENTATION.md (API reference)
```

### By Role
- **👨‍💼 Project Managers**: Start with [docs/INDEX.md](./docs/INDEX.md)
- **👨‍💻 Backend Developers**: [docs/BACKEND_SETUP_GUIDE.md](./docs/BACKEND_SETUP_GUIDE.md) → [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
- **🎨 Frontend Developers**: [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) → [docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md](./docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md)
- **⚙️ DevOps Engineers**: [docs/GITHUB_PAGES_DEPLOYMENT.md](./docs/GITHUB_PAGES_DEPLOYMENT.md) → [docs/CODE_QUALITY_SCANNING_GUIDE.md](./docs/CODE_QUALITY_SCANNING_GUIDE.md)

### All Documents
- [docs/INDEX.md](./docs/INDEX.md) - Documentation index & roadmap
- [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) - Complete developer guide
- [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) - API reference
- [docs/BACKEND_SETUP_GUIDE.md](./docs/BACKEND_SETUP_GUIDE.md) - Backend setup
- [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) - Project architecture
- [docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md](./docs/FRONTEND_BACKEND_INTEGRATION_GUIDE.md) - Frontend integration
- [docs/WEBSITE_MANAGEMENT_GUIDE.md](./docs/WEBSITE_MANAGEMENT_GUIDE.md) - Website operations
- [docs/QUICK_START_AUTHENTICATION.md](./docs/QUICK_START_AUTHENTICATION.md) - Auth quick start
- [docs/GITHUB_PAGES_DEPLOYMENT.md](./docs/GITHUB_PAGES_DEPLOYMENT.md) - GitHub Pages deployment
- [docs/CODE_QUALITY_SCANNING_GUIDE.md](./docs/CODE_QUALITY_SCANNING_GUIDE.md) - Code quality setup
- [docs/FILE_ORGANIZATION_NOTES.md](./docs/FILE_ORGANIZATION_NOTES.md) - File structure notes
- [docs/FUSION_STARTER.md](./docs/FUSION_STARTER.md) - Fusion starter template reference

---

## 🔄 Navigation Tips

- **Lost?** → Check [docs/INDEX.md](./docs/INDEX.md) for guidance
- **Want to get started?** → Read [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md)
- **Need API help?** → See [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
- **Setting up backend?** → Follow [docs/BACKEND_SETUP_GUIDE.md](./docs/BACKEND_SETUP_GUIDE.md)
- **Need to deploy?** → Use [docs/GITHUB_PAGES_DEPLOYMENT.md](./docs/GITHUB_PAGES_DEPLOYMENT.md)

---

**Created as an open-source project**

_A clean, modern, privacy-focused analytics dashboard. Start with the [📚 Documentation Index](./docs/INDEX.md)._
