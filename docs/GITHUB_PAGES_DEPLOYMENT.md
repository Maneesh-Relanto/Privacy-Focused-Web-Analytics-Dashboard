# GitHub Pages Deployment Guide

**[← Back to README](../README.md)** | **[Documentation Index](./INDEX.md)** | **[Code Quality](./CODE_QUALITY_SCANNING_GUIDE.md)** | **[Developer Guide](./DEVELOPER_GUIDE.md)**

## Overview

Your landing page is now configured to automatically deploy to GitHub Pages at:
**https://maneesh-relanto.github.io/Privacy-Focused-Web-Analytics-Dashboard/**

## How It Works

### Automated Deployment

1. **GitHub Actions Workflow** - A workflow file (`.github/workflows/deploy-gh-pages.yml`) is configured to automatically:
   - Build the client when you push to the `main` branch
   - Deploy the built files to the `gh-pages` branch
   - Update your GitHub Pages site

2. **Zero Manual Steps** - Simply push your changes to main:
   ```bash
   git push origin main
   ```

### Configuration

The following files configure the GitHub Pages deployment:

1. **`config/vite.config.ts`** - Sets the base path for production builds:

   ```typescript
   base: process.env.NODE_ENV === "production"
     ? "/Privacy-Focused-Web-Analytics-Dashboard/"
     : "/";
   ```

2. **`client/App.tsx`** - Configures React Router basename:

   ```typescript
   const basename = import.meta.env.PROD ? "/Privacy-Focused-Web-Analytics-Dashboard/" : "/";
   <BrowserRouter basename={basename}>
   ```

3. **`.github/workflows/deploy-gh-pages.yml`** - GitHub Actions workflow that handles:
   - Installing dependencies
   - Building the client
   - Deploying to GitHub Pages

4. **`dist/spa/.nojekyll`** - Prevents GitHub Pages from processing Jekyll

## Manual Deployment

If you need to manually deploy (not recommended), you can:

```bash
pnpm run build:client
```

This builds the client into `dist/spa/` with the correct base path configured.

## Verifying Deployment

1. Navigate to https://maneesh-relanto.github.io/Privacy-Focused-Web-Analytics-Dashboard/
2. Check the "Actions" tab in your GitHub repository to see workflow status
3. If deployment fails, check the workflow logs for error details

## Troubleshooting

### Pages not updating after push

- Wait 1-2 minutes for GitHub Actions to complete
- Check the Actions tab to see if the workflow succeeded
- Clear browser cache or open in incognito/private mode

### Assets returning 404

- Ensure the base path configuration is correct in both vite.config.ts and App.tsx
- Verify .nojekyll file exists in dist/spa/

### Navigation not working

- Ensure React Router basename is set correctly for production
- Check that all routes use relative paths, not absolute paths

## Environment Variables

The deployment uses the `GITHUB_TOKEN` secret (automatically available in GitHub Actions) for authentication.

## Important Notes

- The `gh-pages` branch is automatically created and managed by the GitHub Actions workflow
- Only the landing page (static HTML/CSS/JS) is deployed to GitHub Pages
- The backend API is not deployed to GitHub Pages (it would require a separate server)
- Landing page routes are handled by React Router with the correct basename
