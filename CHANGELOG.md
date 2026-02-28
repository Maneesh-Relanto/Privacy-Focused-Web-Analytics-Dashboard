# Changelog

All notable changes to PrivacyMetrics are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Browser and OS detection in tracking script
- Custom event tracking
- Data export (CSV / JSON)
- Email digest reports
- Goal and conversion tracking
- API webhooks
- Advanced filtering and segmentation

---

## [1.0.0-beta.1] — 2026-02-08

### Added
- Multi-website dashboard — create, manage, and delete tracked websites
- Website isolation — each website's data is fully separate
- Real-time event tracking via `pm.js` (2KB, zero dependencies)
- Unique visitor identification using hashed IP fingerprints (no cookies)
- Session tracking and session duration calculation
- Referrer source tracking
- User authentication — registration and login with JWT tokens
- Protected API routes via JWT middleware
- Dashboard metrics per website (page views, unique visitors, sessions, referrers)
- Website selector dropdown for switching between tracked sites
- Delete website functionality with confirmation dialogs
- Navigation menus (Back, Dashboard, Docs, Settings)
- Self-hosted support with SQLite database via Prisma ORM
- Docker deployment configuration (`infrastructure/Dockerfile`)
- Railway deployment configuration (`infrastructure/railway.json`)
- Netlify deployment configuration (`infrastructure/netlify.toml`)
- Input validation on all API endpoints using Zod schemas
- CORS configuration for credentials-based cross-origin requests
- Password hashing with bcryptjs
- 15+ developer documentation guides in `docs/`
- Automated validation script (`scripts/validate-tracking.ps1`)
- Test HTML page for tracking verification (`public/test-simple.html`)

### Fixed
- Prisma field alignment (`visitorHash → fingerprint`, `firstVisit → firstSeen`, `totalVisits → pageViews`)
- CORS credentials handling for cross-origin tracking requests
- Tracking code storage alongside website IDs

### Security
- Updated Vite to 7.3.1 (HIGH vulnerability fixed)
- Updated React Router to 7.13.0 (HIGH vulnerability fixed)
- IP addresses hashed server-side with salt — never stored in plain text
- No cookies, no persistent browser storage used for tracking

### Project Structure
- Organized root from ~20 files → 8 root-level files
- Created `infrastructure/` for deployment configs
- Created `scripts/` for utility scripts
- Created `env/` for environment variables (gitignored)
- Created `config-tools/` for tool configurations
- Moved `index.html` to `public/` folder

---

## [0.1.0] — 2026-01-15

### Added
- Initial project scaffold (React + Express + Prisma + SQLite)
- Basic tracking endpoint (`POST /api/v1/track`)
- Database schema for events, visitors, sessions, and websites
- Vite dev server configuration
- Basic frontend routing with React Router
- Tailwind CSS and Radix UI setup

---

[Unreleased]: https://github.com/Maneesh-Relanto/Privacy-Focused-Web-Analytics-Dashboard/compare/v1.0.0-beta.1...HEAD
[1.0.0-beta.1]: https://github.com/Maneesh-Relanto/Privacy-Focused-Web-Analytics-Dashboard/releases/tag/v1.0.0-beta.1
[0.1.0]: https://github.com/Maneesh-Relanto/Privacy-Focused-Web-Analytics-Dashboard/commits/main
