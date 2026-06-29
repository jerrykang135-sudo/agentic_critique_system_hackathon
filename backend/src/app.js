import express from "express";
import cors from "cors";
import briefRouter from "./routes/brief.js";
import critiqueRouter from "./routes/critique.js";

const app = express();

app.use(cors());
// app.use(cors({
//   origin: "http://localhost:5173"
// }));
// app.use(express.json());
// app.use(express.json({ limit: "2mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.get("/healthcheck", (req, res) => {
  console.log(process.env.GEMINI_MODEL_ID);
  res.json({ status: "ok" });
});

// app.use("/analyze", analyzeRouter);
app.use("/brief", briefRouter);
app.use("/critique", critiqueRouter);

export default app;
