# Yogi Buddy — Yoga with Me

Yogi Buddy is your friendly, no-login yoga companion. Home and chat are ready right away. Sessions show an illustrated pose with numbered, step-by-step cues and an optional voice guide; voice is muted by default. Progress and preferences stay in browser storage.

## Run locally

Requirements: Node.js 18+, npm, and [Ollama](https://ollama.com/) installed on this computer.

1. Install packages: `npm install`
2. Copy `.env.example` to `.env` if you want to configure a different local Ollama model or URL.
3. Download the default open-source model: `ollama pull qwen2.5:3b`
4. Make sure Ollama is running (`ollama serve` if it is not already running as a service).
5. Start the app and built-in chat API: `npm run dev`
6. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

Vite serves the `/api/chat` and `/api/health` endpoints directly, so no second terminal or `npm run server` is needed during development. Chat calls the local Ollama server; no model API key or paid AI account is needed. Change `OLLAMA_MODEL` in `.env` to another model installed with Ollama. If Ollama or the model is unavailable, chat displays a clearly labelled conservative built-in response.

## Deploy publicly with working chat

The production setup uses Vercel for the frontend and serverless API, with Hugging Face Inference Providers hosting the open chat model. Local development continues to use Ollama.

1. Push this project to `https://github.com/nooras/yogibuddy`.
2. Create a Hugging Face fine-grained access token with **Make calls to Inference Providers** permission at [Hugging Face token settings](https://huggingface.co/settings/tokens).
3. Import `nooras/yogibuddy` into [Vercel](https://vercel.com/new) and deploy with the detected defaults. `vercel.json` configures the Vite build and the 60-second chat function.
4. In Vercel project **Settings → Environment Variables**, add `HF_TOKEN` (the secret token) and `HF_MODEL` (default: `Qwen/Qwen2.5-7B-Instruct:fastest`) for Production. Do not use a `VITE_` prefix for the token. Redeploy after adding the variables.
5. Open the Vercel URL and check `/api/health`; it should report `"status":"ok"` and `"provider":"huggingface"`. The deployment is then publicly accessible at that URL. Add a custom domain in Vercel if desired.

Hugging Face Inference Providers require a token and have usage limits/credits that can change; check the current plan and pricing before sharing the site widely. The chat endpoint also applies a best-effort per-IP request limit. Never commit the token or put it in browser-side environment variables.

Chat text is sent to Hugging Face's hosted inference service in production. The app does not store it, but it is no longer processed only on the user's device. Avoid entering identifying or sensitive health details. Local development chat still uses the Ollama service configured by `OLLAMA_BASE_URL`.

For local builds, run `npm run build` and preview with `npm run preview`. Serve the site over HTTPS for PWA installation and secure browser APIs; chat requires connectivity.

## What's included

- `src/App.jsx`, `src/PoseIllustration.jsx`, and `src/styles.css`: mobile-first home, chat, Explore, Progress, illustrated guided sessions, on-device settings, safety check, and light/dark modes.
- `data/poses.json`: pose instructions and safety notes, plus yoga-style, breathing, meditation, mudra, cleansing, and quick-practice references.
- `data/routines.json`: 17 goal-based routine templates with selectable 5, 10, 20, 30, and 45-minute durations and cautions.
- `agent/system-prompt.md`: Yogi Buddy system prompt.
- `agent/sample-conversations.md`: stress, headache, weight-loss, and family-session examples.
- `server/chat-context.js`: shared validation and yoga reference context for chat providers.
- `server/ollama.js`: validated local Ollama integration for development.
- `server/huggingface.js`, `api/`: hosted open-model chat and health endpoints for Vercel.

## Privacy and safety

No login, email, or phone number is collected. Nickname, theme, and practice totals are stored in this browser only. Clearing browser data removes them. In production, chat content is sent to Hugging Face Inference Providers and is not stored by this app; review Hugging Face's current privacy and retention terms. In local development, chat uses the configured Ollama service.

Yoga guidance is general information, not medical care. Stop for sharp pain or dizziness, use modifications, and consult a qualified clinician for medical concerns, pregnancy-related questions, or serious or persistent symptoms. Routines and contraindications are educational guidance, not a substitute for individualized advice.
