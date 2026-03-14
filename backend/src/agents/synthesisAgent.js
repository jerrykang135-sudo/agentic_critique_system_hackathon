import { callNova } from "../bedrock/converse.js";
import { synthesisAgentSystemPrompt } from "../prompts/synthesisPrompt.js";

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

  const text = await callNova({
    systemPrompt: synthesisAgentSystemPrompt,
    contentBlocks: [
      { text: promptText }
    ],
    maxTokens: 900,
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
