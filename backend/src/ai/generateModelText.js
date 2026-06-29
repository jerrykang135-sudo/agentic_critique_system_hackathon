import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { buildAiSdkContent } from "./messageContent.js";

const DEFAULT_MODEL = "gemini-2.5-flash";

export async function generateModelText({
  systemPrompt,
  contentBlocks,
  temperature = 0.4,
  maxTokens = 800,
}) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is required to call Gemini.");
  }

  if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
    throw new Error("generateModelText requires contentBlocks to be a non-empty array.");
  }

  const modelId = process.env.GEMINI_MODEL_ID || DEFAULT_MODEL;
  const { text } = await generateText({
    model: google(modelId),
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: buildAiSdkContent(contentBlocks),
      },
    ],
    temperature,
    maxOutputTokens: maxTokens,
  });

  return text;
}
