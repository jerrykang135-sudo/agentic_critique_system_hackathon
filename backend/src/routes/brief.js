import express from "express";
import { clarifyBrief, interpretBrief } from "../orchestrator/runBrief.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const result = await interpretBrief(req.body);
    return res.json(result);
  } catch (error) {
    console.error("brief error:", error);

    return res.status(500).json({
      error: "Failed to interpret project brief",
      message: error?.message || "Unknown error",
    });
  }
});

router.post("/clarify", async (req, res) => {
  try {
    const result = await clarifyBrief(req.body);
    return res.json(result);
  } catch (error) {
    console.error("brief clarification error:", error);

    return res.status(500).json({
      error: "Failed to clarify project brief",
      message: error?.message || "Unknown error",
    });
  }
});

export default router;
