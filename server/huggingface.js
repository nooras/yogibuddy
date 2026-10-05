import { prepareChat } from "./chat-context.js";

const getModel = () => process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct:fastest";
const getToken = () => process.env.HF_TOKEN;
const endpoint = "https://router.huggingface.co/v1/chat/completions";

export function getHuggingFaceHealth() {
  const model = getModel();
  const configured = Boolean(getToken());
  return {
    status: configured ? 200 : 503,
    body: {
      status: configured ? "ok" : "not-configured",
      provider: "huggingface",
      model,
      hint: configured ? undefined : "Hosted chat is not configured yet. Add HF_TOKEN to the deployment environment.",
    },
  };
}

export async function replyWithHuggingFace(payload) {
  const token = getToken();
  if (!token) {
    return {
      status: 503,
      body: { error: "Hosted chat is not configured yet. The site owner must add HF_TOKEN to the deployment environment." },
    };
  }

  const prepared = prepareChat(payload);
  if (prepared.error) return prepared.error;

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: getModel(),
        messages: prepared.messages,
        temperature: 0.5,
        max_tokens: 240,
        stream: false,
      }),
      signal: AbortSignal.timeout(55000),
    });
  } catch (error) {
    console.error("Hugging Face inference request failed:", error.message);
    const message = error.name === "TimeoutError"
      ? "The hosted open model took too long to answer. Please try again."
      : "The hosted open model is temporarily unreachable. Please try again shortly.";
    return { status: 503, body: { error: message } };
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    console.error("Hugging Face returned invalid JSON:", error.message);
    return { status: 502, body: { error: "The hosted model returned an unreadable response. Please try again." } };
  }
  if (!response.ok) {
    const providerError = result.error;
    const detail = typeof providerError === "string"
      ? providerError
      : typeof providerError?.message === "string"
        ? providerError.message
        : JSON.stringify(result);
    console.error(`Hugging Face inference returned ${response.status}: ${detail.slice(0, 300)}`);
    const message = response.status === 401 || response.status === 403
      ? "Hosted chat authentication failed. The site owner needs to check HF_TOKEN permissions."
      : response.status === 429
        ? "The hosted model is busy. Please wait a moment and try again."
        : "The hosted open model is temporarily unavailable. Please try again shortly.";
    return { status: response.status === 429 ? 503 : 502, body: { error: message } };
  }
  const reply = result.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    return { status: 502, body: { error: "The hosted model returned no text. Please try again." } };
  }
  return { status: 200, body: { reply, provider: "huggingface" } };
}
