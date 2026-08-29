import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const firebaseEnvKeys = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
  ];

  return {
    plugins: [react({ include: /\.[jt]sx?$/ })],
    define: Object.fromEntries(
      firebaseEnvKeys.map((key) => {
        const legacyKey = key.replace("VITE_", "REACT_APP_");
        return [`process.env.${key}`, JSON.stringify(env[key] || env[legacyKey])];
      }),
    ),
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.js$/,
      exclude: [],
    },
    optimizeDeps: {
      entries: ["index.html"],
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
  };
});
