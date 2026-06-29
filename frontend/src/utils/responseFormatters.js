export function normalizeText(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value == null || value === "") {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function normalizeKey(key) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function pickField(record, candidates) {
  if (!record || typeof record !== "object") {
    return "";
  }

  for (const candidate of candidates) {
    if (record[candidate] != null) {
      return record[candidate];
    }
  }

  const normalized = Object.entries(record).reduce((acc, [key, value]) => {
    acc[normalizeKey(key)] = value;
    return acc;
  }, {});

  for (const candidate of candidates) {
    const value = normalized[normalizeKey(candidate)];
    if (value != null) {
      return value;
    }
  }

  return "";
}

export function getBrief(result, fallback) {
  const brief = result?.projectBrief || {};

  return {
    projectType:
      pickField(brief, ["projectType", "Project Type"]) ||
      result?.inputSummary?.projectType ||
      fallback.projectType,
    statedGoal:
      pickField(brief, ["statedGoal", "Stated Goal"]) ||
      fallback.title ||
      fallback.description,
    targetUser: pickField(brief, ["targetUser", "Target User"]) || "Not specified",
    constraints:
      pickField(brief, ["keyConstraints", "Key Constraints"]) || "Not specified",
    medium: pickField(brief, ["medium", "Medium", "Medium / Format"]) || "Not specified",
    openQuestions:
      pickField(brief, ["openQuestions", "Open Questions"]) || "No open questions returned.",
  };
}

export function getCritique(result, agentId) {
  return result?.critiques?.[agentId] || {};
}

export function getCritiqueField(critique, label) {
  const candidates = {
    observation: ["observation", "Observation"],
    concern: ["concern", "Concern"],
    suggestion: ["suggestion", "Suggestion"],
    tradeoff: ["tradeoff", "Tradeoff", "Trade-off", "Trade Off"],
    reflectionPrompt: ["reflectionPrompt", "Reflection Prompt"],
  };

  return normalizeText(pickField(critique, candidates[label] || [label]));
}

export function getSynthesisItems(result) {
  const synthesis = result?.synthesis || {};

  if (synthesis.raw) {
    return [["Synthesis", synthesis.raw]];
  }

  return Object.entries(synthesis).map(([key, value]) => [key, normalizeText(value)]);
}
