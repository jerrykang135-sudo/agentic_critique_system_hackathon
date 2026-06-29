import { normalizeInput } from "../utils/normalizeInput.js";
import { interpretBrief } from "./runBrief.js";
import { runIndustrialCritic } from "../agents/industrialCritic.js";
import { runServiceCritic } from "../agents/serviceCritic.js";
import { runVisualCritic } from "../agents/visualCritic.js";
// import { runReflectionAgent } from "../agents/reflectionAgent.js";
import { runSynthesisAgent } from "../agents/synthesisAgent.js";

// export async function runCritiquePipeline(rawInput) {
//   return runFullAnalyze(rawInput);
// }

export async function runCritiqueFromBrief(projectBrief, rawInput) {
  const normalizedInput = normalizeInput(rawInput);

  const [industrial, service, visual] = await Promise.all([
    runIndustrialCritic(projectBrief, normalizedInput),
    runServiceCritic(projectBrief, normalizedInput),
    runVisualCritic(projectBrief, normalizedInput),
  ]);

  const critiques = {
    industrial,
    service,
    visual,
  };

  const synthesis = await runSynthesisAgent(projectBrief, critiques);

  return {
    inputSummary: {
      hasText: Boolean(normalizedInput.text),
      imageCount: normalizedInput.images.length,
      projectType: normalizedInput.projectType,
    },
    projectBrief,
    critiques,
    synthesis,
  };
}

// export async function runFullAnalyze(rawInput) {
//   const briefResult = await interpretBrief(rawInput);
//
//   if (briefResult.status === "needs_clarification") {
//     return briefResult;
//   }
//
//   const critiqueResult = await runCritiqueFromBrief(briefResult.brief, rawInput);
//
//   return {
//     status: "review_ready",
//     ...critiqueResult,
//   };
// }
