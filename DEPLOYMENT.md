# GitHub Pages Deployment Guide

This guide explains how to deploy Deboard to GitHub Pages.

## 📋 Prerequisites

- GitHub repository with the Deboard project
- GitHub account with proper permissions
- Node.js and pnpm installed locally (for manual deployment)

## 🚀 Automatic Deployment (Recommended)

The project includes GitHub Actions workflow for automatic deployment.

### Setup Steps

1. **Enable GitHub Pages in Repository Settings**

   - Go to your repository on GitHub
   - Navigate to `Settings` → `Pages`
   - Under "Source", select `GitHub Actions`
   - Save the changes

2. **Configure Repository Settings**

   - The workflow requires the following permissions:
     - `contents: read`
     - `pages: write`
     - `id-token: write`
   - These are already configured in `.github/workflows/deploy.yml`

3. **Push Your Code**

   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

4. **Monitor Deployment**

   - Go to the `Actions` tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow
   - Once completed, your site will be live

5. **Access Your Site**
   - URL: `https://brillianjs.github.io/deboard/`
   - Replace `brillianjs` and `deboard` with your username and repo name

### Workflow Features

- **Automatic Trigger**: Deploys on every push to `main` branch
- **Manual Trigger**: Can be triggered manually from Actions tab
- **Caching**: Uses pnpm cache for faster builds
- **Flexible Installation**: Uses `--no-frozen-lockfile` for compatibility
- **Optimized**: Only builds and deploys when needed

### Important Notes

- The workflow uses `pnpm install --no-frozen-lockfile` to handle lockfile compatibility
- Make sure `pnpm-lock.yaml` is committed to your repository
- The workflow will generate a new lockfile if needed during CI

## 🛠️ Manual Deployment

If you prefer manual deployment or need to deploy from your local machine:

### One-Time Setup

```bash
# Install gh-pages package
pnpm install -D gh-pages
```

### Deploy Command

```bash
# Build and deploy in one command
pnpm deploy
```

This will:

1. Build the project (`pnpm build`)
2. Deploy to `gh-pages` branch
3. Make it available on GitHub Pages

## ⚙️ Configuration

### Base Path

The base path is configured in `vite.config.ts`:

```typescript
export default defineConfig({
  base: "/deboard/", // Change this to your repo name
  // ...
});
```

**Important**: If your repository name is different from "deboard", update this value:

- Repository: `https://github.com/username/my-repo`
- Base path: `base: "/my-repo/"`

### Custom Domain

To use a custom domain:

1. Create `public/CNAME` file:

   ```
   yourdomain.com
   ```

2. Configure DNS:

   - Add A records pointing to GitHub Pages IPs
   - Or add CNAME record pointing to `username.github.io`

3. Enable custom domain in repository Settings → Pages

## 🐛 Troubleshooting

### 404 Errors on Refresh

This happens because GitHub Pages doesn't support client-side routing by default.

**Solution**: The project uses `HashRouter` from React Router, which adds `#` to URLs:

- ✅ Works: `https://username.github.io/deboard/#/proxies`
- ❌ Breaks: `https://username.github.io/deboard/proxies`

The current setup already uses `HashRouter` in `src/components/Root.tsx`.

### Blank Page After Deployment

**Common causes**:

1. **Incorrect base path**
   - Check `vite.config.ts` base path matches your repo name
2. **Build errors**

   - Check GitHub Actions logs for build errors
   - Run `pnpm build` locally to test

3. **Assets not loading**
   - Verify base path includes trailing slash: `/deboard/`
   - Check browser console for 404 errors

### GitHub Actions Workflow Fails

**Permissions error**:

- Go to Settings → Actions → General
- Enable "Read and write permissions"
- Enable "Allow GitHub Actions to create and approve pull requests"

**Pages not enabled**:

- Go to Settings → Pages
- Select "GitHub Actions" as source

## 📝 Files Created

The GitHub Pages setup includes:

```
deboard/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   ├── .nojekyll              # Disable Jekyll processing
│   └── CNAME.example          # Custom domain example
├── vite.config.ts             # Base path configuration
└── package.json               # Deploy script
```

## 🔄 Update Deployment

Every push to `main` branch automatically triggers deployment:

```bash
git add .
git commit -m "Update dashboard"
git push origin main
```

To deploy manually:

```bash
pnpm deploy
```

## 🌐 Multiple Environments

You can set up multiple environments:

### Production (main branch)

- Deploys to: `https://username.github.io/deboard/`
- Triggered by: Push to `main`

### Staging (develop branch)

1. Modify workflow to trigger on `develop` branch
2. Deploy to different path: `base: "/deboard-staging/"`

## 📊 Monitoring

### Check Deployment Status

1. Go to repository → Actions tab
2. Click on latest workflow run
3. View build logs and deployment status

### View Deployment History

1. Go to repository → Deployments
2. See all previous deployments
3. Rollback if needed

## 🎯 Best Practices

1. **Test locally before pushing**

   ```bash
   pnpm build
   pnpm preview
   ```

2. **Use semantic commit messages**

   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve connection issue"
   ```

3. **Review Actions logs**

   - Check for warnings or errors
   - Monitor build times

4. **Keep dependencies updated**
   ```bash
   pnpm update
   ```

## 📞 Support

If you encounter issues:

1. Check GitHub Actions logs
2. Verify repository settings
3. Review this guide
4. Open an issue on GitHub

---

**Note**: First deployment may take 5-10 minutes to become available. Subsequent deployments are faster due to caching.
