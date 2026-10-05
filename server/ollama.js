import { prepareChat } from "./chat-context.js";

const getBaseUrl = () => (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/+$/, "");
const getModel = () => process.env.OLLAMA_MODEL || "qwen2.5:3b";

export async function getOllamaHealth() {
  const baseUrl = getBaseUrl();
  const model = getModel();
  try {
    const response = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) return { status: 503, body: { status: "ollama-unavailable", model } };
    const { models = [] } = await response.json();
    const modelReady = models.some((item) => item.name === model || item.name.startsWith(`${model}:`));
    return {
      status: modelReady ? 200 : 503,
      body: {
        status: modelReady ? "ok" : "model-not-installed",
        provider: "ollama",
        model,
        hint: modelReady ? undefined : `Run "ollama pull ${model}" to enable chat.`,
      },
    };
  } catch {
    return { status: 503, body: { status: "ollama-unavailable", provider: "ollama", model, hint: "Start Ollama to enable chat." } };
  }
}

export async function replyToChat(payload) {
  const baseUrl = getBaseUrl();
  const model = getModel();
  const prepared = prepareChat(payload);
  if (prepared.error) return prepared.error;

  let response;
  try {
    response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: prepared.messages,
        options: { temperature: 0.5, num_predict: 160 },
        keep_alive: "10m",
      }),
      signal: AbortSignal.timeout(120000),
    });
  } catch (error) {
    console.error("Local Ollama request failed:", error.message);
    const message = error.name === "TimeoutError"
      ? "Ollama took too long to answer. Try a smaller local model or wait for it to finish loading."
      : `Local Ollama is unavailable. Start Ollama and run "ollama pull ${model}" to enable AI chat.`;
    return { status: 503, body: { error: message } };
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    console.error("Local Ollama returned invalid JSON:", error.message);
    return { status: 502, body: { error: "Ollama returned an unreadable response. Check the local Ollama service and try again." } };
  }
  if (!response.ok) {
    const detail = typeof result.error === "string" ? result.error : `HTTP ${response.status}`;
    console.error(`Local Ollama returned an error: ${detail}`);
    const modelMissing = /model.*not found|pull model/i.test(detail);
    return {
      status: 502,
      body: {
        error: modelMissing
          ? `The local model "${model}" is not installed. Run "ollama pull ${model}" and try again.`
          : `Ollama error: ${detail}`,
      },
    };
  }
  const reply = result.message?.content?.trim();
  if (!reply) return { status: 502, body: { error: "Ollama returned no text. Please try again." } };
  return { status: 200, body: { reply, provider: "ollama" } };
}

export function writeJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}
