# Enter the Arena V8 — GitHub Container Registry

This version is designed for:

```text
GitHub repository
      ↓
GitHub Actions
      ↓
Multi-architecture Docker image
      ↓
GitHub Container Registry
      ↓
Unraid / Docker Compose / Portainer
```

## 1. Upload the project

Extract the ZIP and upload its **contents** to the root of:

```text
https://github.com/mdbarker23/champions-assistant
```

The repository root must contain `Dockerfile`, `package.json`, `src/`, `public/`, and `.github/`.

The `.github` directory is hidden on some mobile file browsers. If your upload tool omits it, create this file manually in GitHub's web editor:

```text
.github/workflows/container.yml
```

Then paste in the workflow included with this project.

## 2. Publish the image

Push or commit the files to the `main` branch. Open the repository's **Actions** tab and select:

```text
Build and publish container
```

After it completes, the image will be:

```text
ghcr.io/mdbarker23/champions-assistant:latest
```

GitHub will publish both:

- `linux/amd64`
- `linux/arm64`

## 3. Make the package public

The first GHCR package may be private.

In GitHub:

1. Open your profile.
2. Open **Packages**.
3. Select `champions-assistant`.
4. Open **Package settings**.
5. Change visibility to **Public**.

Private packages instead require a GitHub personal access token on the Docker host.

## 4. Deploy with Docker Compose

```bash
cp .env.example .env
docker compose pull
docker compose up -d
```

Open:

```text
http://YOUR-SERVER-IP:8080
```

## 5. Update

```bash
docker compose pull
docker compose up -d
docker image prune -f
```

## Local build

```bash
docker compose -f docker-compose.build.yml up -d --build
```

## Unraid

Use:

```text
Repository:
ghcr.io/mdbarker23/champions-assistant:latest

Container port:
80

Host port:
8080
```

No persistent container volume is necessary. Saved teams live in each browser's IndexedDB. Keep the same URL to preserve them.

## HTTPS and phone installation

Place the container behind Nginx Proxy Manager, Caddy, Traefik, or Cloudflare Tunnel. PWA installation and service workers require HTTPS except on localhost.
