// import { callNova } from "../bedrock/converse.js";
// import { reflectionAgentSystemPrompt } from "../prompts/reflectionPrompt.js";
//
// export async function runReflectionAgent(projectBrief, critiques) {
//   const text = await callNova({
//     systemPrompt: reflectionAgentSystemPrompt,
//     userPrompt: `
// Project brief:
// ${JSON.stringify(projectBrief, null, 2)}
//
// Critiques:
// ${JSON.stringify(critiques, null, 2)}
//
// Return JSON only.
// `,
//     maxTokens: 700,
//   });
//
//   return safeJsonParse(text, { raw: text });
// }
//
// function safeJsonParse(text, fallback = null) {
//   try {
//     return JSON.parse(text);
//   } catch {
//     const cleaned = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();
//
//     try {
//       return JSON.parse(cleaned);
//     } catch {
//       return fallback ?? { raw: text };
//     }
//   }
// }
