# File Organization Strategy

## Overview

The project has been organized to keep the root directory clean while maintaining functionality and proper tool auto-discovery.

## Why Some Config Files Stay at Root

### Auto-Discovery Requirement

Certain tools expect configuration files to be at the project root for auto-discovery:

**PostCSS** (`postcss.config.js`):

- PostCSS runs from the root and automatically discovers `postcss.config.js` at the root level
- It then loads Tailwind plugin from the discovered config
- Moving this to a subfolder breaks the auto-discovery chain

**Tailwind** (`tailwind.config.ts`):

- PostCSS looks for `tailwind.config.ts` in the root directory
- While technically you can specify a path in postcss config, this adds unnecessary complexity
- Keeping it at root ensures reliable auto-discovery by PostCSS

### Files Organized in `/config`

These files are moved to `/config` because they're **explicitly referenced** in commands:

- **vite.config.ts**: Explicitly passed via `--config config/vite.config.ts` in npm scripts
- **vite.config.server.ts**: Explicitly passed via `--config config/vite.config.server.ts` in npm scripts

### Files Remaining at Root

These must stay at root for proper tool integration:

- **tailwind.config.ts**: Auto-discovered by PostCSS
- **postcss.config.js**: Auto-discovered by build tools and Vite
- **components.json**: Shadcn/ui component generator expects it at root
- **netlify.toml**: Netlify reads this from root during deployment

## Updated npm Scripts

```json
{
  "dev": "vite --config config/vite.config.ts",
  "build:client": "vite build --config config/vite.config.ts",
  "build:server": "vite build --config config/vite.config.server.ts"
}
```

By explicitly specifying the config file path, we can keep Vite configs organized in `/config` while allowing PostCSS and Tailwind to remain at the root where they're auto-discovered.

## File Count Reduction

### Root Directory Files (kept minimal)

- Configuration files that require auto-discovery: 4 files
  - `tailwind.config.ts`
  - `postcss.config.js`
  - `components.json`
  - `netlify.toml`
- Build/setup files: 3 files
  - `package.json`
  - `pnpm-lock.yaml`
  - `tsconfig.json`
- Entry point: 1 file
  - `index.html`
- Standard files: Various
  - `.env`, `.gitignore`, `.npmrc`, `.prettierrc`, etc.

### `/config` Directory

- Build config files: 2 files
  - `vite.config.ts`
  - `vite.config.server.ts`

### Result

Root directory is significantly cleaner with core build configs organized in `/config` while maintaining full functionality.

## Best Practices Applied

1. **Separation of Concerns**: Build configs in `/config`, tools that auto-discover at root
2. **Explicit Over Implicit**: Using `--config` flag makes dependencies clear
3. **Minimal Root**: Only essential files in project root
4. **Tool Compatibility**: Respecting auto-discovery requirements of build tools
5. **Documentation**: Clear explanation of why files are where they are

## Future Expansion

If the project grows and more Vite plugins are added:

- Keep additional build configs in `/config`
- Create feature-specific sub-configs if needed (e.g., `/config/vite/`)
- Continue using explicit `--config` paths in npm scripts

## Troubleshooting

If Tailwind CSS styles aren't loading:

1. Verify `tailwind.config.ts` is in the root directory
2. Verify `postcss.config.js` is in the root directory
3. Check that `content` path in `tailwind.config.ts` correctly points to client files: `["./client/**/*.{ts,tsx}"]`
4. Restart the dev server: `pnpm dev`

If Shadcn/ui components can't be added:

1. Verify `components.json` is in the root directory
2. Verify paths in `components.json` point to correct locations
