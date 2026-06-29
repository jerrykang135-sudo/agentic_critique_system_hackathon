export function buildAiSdkContent(contentBlocks) {
  return contentBlocks.map((block) => {
    if (block.text) {
      return {
        type: "text",
        text: block.text,
      };
    }

    if (block.image?.source?.bytes) {
      return {
        type: "image",
        image: block.image.source.bytes,
        mediaType: toMediaType(block.image.format),
      };
    }

    throw new Error("Unsupported content block.");
  });
}

function toMediaType(format) {
  const normalized = String(format || "png").toLowerCase();

  if (normalized === "jpg") {
    return "image/jpeg";
  }

  return `image/${normalized}`;
}
