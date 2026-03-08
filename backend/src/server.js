import "dotenv/config";
import app from "./app.js";

const port = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
