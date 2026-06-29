export function fileToData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const preview = typeof reader.result === "string" ? reader.result : "";
      const base64 = preview.includes(",") ? preview.split(",")[1] : preview;
      const mime = file.type || "";
      const format = mime.split("/")[1] || file.name.split(".").pop() || "png";

      resolve({
        name: file.name,
        format: format.toLowerCase(),
        base64,
        preview,
      });
    };

    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

/*
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));

    reader.readAsDataURL(file);
  });
}

export async function fileToData(file) {
  const preview = await readFileAsDataUrl(file);

  const base64 = preview.includes(",") ? preview.split(",")[1] : preview;
  const mime = file.type || "";
  const format = mime.split("/")[1] || file.name.split(".").pop() || "png";

  return {
    name: file.name,
    format: format.toLowerCase(),
    base64,
    preview,
  };
}
 */
