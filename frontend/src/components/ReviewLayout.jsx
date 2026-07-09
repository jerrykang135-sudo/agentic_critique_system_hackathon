import { BriefSidebar } from "./BriefSidebar";
import { CriticCard } from "./CriticCard";
import { LoadingState } from "./LoadingState";
import { SynthesisCard } from "./SynthesisCard";
import { getCritique } from "../utils/responseFormatters";

export function ReviewLayout({
  brief,
  errorMessage,
  images,
  loading,
  onReflectionChange,
  onReset,
  projectInput,
  reflections,
  result,
  synthesisItems,
  visibleAgents,
}) {
  function renderResults() {
    if (!result && !errorMessage) {
      return (
        <div className="setup-shell">
          <section className="sleek-card setup-card">
            <div className="section-head">
              <div>
                <h2>No Active Review</h2>
                <p>Start a critique session from the setup page before opening the review route.</p>
              </div>
            </div>
            <button className="secondary-btn" type="button" onClick={onReset}>
              Back to setup
            </button>
          </section>
        </div>
      );
    }

    if (!result && errorMessage) {
      return (
        <div className="setup-shell">
          <section className="sleek-card setup-card">
            <div className="section-head">
              <div>
                <h2>Critique Request Failed</h2>
                <p>The frontend is wired to Express, but the backend returned an error.</p>
              </div>
            </div>
            <div className="error">{errorMessage}</div>
            <button className="secondary-btn" type="button" onClick={onReset}>
              Back to setup
            </button>
          </section>
        </div>
      );
    }

    return (
      <>
        <div className="results-grid">
          {visibleAgents.map((agent) => (
            <CriticCard
              agent={agent}
              brief={brief}
              critique={getCritique(result, agent.id)}
              key={agent.id}
              onReflectionChange={onReflectionChange}
              projectInput={projectInput}
              reflection={reflections[agent.id]}
            />
          ))}
        </div>

        <SynthesisCard synthesisItems={synthesisItems} />
      </>
    );
  }

  return (
    <div className="review-layout">
      <BriefSidebar brief={brief} images={images} />
      <section className="main-panel">
        {loading ? <LoadingState /> : renderResults()}
      </section>
    </div>
  );
}
