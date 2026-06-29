// import express from "express";
// import { runFullAnalyze } from "../orchestrator/runCritique.js";
//
// const  router = express.Router();
//
// router.post("/", async (req, res) => {
//   try {
//     const result = await runFullAnalyze(req.body);
//     return res.json(result);
//   } catch (error) {
//     console.error("analyze error:", error);
//
//     return res.status(500).json({
//       error: "Failed to analyze project",
//       message: error?.message || "Unknown error",
//     });
//   }
// });
//
// export default router;
