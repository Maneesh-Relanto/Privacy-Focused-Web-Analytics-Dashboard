# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in the Privacy-Focused Web Analytics Dashboard, please email [security contact] instead of using the issue tracker.

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

We will acknowledge receipt within 48 hours and provide a status update within 7 days.

## Supported Versions

| Version | Status | Security Updates |
|---------|--------|-------------------|
| 1.0.0+  | ✅ Supported | Active |
| < 1.0.0 | ❌ Unsupported | No |

## Security Measures

### Authentication & Authorization
- **JWT (JSON Web Tokens)** for stateless authentication
- **bcryptjs** for password hashing with salt rounds
- **CORS** protection for cross-origin requests
- **Middleware** for route protection

### Data Protection
- **Prisma ORM** to prevent SQL injection
- **Input validation** on all API endpoints
- **Environment variables** for sensitive configuration
- **HTTPS** enforcement (configured for production)

### Privacy Features
- **Minimal data collection** - only essential metrics
- **User anonymization** - no PII stored for visitors
- **No third-party tracking** - self-hosted analytics
- **Data deletion** - users can remove their data
- **Transparent logging** - audit trails for all actions

### Code Quality
- **TypeScript strict mode** for type safety
- **SonarQube scanning** for code quality
- **Dependency audits** via `pnpm audit`
- **Regular security updates** for dependencies

## Known Vulnerabilities

### Current Status
- **Dependency Vulnerabilities:** 4 (2 high, 2 moderate)
- **Code Vulnerabilities:** 0 (SonarQube: A security rating)

### Active Issues
1. **qs (DoS risk)** - Indirect via express
   - Status: Waiting for upstream fix
   - Workaround: Limit request body size in Express config

2. **glob (Command Injection)** - Indirect via tailwindcss
   - Status: Low risk (dev dependency only)
   - Workaround: None needed (not used at runtime)

3. **lodash (Prototype Pollution)** - Indirect via recharts
   - Status: Low risk (not exposed to user input)
   - Workaround: Avoid using lodash `_.unset()` and `_.omit()`

### Remediation Timeline
- ✅ Vite updated to 7.3.1 (HIGH fixed)
- ✅ React Router updated to 7.13.0 (HIGH fixed)
- ⏳ qs update pending (waiting for express compatibility)
- ⏳ glob update pending (waiting for toolchain updates)

## Security Best Practices for Users

### For Self-Hosted Deployments
1. Use HTTPS with valid SSL certificates
2. Keep Node.js and dependencies updated
3. Use strong, unique JWT secrets
4. Implement rate limiting
5. Monitor logs for suspicious activity
6. Backup your database regularly
7. Use environment variables for secrets

### For Public Instances
1. Never share user authentication tokens
2. Use strong passwords
3. Enable two-factor authentication where available
4. Report suspicious activity
5. Review your website's tracking settings regularly

## Incident Response

If a vulnerability is confirmed:
1. We will develop a fix immediately
2. A patched version will be released ASAP
3. Users will be notified via GitHub Security Advisory
4. Documentation will be updated
5. A post-mortem analysis will be conducted

## Security Testing

We perform regular security testing including:
- ✅ Static code analysis (SonarQube)
- ✅ Dependency vulnerability scanning (npm audit)
- ✅ Manual security code review
- ⏳ Planned: Dynamic application security testing (DAST)
- ⏳ Planned: Penetration testing

## Compliance

This project aims to comply with:
- **OWASP Top 10** security guidelines
- **CWE (Common Weakness Enumeration)** best practices
- **GDPR** for data privacy (when applicable)
- **HIPAA** considerations for sensitive data

## Contact

- **Security Issues:** [security-email]
- **GitHub Issues:** For non-security bugs
- **Discussions:** For general questions

---

**Last Updated:** February 4, 2026
**Next Review:** February 18, 2026
