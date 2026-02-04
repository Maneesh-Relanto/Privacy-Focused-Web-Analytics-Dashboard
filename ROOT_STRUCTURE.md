# Root Folder Structure

This document explains the organization of the project root folder.

## 📁 Folder Organization

### Core Application Folders

```
Privacy-Focused-Web-Analytics-Dashboard/
├── client/                 # React frontend (TypeScript)
│   ├── pages/             # Page components
│   ├── components/        # UI components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities and libraries
│
├── server/                # Express.js backend (TypeScript)
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   ├── schemas/           # Zod validation schemas
│   └── lib/               # Utilities
│
├── public/                # Static files & tracking script
│   ├── pm.js              # PrivacyMetrics tracker (79 lines, zero deps)
│   ├── pm-tracker.js      # Alternative tracker
│   ├── test-simple.html   # Simple test page
│   ├── test-debug.html    # Debug test page
│   └── robots.txt         # SEO
│
├── prisma/                # Database setup
│   ├── schema.prisma      # Database schema (SQLite)
│   └── migrations/        # Database migrations
│
├── config/                # Vite & build config
│   └── vite.config.*.ts   # Vite configuration files
│
├── docs/                  # Internal documentation
│   └── *.md               # Various guides and references
│
├── confidential_docs/     # Internal notes (GITIGNORED)
│   └── *.md               # Not committed to git
│
├── tests/                 # Testing setup
│   └── *.test.ts          # Test files
│
└── shared/                # Shared types & utilities
    ├── api.ts             # API types
    └── types/             # Shared TypeScript types
```

### Infrastructure & Deployment

```
infrastructure/           # Deployment & containerization files
├── Dockerfile             # Docker image definition
├── .dockerignore          # Docker ignore rules
├── railway.json           # Railway.app deployment config
└── netlify.toml           # Netlify deployment config
```

**Purpose:** Contains all deployment and infrastructure-as-code files.

### Scripts & Utilities

```
scripts/                  # Utility scripts
├── fix-security-issues.ps1  # Windows security fixes
├── fix-security-issues.sh   # Unix security fixes
├── test_websites.sh         # Website testing script
└── validate-tracking.ps1    # Validation script
```

**Purpose:** Helper scripts for maintenance, testing, and security.

### Environment Configuration

```
env/                      # Environment files (GITIGNORED)
├── .env.local             # Local development secrets (not in git)
└── .env.example           # Example env vars (in git)
```

**Purpose:** Manage environment variables per deployment environment.

### Root Level Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies & scripts |
| `pnpm-lock.yaml` | Dependency lock file |
| `package-lock.json` | npm lock file (if using npm) |
| `.gitignore` | Git ignore rules |
| `README.md` | Project overview & quick start |
| `DEVELOPER_GUIDE.md` | Complete developer documentation |
| `ROOT_STRUCTURE.md` | This file |

### Important: What's NOT in Root

❌ Configuration files (moved to build tool locations or removed)
❌ Shell scripts (moved to `scripts/`)
❌ Environment files (moved to `env/`)
❌ Deployment configs (moved to `infrastructure/`)
❌ Internal docs (moved to `confidential_docs/`)

---

## 🚀 How to Use This Structure

### Adding a New Feature

1. **Frontend component:** Add to `client/components/` or `client/pages/`
2. **Backend endpoint:** Add to `server/routes/`
3. **Database model:** Update `prisma/schema.prisma`
4. **API types:** Update `shared/api.ts`

### Deploying

1. **Docker:** Use files in `infrastructure/Dockerfile`
2. **Railway:** Use `infrastructure/railway.json`
3. **Netlify:** Use `infrastructure/netlify.toml`

### Running Scripts

```bash
# Validation
pwsh scripts/validate-tracking.ps1

# Security fixes
pwsh scripts/fix-security-issues.ps1      # Windows
bash scripts/fix-security-issues.sh       # Unix

# Testing
bash scripts/test_websites.sh
```

### Environment Variables

1. Copy `env/.env.example` to `env/.env.local`
2. Update values for your environment
3. Variables are automatically loaded by the build system

---

## 📊 Folder Statistics

| Folder | Files | Purpose |
|--------|-------|---------|
| `client/` | Components, pages, hooks | React frontend |
| `server/` | Routes, services, middleware | Express backend |
| `public/` | Static files, tracker script | Assets & tracking |
| `prisma/` | Schema, migrations | Database |
| `docs/` | Guides, references | Documentation |
| `scripts/` | Utility scripts | Automation |
| `infrastructure/` | Deployment configs | DevOps |
| `tests/` | Test files | QA |

---

## 🔄 Migration Guide (If Upgrading)

If you're upgrading from an older version with files in the root:

### Old Structure → New Structure

```
# Old
/Dockerfile → /infrastructure/Dockerfile
/railway.json → /infrastructure/railway.json
/netlify.toml → /infrastructure/netlify.toml
/.dockerignore → /infrastructure/.dockerignore

/fix-security-issues.ps1 → /scripts/fix-security-issues.ps1
/validate-tracking.ps1 → /scripts/validate-tracking.ps1
/test_websites.sh → /scripts/test_websites.sh

/.env → /env/.env.local
/.env.example → /env/.env.example
```

---

## 💡 Tips

- Keep root folder clean (only package.json, README, .gitignore, main docs)
- Scripts go in `scripts/`, configs in `infrastructure/`
- Sensitive files go in `env/` and are gitignored
- Internal notes go in `confidential_docs/` (gitignored)
- Public docs go in `docs/`

---

**Last updated:** February 2025

See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for setup instructions.
