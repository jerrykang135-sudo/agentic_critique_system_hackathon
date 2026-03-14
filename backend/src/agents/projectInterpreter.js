import { callNova } from "../bedrock/converse.js";
import { projectInterpreterSystemPrompt } from "../prompts/projectInterpreterPromt.js";
import { buildContentBlocks } from "../utils/buildContentBlocks.js";

export async function runProjectInterpreter(normalizedInput) {
  const textPart = `
Student project input:
- Project type: ${normalizedInput.projectType}
- Goals: ${normalizedInput.goals.join(", ") || "none provided"}
- Description:
${normalizedInput.text || "No text provided"}

Please interpret the student's submission and return a structured project brief.
Return valid JSON only.
`;

  const contentBlocks = buildContentBlocks({
    text: textPart,
    images: normalizedInput.images,
  });

  const text = await callNova({
    systemPrompt: projectInterpreterSystemPrompt,
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
