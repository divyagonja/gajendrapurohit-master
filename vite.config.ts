import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Map legacy REACT_APP_ variables to VITE_ format
  const processEnv: Record<string, string> = {};
  
  // Add all existing VITE_ variables
  Object.keys(env).forEach(key => {
    if (key.startsWith('VITE_')) {
      processEnv[key] = env[key];
    }
  });
  
  // Map REACT_APP_ variables to VITE_ format if not already defined
  Object.keys(env).forEach(key => {
    if (key.startsWith('REACT_APP_')) {
      const viteKey = `VITE_${key.slice(10)}`;
      if (!processEnv[viteKey]) {
        processEnv[viteKey] = env[key];
      }
    }
  });

  return {
    define: {
      // Make mapped env variables available to the app
      'import.meta.env': processEnv
    },
    server: {
      host: "::",
      port: 8080,
      cors: true,
      proxy: {
        // Proxy Google Drive API requests to bypass CORS
        '/google-drive-api': {
          target: 'https://www.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/google-drive-api/, ''),
          secure: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
