import { useMemo, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  buildProjectPayload,
  clarifyBrief,
  interpretBrief,
  runCritique,
} from "./api/critiqueApi";
import { ClarificationPage } from "./components/ClarificationPage";
import { ReviewLayout } from "./components/ReviewLayout";
import { SetupForm } from "./components/SetupForm";
import { TopBar } from "./components/TopBar";
import { AGENTS, INITIAL_REFLECTIONS } from "./data/agents";
import { fileToData } from "./utils/fileToData";
import { getBrief, getSynthesisItems } from "./utils/responseFormatters";
import "./styles/app.css";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectType, setProjectType] = useState("student design concept");
  const [description, setDescription] = useState("");
  const [selectedCritics, setSelectedCritics] = useState(AGENTS.map((agent) => agent.id));
  const [images, setImages] = useState([]);
  const [result, setResult] = useState(null);
  const [projectInput, setProjectInput] = useState(null);
  const [structuredBrief, setStructuredBrief] = useState(null);
  const [clarifyingQuestion, setClarifyingQuestion] = useState("");
  const [clarificationAnswer, setClarificationAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reflections, setReflections] = useState(INITIAL_REFLECTIONS);
  const fileInputRef = useRef(null);

  const canSubmit = Boolean(description.trim()) && selectedCritics.length >= 2 && !loading;

  const visibleAgents = useMemo(
    () => AGENTS.filter((agent) => selectedCritics.includes(agent.id)),
    [selectedCritics]
  );

  const brief = useMemo(() => {
    const fallback = {
      title: projectTitle,
      description,
      projectType,
    };

    if (structuredBrief) {
      return getBrief({ projectBrief: structuredBrief }, fallback);
    }

    return getBrief(result, fallback);
  }, [description, projectTitle, projectType, result, structuredBrief]);

  const synthesisItems = useMemo(() => getSynthesisItems(result), [result]);

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
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage("At least one image could not be read.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeImage(name) {
    setImages((current) => current.filter((image) => image.name !== name));
  }

  function resetSession() {
    setResult(null);
    setProjectInput(null);
    setStructuredBrief(null);
    setClarifyingQuestion("");
    setClarificationAnswer("");
    setLoading(false);
    setErrorMessage("");
    setReflections(INITIAL_REFLECTIONS);
    navigate("/");
  }

  function handleReflectionChange(agentId, value) {
    setReflections((current) => ({
      ...current,
      [agentId]: value,
    }));
  }

  async function startCritique() {
    if (!canSubmit) {
      return;
    }

    const nextProjectInput = buildProjectPayload({
      projectTitle,
      description,
      projectType,
      images,
    });

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

  return (
    <main className="app">
      <TopBar
        onReset={resetSession}
        selectedCriticCount={selectedCritics.length}
        showReset={location.pathname !== "/"}
      />

      <div className="workspace">
        <Routes>
          <Route
            path="/"
            element={
              <SetupForm
                agents={AGENTS}
                canSubmit={canSubmit}
                description={description}
                errorMessage={errorMessage}
                fileInputRef={fileInputRef}
                images={images}
                loading={loading}
                onDescriptionChange={setDescription}
                onFileChange={handleFileChange}
                onProjectTitleChange={setProjectTitle}
                onProjectTypeChange={setProjectType}
                onRemoveImage={removeImage}
                onStartCritique={startCritique}
                onToggleCritic={toggleCritic}
                projectTitle={projectTitle}
                projectType={projectType}
                selectedCritics={selectedCritics}
              />
            }
          />
          <Route
            path="/clarify"
            element={
              clarifyingQuestion ? (
                <ClarificationPage
                  clarificationAnswer={clarificationAnswer}
                  clarifyingQuestion={clarifyingQuestion}
                  errorMessage={errorMessage}
                  loading={loading}
                  onAnswerChange={setClarificationAnswer}
                  onBack={() => navigate("/")}
                  onSubmit={submitClarification}
                />
              ) : (
                <Navigate replace to="/" />
              )
            }
          />
          <Route
            path="/review"
            element={
              <ReviewLayout
                brief={brief}
                errorMessage={errorMessage}
                images={images}
                loading={loading}
                onReflectionChange={handleReflectionChange}
                onReset={resetSession}
                reflections={reflections}
                result={result}
                synthesisItems={synthesisItems}
                visibleAgents={visibleAgents}
              />
            }
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </div>
    </main>
  );
}
