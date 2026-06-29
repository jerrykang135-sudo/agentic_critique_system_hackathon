import { generateModelText } from "../ai/generateModelText.js";
import { MIA_PROMPT } from "../prompts/miaPrompt.js";
import { buildContentBlocks } from "../utils/buildContentBlocks.js";
import { safeJsonParse } from "../utils/safeJsonParse.js";

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

  const text = await generateModelText({
    systemPrompt: MIA_PROMPT,
    contentBlocks,
    maxTokens: 700,
  });

  return safeJsonParse(text, { raw: text });
}
