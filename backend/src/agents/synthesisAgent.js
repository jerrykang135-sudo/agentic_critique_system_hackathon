import { generateModelText } from "../ai/generateModelText.js";
import { SYNTHESIS_PROMPT } from "../prompts/synthesisPrompt.js";
import { safeJsonParse } from "../utils/safeJsonParse.js";

export async function runSynthesisAgent(projectBrief, critiques, reflection) {
  const promptText = `
Project brief:
${JSON.stringify(projectBrief, null, 2)}

Critiques:
${JSON.stringify(critiques, null, 2)}

Reflection:
${JSON.stringify(reflection, null, 2)}

Return valid JSON only.
`;

  const text = await generateModelText({
    systemPrompt: SYNTHESIS_PROMPT,
    contentBlocks: [
      { text: promptText }
    ],
    maxTokens: 900,
  });

  return safeJsonParse(text, { raw: text });
}
