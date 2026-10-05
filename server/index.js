import "dotenv/config";
import express from "express";
import cors from "cors";
import { getOllamaHealth, replyToChat } from "./ollama.js";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors({ origin: process.env.APP_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "32kb" }));
app.all("/api/chat", (req, res, next) => {
  if (req.method === "POST") return next();
  return res.status(405).json({ error: "The chat endpoint accepts POST requests from the app." });
});
app.post("/api/chat", async (req, res) => {
  const result = await replyToChat(req.body);
  return res.status(result.status).json(result.body);
});
app.get("/api/health", async (_req, res) => {
  const result = await getOllamaHealth();
  return res.status(result.status).json(result.body);
});
app.use((error, _req, res, _next) => {
  console.error("Chat API request failed:", error.message);
  if (res.headersSent) return;
  const status = error.type === "entity.too.large" ? 413 : error.type === "entity.parse.failed" ? 400 : 500;
  return res.status(status).json({ error: status === 500 ? "The chat service had an unexpected error. Please try again." : error.message });
});

app.listen(port, () => console.log(`Yogi Buddy API listening on http://localhost:${port}`));
