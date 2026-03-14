export function normalizeInput(body) {
  const normalized = {
    text: "",
    images: [],
    projectType: "unspecified",
    goals: [],
  };

  if (typeof body.projectDescription === "string") {
    normalized.text = body.projectDescription.trim();
  }

  if (typeof body.projectType === "string" && body.projectType.trim()) {
    normalized.projectType = body.projectType.trim();
  }

  if (Array.isArray(body.goals)) {
    normalized.goals = body.goals.filter((goal) => typeof goal === "string");
  }

  if (Array.isArray(body.images)) {
    normalized.images = body.images
      .filter((img) => img?.base64 && img?.format)
      .map((img) => ({
        format: img.format.toLowerCase(),
        bytes: Buffer.from(img.base64, "base64"),
      }));
  }

  return normalized;
}
