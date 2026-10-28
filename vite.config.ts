import { fileURLToPath, URL } from "node:url"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react"
          }
          if (id.includes("node_modules/@supabase/")) {
            return "vendor-supabase"
          }
          if (id.includes("node_modules/framer-motion/") || id.includes("node_modules/aos/")) {
            return "vendor-motion"
          }
          if (
            id.includes("node_modules/lucide-react/") ||
            id.includes("node_modules/@tabler/") ||
            id.includes("node_modules/react-icons/")
          ) {
            return "vendor-icons"
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
