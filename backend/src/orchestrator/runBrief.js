import { runProjectInterpreter } from "../agents/projectInterpreter.js";
import { normalizeInput } from "../utils/normalizeInput.js";

export async function interpretBrief(rawInput) {
  const normalizedInput = normalizeInput(rawInput);
  const interpretation = await runProjectInterpreter(normalizedInput);

  return formatBriefInterpretation(interpretation);
}

export async function clarifyBrief(rawInput) {
  const normalizedInput = normalizeInput(rawInput.originalInput || rawInput);
  const interpretation = await runProjectInterpreter(normalizedInput, {
    clarifyingQuestion: rawInput.clarifyingQuestion,
    clarificationAnswer: rawInput.clarificationAnswer,
    forceBrief: true,
  });

  return formatBriefInterpretation(interpretation, { forceBrief: true });
}

export function formatBriefInterpretation(interpretation, options = {}) {
  if (interpretation?.needsClarification && !options.forceBrief) {
    return {
      status: "needs_clarification",
      clarifyingQuestion:
        interpretation.clarifyingQuestion ||
        "What is the most important missing context for this project?",
    };
  }

  const briefData = interpretation?.brief || interpretation || {};

  return {
    status: "brief_ready",
    brief: normalizeBrief(briefData),
  };
}

function normalizeBrief(briefData) {
  return {
    projectType: briefData.projectType || "Unknown",
    statedGoal: briefData.statedGoal || "Not explicitly stated.",
    targetUser: briefData.targetUser || "Not specified",
    keyConstraints: normalizeList(briefData.keyConstraints),
    medium: briefData.medium || "Unknown",
    openQuestions: normalizeList(briefData.openQuestions),
  };
}

function normalizeList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [String(value)];
}
