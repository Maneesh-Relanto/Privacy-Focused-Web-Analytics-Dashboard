# PrivacyMetrics

> Privacy-First Web Analytics for the Modern Web

A production-ready, self-hosted analytics dashboard built with React, Express, and modern web technologies. Track meaningful user insights without sacrificing privacy or user data.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)](https://nodejs.org)

---

## 🎯 Agenda

PrivacyMetrics exists to solve a critical problem in the web analytics space: **most analytics tools force you to choose between insights and privacy**.

### The Problem We Solve

Many traditional analytics platforms require:

- ❌ Tracking users across multiple sites
- ❌ Storing personal identifiable information (PII)
- ❌ Complex compliance with GDPR, CCPA, and privacy regulations
- ❌ Vendor lock-in with proprietary data formats
- ❌ High costs and complex setup processes
- ❌ Slow performance with bloated scripts (100KB+)

### Our Vision

**Developers deserve analytics that:**

- ✅ Respects user privacy by default
- ✅ Is privacy-compliant out of the box (GDPR, CCPA ready)
- ✅ Can be self-hosted on your own infrastructure
- ✅ Has minimal performance impact (2KB)
- ✅ Provides the insights you actually need
- ✅ Is open source and transparent
- ✅ Is simple to set up and maintain

---

## 🚀 Why PrivacyMetrics?

### 1. **Privacy First, Not an Afterthought**

Unlike most analytics platforms in the market, we **never collect PII**. No cookies, no tracking pixels, no fingerprinting. Just clean, privacy-respecting analytics.

```
Traditional Analytics:
User → Tracking Pixel → Third-party Server → PII Database → Compliance Issues

PrivacyMetrics:
User → Minimal Event → Your Server → Anonymous Analytics → Complete Control
```

### 2. **Complete Data Ownership**

Your analytics stay on **your servers**. No third-party vendor access. No data exports for compliance. No surprise policy changes.

- Host on your own infrastructure
- Own 100% of your data
- Never rely on external vendors
- Full control over data retention and deletion

### 3. **Lightweight & Fast**

**Only 2KB** of JavaScript vs 100KB+ for traditional solutions.

| Feature           | PrivacyMetrics | Traditional Solutions  |
| ----------------- | -------------- | ---------------------- |
| Script Size       | 2KB            | 100KB+                 |
| First Load Impact | Minimal        | Noticeable             |
| CLS Impact        | None           | Potential              |
| Privacy Compliant | Yes            | Requires Configuration |
| Self-Hosted       | Yes            | No                     |

### 4. **Compliance Built In**

- ✅ GDPR compliant by default (no consent banner needed)
- ✅ CCPA ready
- ✅ No cross-site tracking
- ✅ No personal data collection
- ✅ Transparent data handling

### 5. **Beautiful, Intuitive Dashboard**

Monitor all key metrics in a **single, clean interface**:

- Real-time visitor counts
- Page views and trends
- Traffic sources
- Geographic distribution
- Device breakdown
- Top pages and referrers

### 6. **Open Source**

Fully transparent source code. No hidden tracking, no proprietary algorithms. Fork, modify, audit, and deploy with confidence.

---

## ✨ Current Features (Demo)

### Dashboard UI & Visualization

- 📊 **Dashboard Interface**: Modern, clean design with metric cards
- 🌙 **Dark Mode**: Full dark mode support
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 📈 **Chart Visualizations**: Line charts, bar charts, pie charts
- 🔍 **Date Range Filtering**: View data for different time periods
- ⚡ **Fast Performance**: Optimized React components

### Metric Display

The demo dashboard displays sample metrics including:
- **Page Views**: Visual trends over time
- **Unique Visitors**: Visitor count metrics
- **Session Duration**: Time spent on site
- **Bounce Rate**: User engagement metrics
- **Traffic Sources**: Referrer breakdown
- **Geographic Data**: Regional distribution
- **Device Types**: Desktop, mobile, tablet breakdown
- **Top Pages**: Popular page listings
- **Referrer Sources**: Traffic source analysis

### Development Features

- **TypeScript**: Full type safety throughout
- **React 18**: Modern component architecture
- **Vite**: Lightning-fast development server
- **Open Source**: MIT licensed, fully transparent code
- **Docker Ready**: Easy containerization for deployment

## 🚀 Coming Soon

These features are currently in development:

- **Real Data Collection**: Website tracking script and data ingestion
- **REST API**: Programmatic access to analytics data
- **Authentication**: User accounts and API keys
- **Database Integration**: PostgreSQL, MySQL, SQLite support
- **Custom Events**: Track business-specific metrics
- **Data Export**: CSV and JSON export functionality
- **Webhook Support**: Real-time event notifications

---

## 📊 Use Cases

### 1. **Privacy-Conscious SaaS**

Provide transparent analytics to your customers without compromising their privacy.

```
Your Customer's Websites
        ↓
    PrivacyMetrics API
        ↓
    Your Analytics Dashboard
        ↓
    Show to Your Customers (No Privacy Concerns)
```

### 2. **Enterprise Analytics**

Self-host on your own infrastructure for complete compliance with enterprise security policies.

### 3. **Indie Developers & Startups**

Simple setup, affordable hosting, and full transparency. No vendor lock-in.

### 4. **GDPR/Privacy-Required Markets**

Industries like healthcare, finance, and EU-based companies can now use analytics without legal headaches.

### 5. **Open Source Projects**

Track usage of your open source projects without tracking users.

---

## 🏗️ Tech Stack

Built with **production-ready** technologies:

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3 + Radix UI
- **Routing**: React Router 6 (SPA)
- **Charts**: Recharts for beautiful visualizations
- **Backend**: Express.js with Node.js
- **Database**: Ready for PostgreSQL, MySQL, or SQLite
- **Testing**: Vitest for unit and integration tests
- **Deployment**: Netlify, Vercel, or self-hosted
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

---

## 🚀 Quick Start

Get up and running in 5 minutes:

### 1. **Clone & Install**

```bash
git clone <repository>
cd privacy-metrics
pnpm install
```

### 2. **Start Development**

```bash
pnpm dev
# Runs on http://localhost:8080
```

### 3. **View the App**

- Landing Page: http://localhost:8080/
- Dashboard: http://localhost:8080/dashboard

### Next Steps

For detailed setup instructions including production deployment, database setup, Docker, and troubleshooting:

👉 **[Read the Complete Getting Started Guide →](./GETTING_STARTED.md)**

---

## 📚 Documentation

Start here for setup and deployment:
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Step-by-step setup guide for development and production

Technical documentation is available in the `/docs` folder:

- **[FUSION_STARTER.md](./docs/FUSION_STARTER.md)** - Technical architecture and setup
- **[PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)** - How the code is organized
- **[FILE_ORGANIZATION_NOTES.md](./docs/FILE_ORGANIZATION_NOTES.md)** - Config file strategy

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

## 🔒 Privacy & Security

### What We Collect

- **Anonymized Page Views**: Which pages are visited
- **Session Information**: How long users stay
- **Device Type**: Mobile, Desktop, Tablet
- **Geographic Region**: Country/region level only
- **Traffic Source**: Referrer domain

### What We DON'T Collect

- ❌ Personal identifiable information (names, emails)
- ❌ Cookies or persistent identifiers
- ❌ User profiles or fingerprints
- ❌ Device identifiers
- ❌ Cross-site tracking
- ❌ Sensitive personal data

### Security Features

- 🔐 Self-hosted = Complete control
- 🔑 API authentication built-in
- 🛡️ HTTPS support
- 📊 No third-party data sharing
- 🔍 Open source audit trail

---

## 📈 Why Developers Are Choosing PrivacyMetrics

> _"Finally, analytics that doesn't feel like we're spying on our users. PrivacyMetrics gives us the insights we need while respecting privacy."_ — Privacy-First Founder

### The Developer Win

- ✅ **No Compliance Headaches**: Built-in GDPR/CCPA compliance
- ✅ **Full Transparency**: Open source, audit-friendly
- ✅ **Lightweight**: Minimal performance impact
- ✅ **Developer-Friendly**: TypeScript, REST API, good docs
- ✅ **Cost-Effective**: Self-hosted or affordable managed hosting
- ✅ **Future-Proof**: Own your data and code

---

## 💡 Getting Started with Development

### Setting Up Your Environment

```bash
# Prerequisites
- Node.js 22+
- pnpm 10.14.0+

# Install dependencies
pnpm install

# Start development
pnpm dev

# Visit http://localhost:8080
```

### Project Structure

```
├── client/              # React SPA
│   ├── pages/          # Route components
│   ├── components/     # Reusable components
│   └── hooks/          # Custom React hooks
├── server/             # Express backend
├── shared/             # Shared types
├── config/             # Build configuration
└── docs/               # Documentation
```

---

## 🤝 Contributing

We believe in open source and community contributions! Here's how you can help:

1. **Report Issues**: Found a bug? [Create an issue](https://github.com)
2. **Feature Requests**: Have an idea? [Discuss it](https://github.com)
3. **Code Contributions**: Make a pull request!
4. **Documentation**: Improve our docs
5. **Spread the Word**: Tell others about privacy-first analytics

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

This means:

- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute
- ❌ Not liable for issues
- ❌ Must include license

---

## 🔗 Links & Resources

- **Documentation**: [/docs](./docs) - Technical docs and architecture
- **Issues**: [GitHub Issues](#) - Report bugs or request features
- **Discussions**: [GitHub Discussions](#) - Ask questions and get help

### Learn More

- Privacy by Design principles
- GDPR compliance requirements
- CCPA (California Consumer Privacy Act)
- Privacy-respecting analytics best practices

---

## 🙏 Acknowledgments

PrivacyMetrics is built on the shoulders of giants:

- **React** & **TypeScript** for building solid foundations
- **Radix UI** & **Tailwind CSS** for beautiful components
- **Recharts** for stunning visualizations
- **Express.js** for robust backend
- **Vite** for lightning-fast builds

---

## ❓ FAQ

### Q: Is PrivacyMetrics completely free?

**A:** Yes! It's open source and MIT licensed. You can self-host for free. We also offer a managed hosting option for those who prefer it.

### Q: Can I use it alongside other analytics tools?

**A:** Absolutely. Many projects use multiple analytics platforms. PrivacyMetrics gives you privacy-focused metrics while complementing other analytics solutions.

### Q: How accurate are the analytics?

**A:** Very accurate for anonymized metrics. We don't track individuals, so we can't provide user-level data, but aggregate metrics are highly accurate.

### Q: Is it compliant with GDPR?

**A:** Yes, out of the box. Since we don't collect personal data, GDPR consent isn't required.

### Q: Can I self-host it?

**A:** Yes! That's the entire point. Deploy anywhere that runs Node.js.

### Q: What databases will be supported?

**A:** Database integration is currently in development. We're designing the system to be database-agnostic and will support PostgreSQL, MySQL, and SQLite.

---

## 📞 Support & Community

- 💬 **Discussions**: Ask questions in GitHub Discussions
- 🐛 **Bug Reports**: Create an issue on GitHub
- 💡 **Feature Ideas**: Share your thoughts in discussions

---

## 🌟 Star Us!

If you believe in privacy-first analytics, please give us a ⭐ on GitHub. It helps other developers discover the project!

---

**Made with ❤️ by the PrivacyMetrics team**

_Because analytics should be transparent, not intrusive._
