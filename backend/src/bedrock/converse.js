import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrockClient } from "./client.js";

export async function callNova({
                                 systemPrompt,
                                 contentBlocks,
                                 temperature = 0.4,
                                 maxTokens = 800,
                               }) {
  const modelId = process.env.BEDROCK_MODEL_ID;

  if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
    throw new Error("callNova requires contentBlocks to be a non-empty array");
  }

  const command = new ConverseCommand({
    modelId,
    system: systemPrompt ? [{ text: systemPrompt }] : undefined,
    messages: [
      {
        role: "user",
        content: contentBlocks,
      },
    ],
    inferenceConfig: {
      temperature,
      maxTokens,
      topP: 0.9,
    },
  });

  const response = await bedrockClient.send(command);

  return response.output?.message?.content?.[0]?.text ?? "";
}
