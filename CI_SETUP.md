# CI/CD Setup

This project has automated continuous integration (CI) checks set up using GitHub Actions.

## What Gets Checked

Every push and pull request to `main`, `master`, or `develop` branches automatically runs:

1. **ESLint** - Code linting to catch potential issues
2. **TypeScript** - Type checking to ensure type safety
3. **Build** - Full Next.js production build

## GitHub Actions Workflow

The CI workflow is defined in `.github/workflows/ci.yml` and consists of two jobs:

### 1. Lint and Type Check
- Runs ESLint to check code quality
- Runs TypeScript compiler in check mode
- Must pass before build job runs

### 2. Build
- Generates Prisma Client
- Builds the Next.js application
- Ensures the app can be deployed

## Running Checks Locally

Before pushing your code, you can run the same checks locally:

```bash
# Run all checks (lint + type-check)
npm run check

# Run only linting
npm run lint

# Auto-fix linting issues where possible
npm run lint:fix

# Run only type checking
npm run type-check

# Run full build (includes Prisma generation)
npm run build
```

## Pre-Push Checklist

Before pushing code, make sure:

1. ✅ `npm run check` passes without errors
2. ✅ `npm run build` completes successfully
3. ✅ All new code follows the existing code style
4. ✅ No console errors or warnings

## Common Issues

### Linting Errors

If you see ESLint errors:
1. Try running `npm run lint:fix` to auto-fix simple issues
2. For React-specific warnings (like unescaped entities), use `&apos;` instead of `'`
3. For unused variables that are intentional, add `// eslint-disable-next-line` comment

### Type Errors

If you see TypeScript errors:
1. Make sure all variables have explicit types
2. Use Prisma types from `@prisma/client` for database models
3. Run `npm run prisma:generate` if Prisma types are missing

### Build Failures

If the build fails:
1. Check that `DATABASE_URL` is set (can be dummy URL for build)
2. Ensure all dependencies are installed (`npm install`)
3. Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## Workflow Badge

You can add a status badge to your README:

```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name.

