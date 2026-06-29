import { generateModelText } from "../ai/generateModelText.js";
import { BRIEF_INTERPRETER_PROMPT } from "../prompts/briefInterPreterPrompt.js";
import { buildContentBlocks } from "../utils/buildContentBlocks.js";
import { safeJsonParse } from "../utils/safeJsonParse.js";

export async function runProjectInterpreter(normalizedInput, options = {}) {
  const clarificationText = options.clarificationAnswer
    ? `
Clarifying question:
${options.clarifyingQuestion || "Not provided"}

Student clarification:
${options.clarificationAnswer}
`
    : "";

  const forceBriefInstruction = options.forceBrief
    ? `
IMPORTANT: The student has already answered your clarification question. Do NOT ask for clarification again. You MUST return a structured brief now.
`
    : "";

  const textPart = `
Student project input:
- Project title: ${normalizedInput.projectTitle || "Not provided"}
- Project type: ${normalizedInput.projectType}
- Description:
${normalizedInput.text || "No text provided"}

${clarificationText}
${forceBriefInstruction}
`;

  const contentBlocks = buildContentBlocks({
    text: textPart,
    images: normalizedInput.images,
  });

  const text = await generateModelText({
    systemPrompt: BRIEF_INTERPRETER_PROMPT,
    contentBlocks,
    maxTokens: 700,
  });

  return safeJsonParse(text, { raw: text });
}
