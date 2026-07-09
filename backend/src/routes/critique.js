import express from "express";
import { runCriticFollowUp } from "../agents/followUpCritic.js";
import { runCritiqueFromBrief } from "../orchestrator/runCritique.js";
import { isSupportedCritic } from "../prompts/followUpPrompts.js";

const router = express.Router();
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_HISTORY_MESSAGES = 8;

router.post("/", async (req, res) => {
  try {
    if (!req.body?.brief) {
      return res.status(400).json({
        error: "Missing brief",
        message: "A structured brief is required before running critique.",
      });
    }

    const result = await runCritiqueFromBrief(
      req.body.brief,
      req.body.originalInput || req.body
    );

    return res.json({
      status: "review_ready",
      ...result,
    });
  } catch (error) {
    console.error("critique error:", error);

    return res.status(500).json({
      error: "Failed to critique project",
      message: error?.message || "Unknown error",
    });
  }
});

router.post("/:agentId/follow-up", async (req, res) => {
  const { agentId } = req.params;
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  const messages = normalizeConversation(req.body?.messages);

  if (!isSupportedCritic(agentId)) {
    return res.status(400).json({
      error: "Unsupported critic",
      message: "The requested critic is not available for follow-up questions.",
    });
  }

  if (!isPlainObject(req.body?.brief) || !isPlainObject(req.body?.critique)) {
    return res.status(400).json({
      error: "Missing critique context",
      message: "A project brief and the critic's initial response are required.",
    });
  }

  if (!question || question.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: "Invalid question",
      message: `Questions must contain between 1 and ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  try {
    const answer = await runCriticFollowUp({
      agentId,
      projectBrief: req.body.brief,
      critique: req.body.critique,
      originalInput: req.body.originalInput,
      messages,
      question,
    });

    return res.json({ answer: answer.trim() });
  } catch (error) {
    console.error("critic follow-up error:", error);

    if (error?.statusCode === 429 || error?.statusCode === 503) {
      return res.status(503).json({
        error: "Critique service temporarily unavailable",
        message: "The AI service is busy. Please try your question again in a moment.",
      });
    }

    return res.status(500).json({
      error: "Failed to answer follow-up question",
      message: "The critic could not answer that question. Please try again.",
    });
  }
});

function normalizeConversation(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message) =>
        (message?.role === "user" || message?.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim()
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export default router;
