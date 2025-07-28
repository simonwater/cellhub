import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  return {
    plugins: [react()],
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.REACT·_APP_DATA_PROVIDER": JSON.stringify(
        process.env.REACT_APP_DATA_PROVIDER
      ),
    },
    server: {
      port: 8000,
      open: true,
    },
    base: "./",
    esbuild: {
      keepNames: true,
    },
    build: {
      sourcemap: true,
    },
    resolve: {
      preserveSymlinks: true,
      alias: [
        {
          find: "@src",
          replacement: path.resolve(__dirname, "./src"),
        },
        // The 2 next aliases are needed to avoid having multiple MUI instances
        {
          find: "@mui/material",
          replacement: path.resolve(__dirname, "node_modules/@mui/material"),
        },
        {
          find: "@mui/icons-material",
          replacement: path.resolve(
            __dirname,
            "node_modules/@mui/icons-material"
          ),
        },
      ],
    },
  };
});
