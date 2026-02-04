# PrivacyMetrics

> Privacy-Focused Web Analytics Dashboard

A self-hosted analytics solution with privacy at its core. Zero cookies, zero fingerprinting, and complete data ownership.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)](https://nodejs.org)

---

## 🚀 Quick Start

**New to PrivacyMetrics?** Start here: **[📖 DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)**

Everything you need to get started in one document:
- Installation & setup
- Testing locally
- Integration examples
- Troubleshooting
- Deployment guides

---

## ✨ Features

- **One-Line Integration** - Add a single script tag to your website
- **Privacy-First** - No cookies, no fingerprinting, no personal data collection
- **Self-Hosted** - Own your data completely
- **Real-Time Analytics** - See visitor activity as it happens
- **Simple Dashboard** - Clean, intuitive interface
- **Multiple Websites** - Manage analytics for unlimited sites
- **GDPR Compliant** - No consent required
- **Open Source** - MIT License

---

## 📊 What Gets Tracked

✅ Page views  
✅ Unique visitors  
✅ Session duration  
✅ Referrer sources  
✅ Device type  
✅ Browser/OS  

❌ No cookies  
❌ No fingerprinting  
❌ No personal data

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: SQLite + Prisma ORM
- **Tracking**: Vanilla JavaScript (2KB, zero dependencies)

---

## 📁 Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── public/          # Static files + tracking script
├── prisma/          # Database schema
└── DEVELOPER_GUIDE.md  # Complete developer documentation
```

---

## 🔧 Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Start dev servers (frontend + backend)
pnpm dev
```

**Access:**
- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- Database: SQLite at `prisma/dev.db`

---

## 📖 Full Documentation

**All you need is in one place:** **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)**

This includes:
- Complete setup instructions
- Testing procedures
- Integration examples (React, Vue, plain HTML, etc.)
- API endpoints
- Deployment guides
- Troubleshooting

**For internal notes and old docs:** See `confidential_docs/` folder (not committed to git)

---

## 🔐 Security & Privacy

✅ **Privacy by Design**
- No cookies or fingerprinting
- IP addresses are hashed one-way
- Session storage only (expires when browser closes)
- No cross-site tracking

✅ **Secure Backend**
- JWT authentication
- Password hashing with bcrypt
- Proper CORS configuration
- Protected API endpoints

---

## 📦 Deployment

Ready to deploy? See deployment section in [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md):

- Railway
- Netlify
- Docker
- Self-hosted

---

## 🐛 Issues & Support

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Security**: Report security vulnerabilities privately

## 📚 Documentation Hub

**All documentation is in one place:** [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)

**For internal notes and older docs:** See `confidential_docs/` folder

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🙌 Contributing

Contributions welcome! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

**Questions?** Check [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) or open an issue. 🚀
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
