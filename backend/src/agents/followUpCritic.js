import { generateModelText } from "../ai/generateModelText.js";
import { FOLLOW_UP_PROMPTS } from "../prompts/followUpPrompts.js";
import { buildContentBlocks } from "../utils/buildContentBlocks.js";
import { normalizeInput } from "../utils/normalizeInput.js";

export async function runCriticFollowUp({
  agentId,
  projectBrief,
  critique,
  originalInput,
  messages,
  question,
}) {
  const normalizedInput = normalizeInput(originalInput || {});
  const promptText = `
Project brief:
${JSON.stringify(projectBrief, null, 2)}

Your original critique:
${JSON.stringify(critique, null, 2)}

Conversation so far:
${formatConversation(messages)}

Student's latest question:
${question}
`;

  const contentBlocks = buildContentBlocks({
    text: promptText,
    images: normalizedInput.images,
  });

  return generateModelText({
    systemPrompt: FOLLOW_UP_PROMPTS[agentId],
    contentBlocks,
    maxTokens: 500,
  });
}

function formatConversation(messages) {
  if (messages.length === 0) {
    return "No earlier follow-up messages.";
  }

  return messages
    .map((message) => `${message.role === "assistant" ? "Critic" : "Student"}: ${message.content}`)
    .join("\n\n");
}
