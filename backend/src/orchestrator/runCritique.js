import { normalizeInput } from "../utils/normalizeInput.js";
import { runProjectInterpreter } from "../agents/projectInterpreter.js";
import { runIndustrialCritic } from "../agents/industrialCritic.js";
import { runServiceCritic } from "../agents/serviceCritic.js";
import { runVisualCritic } from "../agents/visualCritic.js";
// import { runReflectionAgent } from "../agents/reflectionAgent.js";
import { runSynthesisAgent } from "../agents/synthesisAgent.js";

export async function runCritiquePipeline(rawInput) {
  const normalizedInput = normalizeInput(rawInput);

  const projectBrief = await runProjectInterpreter(normalizedInput);

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

  // const reflection = await runReflectionAgent(projectBrief, critiques);
  const synthesis = await runSynthesisAgent(projectBrief, critiques);

  return {
    inputSummary: {
      hasText: Boolean(normalizedInput.text),
      imageCount: normalizedInput.images.length,
      projectType: normalizedInput.projectType,
    },
    projectBrief,
    critiques,
    // reflection,
    synthesis,
  };
}
