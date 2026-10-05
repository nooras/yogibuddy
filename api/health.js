import { getHuggingFaceHealth } from "../server/huggingface.js";

export default function handler(_request, response) {
  const result = getHuggingFaceHealth();
  return response.status(result.status).json(result.body);
}
