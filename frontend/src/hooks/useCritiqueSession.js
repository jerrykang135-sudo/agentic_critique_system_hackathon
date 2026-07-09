import { useMemo, useState } from "react";
import { clarifyBrief, interpretBrief, runCritique } from "../api/critiqueApi";
import { getBrief, getSynthesisItems } from "../utils/responseFormatters";

export function useCritiqueSession({ createProjectInput, briefFallback, navigate }) {
  const [result, setResult] = useState(null);
  const [projectInput, setProjectInput] = useState(null);
  const [structuredBrief, setStructuredBrief] = useState(null);
  const [clarifyingQuestion, setClarifyingQuestion] = useState("");
  const [clarificationAnswer, setClarificationAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const brief = useMemo(() => {
    if (structuredBrief) {
      return getBrief({ projectBrief: structuredBrief }, briefFallback);
    }

    return getBrief(result, briefFallback);
  }, [briefFallback, result, structuredBrief]);

  const synthesisItems = useMemo(() => getSynthesisItems(result), [result]);

  function resetSession() {
    setResult(null);
    setProjectInput(null);
    setStructuredBrief(null);
    setClarifyingQuestion("");
    setClarificationAnswer("");
    setLoading(false);
    setErrorMessage("");
  }

  async function startCritique() {
    const nextProjectInput = createProjectInput();

    setLoading(true);
    setResult(null);
    setStructuredBrief(null);
    setProjectInput(nextProjectInput);
    setClarifyingQuestion("");
    setClarificationAnswer("");
    setErrorMessage("");

    try {
      const briefResult = await interpretBrief(nextProjectInput);

      if (briefResult.status === "needs_clarification") {
        setClarifyingQuestion(briefResult.clarifyingQuestion);
        navigate("/clarify");
        return;
      }

      if (briefResult.status !== "brief_ready" || !briefResult.brief) {
        throw new Error("The backend did not return a usable project brief.");
      }

      await runCritiqueForBrief(briefResult.brief, nextProjectInput);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitClarification() {
    const cleanAnswer = clarificationAnswer.trim();

    if (!projectInput || !clarifyingQuestion || !cleanAnswer) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const briefResult = await clarifyBrief({
        originalInput: projectInput,
        clarifyingQuestion,
        clarificationAnswer: cleanAnswer,
      });

      if (briefResult.status !== "brief_ready" || !briefResult.brief) {
        throw new Error("The backend did not return a usable clarified brief.");
      }

      await runCritiqueForBrief(briefResult.brief, projectInput);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function runCritiqueForBrief(nextBrief, originalInput) {
    setStructuredBrief(nextBrief);
    navigate("/review");

    const critiqueResult = await runCritique({
      brief: nextBrief,
      originalInput,
    });

    setResult(critiqueResult);
  }

  return {
    brief,
    clarificationAnswer,
    clarifyingQuestion,
    errorMessage,
    loading,
    resetSession,
    result,
    setClarificationAnswer,
    startCritique,
    submitClarification,
    synthesisItems,
  };
}
