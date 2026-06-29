export function ClarificationPage({
  clarifyingQuestion,
  clarificationAnswer,
  errorMessage,
  loading,
  onAnswerChange,
  onBack,
  onSubmit,
}) {
  return (
    <div className="setup-shell">
      <section className="sleek-card setup-card">
        <div className="section-head">
          <div className="title-cluster">
            <div className="title-icon">?</div>
            <div>
              <h1>Clarify Project Context</h1>
              <p>The interpreter needs one more detail before the critique agents run.</p>
            </div>
          </div>
        </div>

        <div className="clarify-panel">
          <span className="label">Interpreter Question</span>
          <p>{clarifyingQuestion}</p>
        </div>

        <div className="field">
          <label className="label" htmlFor="clarification-answer">
            Your Answer
          </label>
          <textarea
            id="clarification-answer"
            className="textarea"
            value={clarificationAnswer}
            onChange={(event) => onAnswerChange(event.target.value)}
            placeholder="Answer with the missing context as clearly as you can."
          />
        </div>

        <div className="action-row">
          <button className="secondary-btn" type="button" onClick={onBack} disabled={loading}>
            Back
          </button>
          <button
            className="primary-btn"
            type="button"
            onClick={onSubmit}
            disabled={!clarificationAnswer.trim() || loading}
          >
            {loading ? "Updating brief" : "Continue to critique"}
            <span aria-hidden="true">-&gt;</span>
          </button>
        </div>

        {errorMessage && <div className="error">{errorMessage}</div>}
      </section>
    </div>
  );
}
