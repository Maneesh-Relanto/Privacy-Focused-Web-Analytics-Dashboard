# Code Quality Scanning Guide

This document outlines all available options for code scanning, quality checks, and security analysis for the Privacy-Focused Web Analytics Dashboard.

---

## 1. Local Code Quality Checks (Already Configured)

### Quick Quality Check

Run all quality checks locally before pushing:

```bash
npm run quality-check
```

This command runs in sequence:

1. **Type checking** (`npm run typecheck`) - TypeScript validation
2. **Linting** (`npm run lint`) - Code style and best practices
3. **Testing** (`npm run test`) - Unit tests with Vitest
4. **Code formatting** (`npm run format.fix`) - Auto-format code

### Individual Commands

**Linting (ESLint):**

```bash
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
```

**Type Checking:**

```bash
npm run typecheck         # TypeScript validation
```

**Testing:**

```bash
npm run test              # Run unit tests
```

**Code Formatting:**

```bash
npm run format.fix        # Auto-format with Prettier
```

### ESLint Configuration

- **File**: `.eslintrc.json`
- **Ignores**: `.eslintignore`
- **Plugins**:
  - `@typescript-eslint` - TypeScript support
  - `react` - React best practices
  - `react-hooks` - React hooks linting
  - `prettier` - Code formatting integration

---

## 2. SonarCloud (Recommended for GitHub)

**Best for**: Comprehensive code quality, security, and maintainability.

### Features

- ✅ Automatic code analysis on every push/PR
- ✅ Security vulnerability detection
- ✅ Code smell and technical debt tracking
- ✅ Code coverage metrics
- ✅ PR comments with findings
- ✅ Free for public repositories
- ✅ No server setup needed (cloud-based)

### Setup Steps

