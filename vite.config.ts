import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["arena-icon.svg"],
      manifest: {
        name: "Enter the Arena",
        short_name: "Arena",
        description: "Pokémon Champions team-preview assistant",
        theme_color: "#05050a",
        background_color: "#05050a",
        display: "standalone",
        orientation: "portrait",
        start_url: "./",
        icons: [
          { src: "arena-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,json}"],
        runtimeCaching: [{
          urlPattern: /^https:\/\/raw\.githubusercontent\.com\//,
          handler: "CacheFirst",
          options: { cacheName: "pokemon-artwork", expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 } }
        }]
      }
    })
  ]
});