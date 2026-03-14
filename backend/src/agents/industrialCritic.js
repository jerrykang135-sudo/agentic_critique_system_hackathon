import { callNova } from "../bedrock/converse.js";
import { industrialCriticSystemPrompt } from "../prompts/industrialCriticPrompt.js";
import { buildContentBlocks } from "../utils/buildContentBlocks.js";

export async function runIndustrialCritic(projectBrief, normalizedInput) {
  const promptText = `
Project brief:
${JSON.stringify(projectBrief, null, 2)}

Evaluate this project from an industrial design perspective.
If images are attached, use them as supporting context.

Return valid JSON only.
`;

  const contentBlocks = buildContentBlocks({
    text: promptText,
    images: normalizedInput.images,
  });

  const text = await callNova({
    systemPrompt: industrialCriticSystemPrompt,
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
