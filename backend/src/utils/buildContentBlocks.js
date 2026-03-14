export function buildContentBlocks({ text, images = [] }) {
  const blocks = [];

  if (text && text.trim()) {
    blocks.push({ text: text.trim() });
  }

  for (const image of images) {
    blocks.push({
      image: {
        format: image.format,
        source: {
          bytes: image.bytes,
        },
      },
    });
  }

  return blocks;
}
