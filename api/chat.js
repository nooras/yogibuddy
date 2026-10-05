import { replyWithHuggingFace } from "../server/huggingface.js";

const requestWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 30;
const requestsByIp = new Map();

function isRateLimited(request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  const ip = typeof forwardedFor === "string"
    ? forwardedFor.split(",")[0].trim()
    : request.headers["x-real-ip"] || "unknown";
  const now = Date.now();
  const recentRequests = (requestsByIp.get(ip) || []).filter((timestamp) => now - timestamp < requestWindowMs);
  if (recentRequests.length >= maxRequestsPerWindow) {
    requestsByIp.set(ip, recentRequests);
    return true;
  }
  recentRequests.push(now);
  requestsByIp.set(ip, recentRequests);
  if (requestsByIp.size > 5000) {
    for (const [key, timestamps] of requestsByIp) {
      if (!timestamps.some((timestamp) => now - timestamp < requestWindowMs)) requestsByIp.delete(key);
    }
    while (requestsByIp.size > 5000) requestsByIp.delete(requestsByIp.keys().next().value);
  }
  return false;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "The chat endpoint accepts POST requests from the app." });
  }
  if (Number(request.headers["content-length"]) > 32 * 1024) {
    return response.status(413).json({ error: "Request body is too large." });
  }
  if (isRateLimited(request)) {
    return response.status(429).json({ error: "Too many chat messages. Please wait a few minutes before trying again." });
  }

  const result = await replyWithHuggingFace(request.body);
  return response.status(result.status).json(result.body);
}
