import { generateModelText } from "../ai/generateModelText.js";
import { ALEX_PROMPT } from "../prompts/alexPrompt.js";
import { buildContentBlocks } from "../utils/buildContentBlocks.js";
import { safeJsonParse } from "../utils/safeJsonParse.js";

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

  const text = await generateModelText({
    systemPrompt: ALEX_PROMPT,
    contentBlocks,
    maxTokens: 700,
  });

  return safeJsonParse(text, { raw: text });
}
