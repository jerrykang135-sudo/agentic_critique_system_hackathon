import fs from "fs/promises";
import path from "path";

const API_URL = "http://localhost:4000/analyze";

async function fileToBase64Object(filePath) {
  const buffer = await fs.readFile(filePath);

  const ext = path.extname(filePath).replace(".", "").toLowerCase();

  const format = ext === "jpg" ? "jpeg" : ext;

  return {
    format,
    base64: buffer.toString("base64"),
    filename: path.basename(filePath),
  };
}

async function readInputText() {
  const inputPath = path.resolve("test-input/input.txt");
  return fs.readFile(inputPath, "utf8");
}

async function loadImages() {
  const imageFolder = path.resolve("test-assets");

  let files;

  try {
    files = await fs.readdir(imageFolder);
  } catch {
    return [];
  }

  const images = [];

  for (const file of files) {
    const fullPath = path.join(imageFolder, file);

    const ext = path.extname(file).toLowerCase();

    if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
      continue;
    }

    const img = await fileToBase64Object(fullPath);
    images.push(img);
  }

  return images;
}

async function main() {
  try {
    const inputText = await readInputText();

    const images = await loadImages();

    const payload = {
      projectDescription: inputText,
      projectType: "interaction design",
      goals: [
        "receive critique",
        "identify weaknesses",
        "suggest improvements"
      ],
      images,
    };

    console.log("Sending request to local backend...");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    let prettyResponse = responseText;

    try {
      const parsed = JSON.parse(responseText);
      prettyResponse = JSON.stringify(parsed, null, 2);
    } catch {
      // keep raw response text if it isn't valid JSON
    }

    await fs.mkdir("test-output", { recursive: true });

    const timestamp = new Date()
      .toISOString()
      .replace(/:/g, "-");

    const outputFile = `test-output/response-${timestamp}.txt`;

    const outputContent = `
===== TEST REQUEST =====

Project Type: ${payload.projectType}
Goals: ${payload.goals.join(", ")}
Image Count: ${images.length}

===== INPUT TEXT =====

${inputText}

===== RESPONSE =====

${prettyResponse}

`;

    await fs.writeFile(outputFile, outputContent, "utf8");

    console.log(`Response saved to: ${outputFile}`);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

main();
