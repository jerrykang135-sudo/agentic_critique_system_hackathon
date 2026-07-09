import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ClarificationPage } from "./components/ClarificationPage";
import { ReviewLayout } from "./components/ReviewLayout";
import { SetupForm } from "./components/SetupForm";
import { TopBar } from "./components/TopBar";
import { AGENTS } from "./data/agents";
import { useCritiqueSession } from "./hooks/useCritiqueSession";
import { useProjectSetup } from "./hooks/useProjectSetup";
import { useReflections } from "./hooks/useReflections";
import "./styles/app.css";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const setup = useProjectSetup();
  const session = useCritiqueSession({
    briefFallback: setup.briefFallback,
    createProjectInput: setup.createProjectInput,
    navigate,
  });
  const reflectionState = useReflections();

  const canSubmit = setup.canSubmitInput && !session.loading;
  const setupErrorMessage = setup.fileError || session.errorMessage;

  function resetSession() {
    session.resetSession();
    reflectionState.resetReflections();
    navigate("/");
  }

  async function startCritique() {
    if (!canSubmit) {
      return;
    }

    await session.startCritique();
  }

  return (
    <main className="app">
      <TopBar
        onReset={resetSession}
        selectedCriticCount={setup.selectedCritics.length}
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
                description={setup.description}
                errorMessage={setupErrorMessage}
                fileInputRef={setup.fileInputRef}
                images={setup.images}
                loading={session.loading}
                onDescriptionChange={setup.setDescription}
                onFileChange={setup.handleFileChange}
                onProjectTitleChange={setup.setProjectTitle}
                onProjectTypeChange={setup.setProjectType}
                onRemoveImage={setup.removeImage}
                onStartCritique={startCritique}
                onToggleCritic={setup.toggleCritic}
                projectTitle={setup.projectTitle}
                projectType={setup.projectType}
                selectedCritics={setup.selectedCritics}
              />
            }
          />
          <Route
            path="/clarify"
            element={
              session.clarifyingQuestion ? (
                <ClarificationPage
                  clarificationAnswer={session.clarificationAnswer}
                  clarifyingQuestion={session.clarifyingQuestion}
                  errorMessage={session.errorMessage}
                  loading={session.loading}
                  onAnswerChange={session.setClarificationAnswer}
                  onBack={() => navigate("/")}
                  onSubmit={session.submitClarification}
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
                brief={session.brief}
                errorMessage={session.errorMessage}
                images={setup.images}
                loading={session.loading}
                onReflectionChange={reflectionState.handleReflectionChange}
                onReset={resetSession}
                reflections={reflectionState.reflections}
                result={session.result}
                synthesisItems={session.synthesisItems}
                visibleAgents={setup.visibleAgents}
              />
            }
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </div>
    </main>
  );
}
