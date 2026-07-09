import { useMemo, useReducer } from "react";
import { clarifyBrief, interpretBrief, runCritique } from "../api/critiqueApi";
import { getBrief, getSynthesisItems } from "../utils/responseFormatters";

const initialSessionState = {
  status: "idle",
  result: null,
  projectInput: null,
  structuredBrief: null,
  clarifyingQuestion: "",
  clarificationAnswer: "",
  errorMessage: "",
};

function critiqueSessionReducer(state, action) {
  switch (action.type) {
    case "brief_started":
      return {
        ...initialSessionState,
        status: "interpreting",
        projectInput: action.projectInput,
      };
    case "clarification_needed":
      return {
        ...state,
        status: "needs_clarification",
        clarifyingQuestion: action.question,
      };
    case "clarification_answer_changed":
      return {
        ...state,
        clarificationAnswer: action.answer,
      };
    case "clarification_started":
      return {
        ...state,
        status: "clarifying",
        errorMessage: "",
      };
    case "critique_started":
      return {
        ...state,
        status: "critiquing",
        structuredBrief: action.brief,
        errorMessage: "",
      };
    case "critique_completed":
      return {
        ...state,
        status: "review_ready",
        result: action.result,
      };
    case "failed":
      return {
        ...state,
        status: "error",
        errorMessage: action.message,
      };
    case "reset":
      return initialSessionState;
    default:
      return state;
  }
}

export function useCritiqueSession({ createProjectInput, briefFallback, navigate }) {
  const [state, dispatch] = useReducer(critiqueSessionReducer, initialSessionState);
  const loading = ["interpreting", "clarifying", "critiquing"].includes(state.status);

  const brief = useMemo(() => {
    if (state.structuredBrief) {
      return getBrief({ projectBrief: state.structuredBrief }, briefFallback);
    }

    return getBrief(state.result, briefFallback);
  }, [briefFallback, state.result, state.structuredBrief]);

  const synthesisItems = useMemo(() => getSynthesisItems(state.result), [state.result]);

  function resetSession() {
    dispatch({ type: "reset" });
  }

  async function startCritique() {
    const nextProjectInput = createProjectInput();

    dispatch({ type: "brief_started", projectInput: nextProjectInput });

    try {
      const briefResult = await interpretBrief(nextProjectInput);

      if (briefResult.status === "needs_clarification") {
        dispatch({
          type: "clarification_needed",
          question: briefResult.clarifyingQuestion,
        });
        navigate("/clarify");
        return;
      }

      if (briefResult.status !== "brief_ready" || !briefResult.brief) {
        throw new Error("The backend did not return a usable project brief.");
      }

      await runCritiqueForBrief(briefResult.brief, nextProjectInput);
    } catch (error) {
      console.error(error);
      dispatch({ type: "failed", message: error.message || "Request failed" });
    }
  }

  async function submitClarification() {
    const cleanAnswer = state.clarificationAnswer.trim();

    if (!state.projectInput || !state.clarifyingQuestion || !cleanAnswer) {
      return;
    }

    dispatch({ type: "clarification_started" });

    try {
      const briefResult = await clarifyBrief({
        originalInput: state.projectInput,
        clarifyingQuestion: state.clarifyingQuestion,
        clarificationAnswer: cleanAnswer,
      });

      if (briefResult.status !== "brief_ready" || !briefResult.brief) {
        throw new Error("The backend did not return a usable clarified brief.");
      }

      await runCritiqueForBrief(briefResult.brief, state.projectInput);
    } catch (error) {
      console.error(error);
      dispatch({ type: "failed", message: error.message || "Request failed" });
    }
  }

  async function runCritiqueForBrief(nextBrief, originalInput) {
    dispatch({ type: "critique_started", brief: nextBrief });
    navigate("/review");

    const critiqueResult = await runCritique({
      brief: nextBrief,
      originalInput,
    });

    dispatch({ type: "critique_completed", result: critiqueResult });
  }

  return {
    brief,
    clarificationAnswer: state.clarificationAnswer,
    clarifyingQuestion: state.clarifyingQuestion,
    errorMessage: state.errorMessage,
    loading,
    resetSession,
    result: state.result,
    setClarificationAnswer: (answer) =>
      dispatch({ type: "clarification_answer_changed", answer }),
    startCritique,
    submitClarification,
    synthesisItems,
  };
}
