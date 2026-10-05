import "dotenv/config";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { getOllamaHealth, replyToChat } from "./ollama.js";
import { getHuggingFaceHealth, replyWithHuggingFace } from "./huggingface.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const useHuggingFace = process.env.CHAT_PROVIDER === "huggingface";
const chatHealth = useHuggingFace ? getHuggingFaceHealth : getOllamaHealth;
const sendChatReply = useHuggingFace ? replyWithHuggingFace : replyToChat;
const requestWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 30;
const requestsByIp = new Map();

app.use(cors({ origin: process.env.APP_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "32kb" }));
app.use("/api/chat", (req, res, next) => {
  if (req.method !== "POST") return next();
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = typeof forwardedFor === "string"
    ? forwardedFor.split(",")[0].trim()
    : req.ip || "unknown";
  const now = Date.now();
  const recentRequests = (requestsByIp.get(ip) || []).filter((timestamp) => now - timestamp < requestWindowMs);
  if (recentRequests.length >= maxRequestsPerWindow) {
    requestsByIp.set(ip, recentRequests);
    return res.status(429).json({ error: "Too many chat messages. Please wait a few minutes before trying again." });
  }
  recentRequests.push(now);
  requestsByIp.set(ip, recentRequests);
  if (requestsByIp.size > 5000) {
    for (const [key, timestamps] of requestsByIp) {
      if (!timestamps.some((timestamp) => now - timestamp < requestWindowMs)) requestsByIp.delete(key);
    }
    while (requestsByIp.size > 5000) requestsByIp.delete(requestsByIp.keys().next().value);
  }
  return next();
});
app.all("/api/chat", (req, res, next) => {
  if (req.method === "POST") return next();
  return res.status(405).json({ error: "The chat endpoint accepts POST requests from the app." });
});
app.post("/api/chat", async (req, res) => {
  const result = await sendChatReply(req.body);
  return res.status(result.status).json(result.body);
});
app.get("/api/health", async (_req, res) => {
  const result = await chatHealth();
  return res.status(result.status).json(result.body);
});
app.use((error, _req, res, _next) => {
  console.error("Chat API request failed:", error.message);
  if (res.headersSent) return;
  const status = error.type === "entity.too.large" ? 413 : error.type === "entity.parse.failed" ? 400 : 500;
  return res.status(status).json({ error: status === 500 ? "The chat service had an unexpected error. Please try again." : error.message });
});

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(rootDirectory, "../dist");
const indexFile = path.join(distDirectory, "index.html");
if (existsSync(indexFile)) {
  app.use(express.static(distDirectory));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "API endpoint not found." });
    }
    return res.sendFile(indexFile, (error) => {
      if (error) next(error);
    });
  });
}

app.listen(port, () => console.log(`Yogi Buddy API listening on http://localhost:${port}`));
