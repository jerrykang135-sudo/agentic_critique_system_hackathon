import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
// app.use(cors({
//   origin: "http://localhost:5173"
// }));
app.use(express.json());
// app.use(express.json({ limit: "2mb" }));

app.get("/healthcheck", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/analyze", analyzeRouter);

export default app;
