import { getCritiqueField } from "../utils/responseFormatters";

export function CriticCard({
  agent,
  critique,
  onReflectionChange,
  reflection,
}) {
  const hasCritique = Object.keys(critique).length > 0;

  return (
    <article className={`sleek-card critic-card ${agent.accent}`}>
      <header className="critic-head">
        <div>
          <h3 className="accent-text">{agent.name}</h3>
          <span>{agent.role}</span>
        </div>
        <div className="critic-signal" />
      </header>

      <div className="critic-body">
        {hasCritique ? (
          <>
            <div className="crit-section">
              <strong>Observation</strong>
              <p>{getCritiqueField(critique, "observation") || "No observation returned."}</p>
            </div>
            <div className="crit-section panel">
              <strong style={{ color: "var(--red)" }}>Concern</strong>
              <p>{getCritiqueField(critique, "concern") || "No concern returned."}</p>
            </div>
            <div className="crit-section panel">
              <strong style={{ color: "var(--cyan)" }}>Suggestion</strong>
              <p>{getCritiqueField(critique, "suggestion") || "No suggestion returned."}</p>
            </div>
            <div className="crit-section">
              <strong>Trade-off</strong>
              <p>{getCritiqueField(critique, "tradeoff") || "No trade-off returned."}</p>
            </div>
            <div className="crit-section">
              <strong>Reflection Prompt</strong>
              <p>{getCritiqueField(critique, "reflectionPrompt") || "No reflection prompt returned."}</p>
            </div>
          </>
        ) : (
          <p className="empty">This selected perspective did not return a critique from the backend response.</p>
        )}

        <div className="reflection-area">
          <label className="label" htmlFor={`reflection-${agent.id}`}>
            Internal Reflection
          </label>
          <textarea
            id={`reflection-${agent.id}`}
            className="textarea"
            value={reflection || ""}
            onChange={(event) => onReflectionChange(agent.id, event.target.value)}
            placeholder="What pattern, risk, or next move do you want to remember?"
          />
        </div>
      </div>

      <div className="followup-disabled">
        <label className="label" htmlFor={`followup-${agent.id}`}>
          Exchange Buffer
        </label>
        <input
          id={`followup-${agent.id}`}
          className="input"
          disabled
          placeholder="Follow-up critique needs a backend endpoint before this can be active."
        />
      </div>
    </article>
  );
}
