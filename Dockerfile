# syntax=docker/dockerfile:1.7

FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app

ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG VCS_REF="unknown"
ARG BUILD_DATE="unknown"
ARG VERSION="dev"

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

ARG VCS_REF="unknown"
ARG BUILD_DATE="unknown"
ARG VERSION="dev"

LABEL org.opencontainers.image.title="Enter the Arena" \
      org.opencontainers.image.description="Self-hosted Pokémon Champions team-preview assistant" \
      org.opencontainers.image.source="https://github.com/mdbarker23/champions-assistant" \
      org.opencontainers.image.revision=$VCS_REF \
      org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.licenses="UNLICENSED"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
