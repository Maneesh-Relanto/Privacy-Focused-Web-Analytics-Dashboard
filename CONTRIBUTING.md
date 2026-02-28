# Contributing to PrivacyMetrics

Thank you for your interest in contributing! PrivacyMetrics is an open source project and contributions of all kinds are welcome.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Coding Standards](#coding-standards)
- [Commit Message Format](#commit-message-format)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold it.

---

## Ways to Contribute

You don't have to write code to contribute. Here are several ways to help:

| Contribution | How |
|---|---|
| 🐛 Report a bug | [Open an issue](https://github.com/Maneesh-Relanto/Privacy-Focused-Web-Analytics-Dashboard/issues/new?template=bug_report.md) |
| 💡 Suggest a feature | [Start a discussion](https://github.com/Maneesh-Relanto/Privacy-Focused-Web-Analytics-Dashboard/discussions/categories/ideas) |
| 📖 Improve documentation | Edit a file in `docs/` and open a PR |
| 🧪 Write tests | See `tests/` folder |
| 🌍 Help with translations | Open a discussion first |
| ⭐ Star the repo | Helps others discover the project |

---

## Development Setup

### Prerequisites

- Node.js 18.0 or higher
- pnpm (`npm install -g pnpm`)

### 1. Fork & Clone

```bash
# Fork on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/Privacy-Focused-Web-Analytics-Dashboard.git
cd Privacy-Focused-Web-Analytics-Dashboard
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up the Database

```bash
pnpm db:push
```

### 4. Start Development Servers

```bash
pnpm dev
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

### 5. Run Quality Checks

Before opening a PR, make sure all checks pass:

```bash
pnpm quality-check   # runs lint + typecheck + tests
pnpm lint            # ESLint
pnpm typecheck       # TypeScript
pnpm test            # Tests
```

---

## Submitting a Pull Request

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** — keep them focused and minimal. One concern per PR.

3. **Test your changes** — run `pnpm quality-check` and verify the app works locally.

4. **Commit** using the [commit message format](#commit-message-format) below.

5. **Push** and open a Pull Request against `main`.

6. **Fill in the PR template** — describe what changed and why.

### PR Checklist

- [ ] Code passes `pnpm quality-check`
- [ ] New features have tests
- [ ] Documentation updated if needed
- [ ] PR targets the `main` branch
- [ ] Commit messages follow the format below

---

## Coding Standards

- **TypeScript** — All new code must be fully typed. No `any` unless justified.
- **Formatting** — Use Prettier. Run `pnpm format.fix` before committing.
- **Linting** — Follow ESLint rules. Run `pnpm lint` to check.
- **Privacy first** — Never add features that collect PII, set cookies, or enable cross-site tracking.
- **Small PRs** — Easier to review and merge. Split large changes into multiple PRs.

---

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description>

[optional body]
[optional footer]
```

**Types:**

| Type | Use for |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that isn't a fix or feature |
| `test` | Adding or fixing tests |
| `chore` | Build process, dependencies |
| `security` | Security fixes or updates |

**Examples:**

```
feat: Add browser/OS detection to tracking script
fix: Resolve session duration calculation for single-page visits
docs: Update deployment guide for Railway v3
```

---

## Reporting Bugs

Before opening an issue, please:
1. Search [existing issues](https://github.com/Maneesh-Relanto/Privacy-Focused-Web-Analytics-Dashboard/issues) to avoid duplicates
2. Try the latest version on `main`

When reporting, include:
- What you did
- What you expected to happen
- What actually happened
- Node.js version (`node --version`)
- OS and version

---

## Suggesting Features

Before building something big, [open a discussion](https://github.com/Maneesh-Relanto/Privacy-Focused-Web-Analytics-Dashboard/discussions/categories/ideas) first. This avoids wasted effort and lets us align on direction.

For small improvements, a PR with a clear description is fine directly.

---

## Questions?

- [GitHub Discussions Q&A](https://github.com/Maneesh-Relanto/Privacy-Focused-Web-Analytics-Dashboard/discussions/categories/q-a)
- Check the [Developer Guide](docs/DEVELOPER_GUIDE.md)

---

**Thank you for helping make PrivacyMetrics better! 🙏**
