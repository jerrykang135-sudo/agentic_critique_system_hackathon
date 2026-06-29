export function normalizeInput(body) {
  const normalized = {
    projectTitle: "",
    text: "",
    images: [],
    projectType: "unspecified",
  };

  if (typeof body.projectTitle === "string") {
    normalized.projectTitle = body.projectTitle.trim();
  }

  if (typeof body.description === "string") {
    normalized.text = body.description.trim();
  }

  if (!normalized.text && typeof body.projectDescription === "string") {
    normalized.text = body.projectDescription.trim();
  }

  if (typeof body.projectType === "string" && body.projectType.trim()) {
    normalized.projectType = body.projectType.trim();
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
