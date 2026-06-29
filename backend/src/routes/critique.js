import express from "express";
import { runCritiqueFromBrief } from "../orchestrator/runCritique.js";

const router = express.Router();

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

export default router;