1. **Visit SonarCloud**
   - Go to [https://sonarcloud.io](https://sonarcloud.io)
   - Sign in with your GitHub account
   - Grant necessary permissions

2. **Add Your Repository**
   - Click "Import an organization"
   - Select `Maneesh-Relanto` organization
   - Select `Privacy-Focused-Web-Analytics-Dashboard` repository

3. **Configure GitHub Action**
   - SonarCloud will provide a GitHub Action workflow
   - Create `.github/workflows/sonarcloud.yml`:

```yaml
name: SonarCloud
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]
jobs:
  sonarcloud:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONARCLOUD_TOKEN: ${{ secrets.SONARCLOUD_TOKEN }}
```

4. **Add SONARCLOUD_TOKEN Secret**
   - Go to GitHub repo > Settings > Secrets > New repository secret
   - Name: `SONARCLOUD_TOKEN`
   - Value: Your SonarCloud token (from SonarCloud dashboard)

5. **Configure sonar-project.properties**
   - Create file: `sonar-project.properties`

```properties
sonar.projectKey=Maneesh-Relanto_Privacy-Focused-Web-Analytics-Dashboard
sonar.organization=maneesh-relanto
sonar.sources=client,server
sonar.tests=
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx
sonar.exclusions=node_modules/**,dist/**,coverage/**,.confidential/**
sonar.typescript.lcov.reportPaths=coverage/lcov.info
```

### Dashboard & Reports

- **Public URL**: `https://sonarcloud.io/dashboard?id=YOUR_PROJECT_KEY`
- View metrics: Code quality, maintainability, security, coverage

---

## 3. GitHub CodeQL (Free & Built-in)

**Best for**: Security vulnerability detection only.

### Features

- ✅ Detects security vulnerabilities
- ✅ Free for public repositories
- ✅ Built into GitHub (no external account needed)
- ✅ Automatic PR comments
- ✅ Data flow and taint analysis

### Setup Steps

1. **Enable Code Scanning**
   - Go to GitHub repo > Security > Code scanning > Set up code scanning
   - Click "Set up with this workflow" for CodeQL

2. **GitHub Automatically Creates Workflow**
   - File: `.github/workflows/github-code-scanning.yml`
   - Runs automatically on push and PRs

3. **View Results**
   - Go to repo > Security > Code scanning alerts
   - Review and dismiss alerts as needed

---

## 4. OWASP Dependency Check (Security)

**Best for**: Detecting vulnerable dependencies in `package.json`.

### Features

- ✅ Identifies known vulnerabilities in dependencies
- ✅ Free and open-source
- ✅ Can run locally or in CI/CD

### Local Usage

```bash
npm audit                 # Shows vulnerable dependencies
npm audit fix             # Attempts to auto-fix
```

### GitHub Action Setup

Create `.github/workflows/dependency-check.yml`:

```yaml
name: Dependency Check
on:
  push:
    branches: [main]
  pull_request:

jobs:
  dependency-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: dependency-check/Dependency-Check_Action@main
        with:
          path: "."
          format: "JSON"
```

---

## 5. DeepSource (All-in-One Alternative)

**Best for**: Code quality + security + performance.

### Features

- ✅ Similar to SonarCloud
- ✅ Free tier available
- ✅ Analyzes: bugs, code smells, security, performance
- ✅ GitHub integration
- ✅ Auto-fix suggestions

### Setup

1. Go to [deepsource.io](https://deepsource.io)
2. Sign in with GitHub
3. Activate your repository
4. DeepSource automatically creates workflow

---

## 6. Snyk (Dependency + Code Security)

**Best for**: Finding vulnerabilities in dependencies and code.

### Features

- ✅ Dependency vulnerability detection
- ✅ Code vulnerability detection
- ✅ Auto-fix PRs
- ✅ Free tier available

### Setup

1. Go to [snyk.io](https://snyk.io)
2. Sign in with GitHub
3. Authorize and import repositories
4. Automatic scans on every push

---

## Recommended Configuration (Best Practice)

For comprehensive coverage without paying anything, use this combination:

### Local (Run Before Pushing)

```bash
npm run quality-check    # Type check + Lint + Test + Format
```

### GitHub Automated Scanning

1. **SonarCloud** - General code quality + security
2. **CodeQL** - Security vulnerabilities (if public)
3. **npm audit** - Dependency vulnerabilities

### CI/CD Pipeline (GitHub Actions)

- Run `npm run quality-check` on every PR
- Run SonarCloud analysis
- Run CodeQL analysis
- Block merge if quality gates fail

---

## File Structure

```
.
├── .eslintrc.json                 # ESLint configuration
├── .eslintignore                  # ESLint ignore patterns
├── sonar-project.properties       # SonarCloud configuration
├── .github/
│   └── workflows/
│       ├── sonarcloud.yml         # SonarCloud action
│       ├── github-code-scanning.yml # CodeQL action
│       └── quality-check.yml      # Local checks action
└── package.json                   # Scripts added
```

---

## Next Steps

**Immediate (Today):**

1. ✅ ESLint installed and configured
2. Run `npm run quality-check` locally
3. Fix any linting/type issues found

**Short-term (This Week):**

1. Setup SonarCloud for comprehensive analysis
2. Enable GitHub CodeQL for security
3. Add `npm audit` to CI/CD pipeline

**Long-term:**

1. Monitor SonarCloud dashboard for trends
2. Maintain >80% code coverage
3. Keep all vulnerabilities at 0

---

## Troubleshooting

### ESLint Not Working?

```bash
npm install --save-dev eslint @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser eslint-config-prettier eslint-plugin-react \
  eslint-plugin-react-hooks
```

### TypeScript Issues?

```bash
npm run typecheck  # More detailed error messages
```

### Dependencies Outdated?

```bash
npm audit fix      # Auto-fix known vulnerabilities
npm outdated       # See what can be updated
```

---

## References

- [ESLint Documentation](https://eslint.org/)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [GitHub CodeQL Documentation](https://codeql.github.com/)
- [npm audit Documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [OWASP Top 10](https://owasp.org/Top10/)
