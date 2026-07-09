import { useMemo, useRef, useState } from "react";
import { buildProjectPayload } from "../api/critiqueApi";
import { AGENTS } from "../data/agents";
import { fileToData } from "../utils/fileToData";

export function useProjectSetup() {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectType, setProjectType] = useState("student design concept");
  const [description, setDescription] = useState("");
  const [selectedCritics, setSelectedCritics] = useState(AGENTS.map((agent) => agent.id));
  const [images, setImages] = useState([]);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  const canSubmitInput = Boolean(description.trim()) && selectedCritics.length >= 2;

  const visibleAgents = useMemo(
    () => AGENTS.filter((agent) => selectedCritics.includes(agent.id)),
    [selectedCritics]
  );

  const briefFallback = useMemo(
    () => ({
      title: projectTitle,
      description,
      projectType,
    }),
    [description, projectTitle, projectType]
  );

  function toggleCritic(agentId) {
    setSelectedCritics((current) => {
      if (current.includes(agentId)) {
        return current.filter((id) => id !== agentId);
      }

      return [...current, agentId];
    });
  }

  async function handleFileChange(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    try {
      const loaded = await Promise.all(files.map(fileToData));
      setImages((current) => [...current, ...loaded].slice(0, 6));
      setFileError("");
    } catch (error) {
      console.error(error);
      setFileError("At least one image could not be read.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeImage(name) {
    setImages((current) => current.filter((image) => image.name !== name));
  }

  function createProjectInput() {
    return buildProjectPayload({
      projectTitle,
      description,
      projectType,
      images,
    });
  }

  return {
    briefFallback,
    canSubmitInput,
    createProjectInput,
    description,
    fileError,
    fileInputRef,
    handleFileChange,
    images,
    projectTitle,
    projectType,
    removeImage,
    selectedCritics,
    setDescription,
    setProjectTitle,
    setProjectType,
    toggleCritic,
    visibleAgents,
  };
}
