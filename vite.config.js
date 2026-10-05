import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { getOllamaHealth, replyToChat, writeJson } from "./server/ollama.js";

function localChatApi() {
  return {
    name: "yoga-local-chat-api",
    config(_config, { mode }) {
      Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url || "/", "http://localhost").pathname;
        if (!pathname.startsWith("/api/")) return next();
        try {
          if (pathname === "/api/health" && request.method === "GET") {
            const result = await getOllamaHealth();
            return writeJson(response, result.status, result.body);
          }
          if (pathname === "/api/chat" && request.method !== "POST") {
            return writeJson(response, 405, { error: "The chat endpoint accepts POST requests from the app." });
          }
          if (pathname === "/api/chat" && request.method === "POST") {
            let body = "";
            for await (const chunk of request) {
              body += chunk;
              if (body.length > 32 * 1024) return writeJson(response, 413, { error: "Request body is too large." });
            }
            let payload;
            try {
              payload = JSON.parse(body);
            } catch {
              return writeJson(response, 400, { error: "Request body must be valid JSON." });
            }
            const result = await replyToChat(payload);
            return writeJson(response, result.status, result.body);
          }
          return writeJson(response, 404, { error: "API endpoint not found." });
        } catch (error) {
          console.error("Local chat middleware failed:", error.message);
          return writeJson(response, 500, { error: "The local chat service encountered an unexpected error." });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localChatApi()],
});
