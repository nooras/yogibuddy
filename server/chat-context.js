import { readFile } from "node:fs/promises";

const systemPrompt = await readFile(new URL("../agent/system-prompt.md", import.meta.url), "utf8");
const poseData = JSON.parse(await readFile(new URL("../data/poses.json", import.meta.url), "utf8"));

export function prepareChat(payload) {
  const { messages, nickname } = payload ?? {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
    return { error: { status: 400, body: { error: "Send between 1 and 30 chat messages." } } };
  }
  const validMessages = messages.every((message) =>
    message && ["user", "assistant"].includes(message.role) &&
    typeof message.content === "string" && message.content.length > 0 && message.content.length <= 4000,
  );
  if (!validMessages || messages[messages.length - 1].role !== "user") {
    return { error: { status: 400, body: { error: "Chat messages must contain valid user and assistant text, ending with a user message." } } };
  }

  const safeNickname = typeof nickname === "string" ? nickname.trim().slice(0, 24) : "";
  const recentUserText = messages.filter((message) => message.role === "user").slice(-4).map((message) => message.content.toLowerCase()).join("\n");
  const relevantPoses = poseData.poses
    .filter((pose) => recentUserText.includes(pose.name.toLowerCase()) || recentUserText.includes(pose.sanskrit.toLowerCase()))
    .slice(0, 3)
    .map((pose) => JSON.stringify({
      name: pose.name,
      Sanskrit: pose.sanskrit,
      steps: pose.steps,
      modifications: pose.modifications,
      contraindications: pose.contraindications,
    }))
    .join("\n");
  const system = [
    systemPrompt,
    safeNickname ? `The user's optional nickname is ${JSON.stringify(safeNickname)}.` : "The user has not shared a nickname.",
    relevantPoses ? `\nUse these exact app pose references when relevant. They take precedence over general model knowledge:\n${relevantPoses}` : "",
  ].filter(Boolean).join("\n\n");
  return {
    messages: [
      { role: "system", content: system },
      ...messages.map(({ role, content }) => ({ role, content })),
    ],
  };
}
