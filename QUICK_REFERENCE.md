# Quick Folder Navigation Guide

## 🎯 Find What You Need

### I want to...

#### 📝 **Read Documentation**
- **Project overview** → [README.md](README.md)
- **Developer setup** → [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- **Folder structure** → [ROOT_STRUCTURE.md](ROOT_STRUCTURE.md)
- **Complete organization guide** → [PROJECT_ORGANIZATION.md](PROJECT_ORGANIZATION.md)
- **All guides** → [docs/](docs/) folder

#### 🚀 **Deploy the Project**
- **Docker setup** → [infrastructure/Dockerfile](infrastructure/Dockerfile)
- **Railway config** → [infrastructure/railway.json](infrastructure/railway.json)
- **Netlify config** → [infrastructure/netlify.toml](infrastructure/netlify.toml)
- **Deployment guides** → [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md#-deployment)

#### ⚙️ **Configure Environment**
- **Template** → [env/.env.example](env/.env.example)
- **Local setup** → Copy to `env/.env.local`
- **Load during dev** → Automatically loaded by `pnpm dev`

#### 🛠️ **Run Scripts**
- **Validate tracker** → `pwsh scripts/validate-tracking.ps1`
- **Security fixes** → `pwsh scripts/fix-security-issues.ps1` (Windows)
- **Security fixes** → `bash scripts/fix-security-issues.sh` (Unix)
- **Test websites** → `bash scripts/test_websites.sh`

#### 💻 **Find Source Code**
- **React components** → [client/](client/) folder
- **Express backend** → [server/](server/) folder
- **Shared types** → [shared/](shared/) folder
- **Database schema** → [prisma/schema.prisma](prisma/schema.prisma)

#### 📊 **View Tracker Code**
- **Main tracker** → [public/pm.js](public/pm.js) (79 lines)
- **Test simple** → [public/test-simple.html](public/test-simple.html)
- **Test debug** → [public/test-debug.html](public/test-debug.html)

#### 🧪 **Run Tests**
- **Test files** → [tests/](tests/) folder
- **Run tests** → `bash scripts/test_websites.sh`
- **Validation** → `pwsh scripts/validate-tracking.ps1`

#### 📚 **Find Internal Notes**
- **Confidential docs** → [confidential_docs/](confidential_docs/) (not in git)

---

## 📁 Folder Reference

```
Privacy-Focused-Web-Analytics-Dashboard/
│
├── 📄 README.md                    ← Start here!
├── 📄 DEVELOPER_GUIDE.md           ← Setup instructions
├── 📄 ROOT_STRUCTURE.md            ← Folder guide
├── 📄 PROJECT_ORGANIZATION.md      ← Visual structure
├── 📄 ORGANIZATION_COMPLETE.md     ← What was organized
│
├── 📁 client/                      ← React frontend
│   ├── pages/                      ← Page components
│   ├── components/                 ← Reusable UI components
│   └── hooks/                      ← Custom hooks
│
├── 📁 server/                      ← Express backend
│   ├── routes/                     ← API endpoints
│   ├── services/                   ← Business logic
│   └── middleware/                 ← Authentication, etc.
│
├── 📁 infrastructure/              ← Deployment configs ⚙️
│   ├── Dockerfile                  ← Docker image
│   ├── railway.json                ← Railway deployment
│   └── netlify.toml                ← Netlify deployment
│
├── 📁 scripts/                     ← Utility scripts 🛠️
│   ├── validate-tracking.ps1       ← Validation script
│   ├── fix-security-issues.ps1     ← Security fixes (Windows)
│   ├── fix-security-issues.sh      ← Security fixes (Unix)
│   └── test_websites.sh            ← Website tests
│
├── 📁 env/                         ← Environment files 🔐
│   ├── .env.example                ← Template (in git)
│   └── .env.local                  ← Local config (NOT in git)
│
├── 📁 public/                      ← Static files
│   ├── pm.js                       ← Tracker script (79 lines!)
│   ├── test-simple.html            ← Simple test page
│   ├── test-debug.html             ← Debug test page
│   └── index.html                  ← Entry point
│
├── 📁 docs/                        ← Public documentation 📖
│   ├── API_DOCUMENTATION.md
│   ├── BACKEND_SETUP_GUIDE.md
│   └── ... (20+ more guides)
│
├── 📁 config/                      ← Build config
│   └── vite.config.ts              ← Vite configuration
│
├── 📁 config-tools/                ← Tool configs
│   ├── .eslintrc.json              ← ESLint
│   ├── tsconfig.json               ← TypeScript
│   ├── tailwind.config.ts          ← Tailwind
│   └── ... (other configs)
│
├── 📁 prisma/                      ← Database
│   └── schema.prisma               ← Data model
│
├── 📁 tests/                       ← Test suite
│
├── 📁 confidential_docs/           ← Internal notes (NOT in git)
│
└── 📁 node_modules/                ← Dependencies (NOT in git)
```

---

## ⚡ Quick Commands

```bash
# Development
pnpm install          # Install dependencies
pnpm dev              # Start dev servers

# Build
pnpm build            # Build for production

# Scripts
pwsh scripts/validate-tracking.ps1       # Validate
bash scripts/test_websites.sh            # Test

# Environment
cp env/.env.example env/.env.local       # Setup env
nano env/.env.local                      # Edit config
```

---

## 🔍 File Lookup Chart

| Need | Location | File |
|------|----------|------|
| Project overview | root | README.md |
| Setup instructions | root | DEVELOPER_GUIDE.md |
| Folder guide | root | ROOT_STRUCTURE.md |
| Docker image | infrastructure/ | Dockerfile |
| Railway config | infrastructure/ | railway.json |
| Netlify config | infrastructure/ | netlify.toml |
| Validation script | scripts/ | validate-tracking.ps1 |
| Tracker code | public/ | pm.js |
| API endpoints | server/routes/ | *.ts |
| React pages | client/pages/ | *.tsx |
| Database schema | prisma/ | schema.prisma |
| Environment template | env/ | .env.example |
| API docs | docs/ | API_DOCUMENTATION.md |

---

## 🚀 Common Workflows

### Setting Up Locally
```bash
1. git clone <repo>
2. cd Privacy-Focused-Web-Analytics-Dashboard
3. cp env/.env.example env/.env.local
4. pnpm install
5. pnpm dev
```

### Deploying to Docker
```bash
1. docker build -f infrastructure/Dockerfile -t privacy-metrics .
2. docker run -p 3000:3000 -p 8080:8080 privacy-metrics
3. Visit http://localhost:8080
```

### Running Validation
```bash
pwsh scripts/validate-tracking.ps1
```

### Adding New Feature
```bash
1. Add component to client/components/
2. Add endpoint to server/routes/
3. Update shared/types/
4. Test in pnpm dev
5. Commit to feature branch
```

---

## 💡 Pro Tips

- ✅ Always copy `.env.example` to `.env.local` (never commit `.env.local`)
- ✅ Infrastructure configs in `infrastructure/` for easy deployment setup
- ✅ Scripts in `scripts/` for automation and testing
- ✅ Keep root folder clean - only add to root if essential
- ✅ Check `ROOT_STRUCTURE.md` if unsure where something goes
- ✅ Run validation: `pwsh scripts/validate-tracking.ps1` before pushing

---

**Need more help?** See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)

**Confused about folder structure?** See [ROOT_STRUCTURE.md](ROOT_STRUCTURE.md)

**Want visual folder map?** See [PROJECT_ORGANIZATION.md](PROJECT_ORGANIZATION.md)
