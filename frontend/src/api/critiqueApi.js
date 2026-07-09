import { buildApiUrl } from "../config/api";

export function buildProjectPayload({
  projectTitle,
  description,
  projectType,
  images = [],
}) {
  return {
    projectTitle: projectTitle.trim(),
    description: description.trim(),
    projectType,
    images: images.map(({ format, base64 }) => ({ format, base64 })),
  };
}

export async function interpretBrief(projectInput) {
  return postJson("/brief", projectInput, "Failed to interpret project brief");
}

export async function clarifyBrief({
  originalInput,
  clarifyingQuestion,
  clarificationAnswer,
}) {
  return postJson(
    "/brief/clarify",
    {
      originalInput,
      clarifyingQuestion,
      clarificationAnswer,
    },
    "Failed to clarify project brief"
  );
}

export async function runCritique({ brief, originalInput }) {
  return postJson(
    "/critique",
    {
      brief,
      originalInput,
    },
    "Failed to critique project"
  );
}

export async function askCriticFollowUp({
  agentId,
  brief,
  critique,
  originalInput,
  messages,
  question,
}) {
  return postJson(
    `/critique/${agentId}/follow-up`,
    {
      brief,
      critique,
      originalInput,
      messages,
      question,
    },
    "The critic could not answer that question."
  );
}

async function postJson(path, body, fallbackMessage) {
  const response = await fetch(buildApiUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
}
