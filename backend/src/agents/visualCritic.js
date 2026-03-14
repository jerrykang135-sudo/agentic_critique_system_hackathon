import { callNova } from "../bedrock/converse.js";
import { visualCriticSystemPrompt } from "../prompts/visualCriticPrompt.js";
import { buildContentBlocks } from "../utils/buildContentBlocks.js";

export async function runVisualCritic(projectBrief, normalizedInput) {
  const promptText = `
Project brief:
${JSON.stringify(projectBrief, null, 2)}

Evaluate this project from a visual communication perspective.
Use both the structured brief and any attached images if available.

Return valid JSON only.
`;

  const contentBlocks = buildContentBlocks({
    text: promptText,
    images: normalizedInput.images,
  });

  const text = await callNova({
    systemPrompt: visualCriticSystemPrompt,
    contentBlocks,
    maxTokens: 700,
  });

  return safeJsonParse(text, { raw: text });
}

function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      return fallback;
    }
  }
}
