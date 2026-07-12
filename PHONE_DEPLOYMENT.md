# Deploy from an iPhone

## GitHub Pages
1. Create a new GitHub repository.
2. Upload every file and folder from this project ZIP to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. Open the **Actions** tab and wait for “Deploy PWA to GitHub Pages” to complete.
6. Open the resulting Pages URL in Safari.
7. Tap **Share → Add to Home Screen**.

The included workflow installs dependencies, builds the app, and publishes the `dist` folder automatically.

## Quick static-host test
The separate `enter-the-arena-v7-dist.zip` contains only the built site. Upload its contents to Netlify Drop, Cloudflare Pages, or another static host.

The PWA must be served over HTTPS for installation and service-worker caching.
