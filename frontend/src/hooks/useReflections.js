import { useState } from "react";
import { INITIAL_REFLECTIONS } from "../data/agents";

export function useReflections() {
  const [reflections, setReflections] = useState(INITIAL_REFLECTIONS);

  function resetReflections() {
    setReflections(INITIAL_REFLECTIONS);
  }

  function handleReflectionChange(agentId, value) {
    setReflections((current) => ({
      ...current,
      [agentId]: value,
    }));
  }

  return {
    handleReflectionChange,
    reflections,
    resetReflections,
  };
}
