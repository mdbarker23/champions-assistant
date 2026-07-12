# Enter the Arena V7 — Docker

This package builds the React/Vite application in a Node container and serves the compiled PWA with Nginx.

## Docker Compose

```bash
cp .env.example .env
docker compose up -d --build
```

Open:

```text
http://YOUR-SERVER-IP:8080
```

To use another port, change `CHAMPIONS_PORT` in `.env`.

## Plain Docker

```bash
docker build -t champions-assistant:latest .
docker run -d \
  --name champions-assistant \
  --restart unless-stopped \
  -p 8080:80 \
  champions-assistant:latest
```

## Updating

Replace the project files, then rebuild:

```bash
docker compose up -d --build
```

## Reverse proxy

The container serves plain HTTP on port 80 internally. Put it behind your existing Nginx Proxy Manager, Traefik, Caddy, or Cloudflare Tunnel setup for HTTPS.

The application stores teams in each browser's IndexedDB. Rebuilding or replacing the container does not erase teams saved on a user's phone, provided the site keeps the same protocol, hostname, and port.

## Health check

```text
GET /healthz
```

returns HTTP 200 with `ok`.

## PWA note

Installation and service workers require HTTPS, except when accessed through `localhost`. For phone installation, expose the container through an HTTPS reverse proxy or tunnel.
