export function safeJsonParse(text, fallback = { raw: text }) {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = String(text)
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      return fallback;
    }
  }
}
