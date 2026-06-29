export function SetupForm({
  agents,
  canSubmit,
  description,
  errorMessage,
  fileInputRef,
  images,
  loading,
  onDescriptionChange,
  onFileChange,
  onProjectTitleChange,
  onProjectTypeChange,
  onRemoveImage,
  onStartCritique,
  onToggleCritic,
  projectTitle,
  projectType,
  selectedCritics,
}) {
  return (
    <div className="setup-shell">
      <section className="sleek-card setup-card">
        <div className="section-head">
          <div className="title-cluster">
            <div className="title-icon">+</div>
            <div>
              <h1>Initiate Critique Session</h1>
              <p>Frame the design work, attach visual context, then let the critique agents respond.</p>
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="project-title">
              Project Name
            </label>
            <input
              id="project-title"
              className="input"
              value={projectTitle}
              onChange={(event) => onProjectTitleChange(event.target.value)}
              placeholder="DesignPrism concept review"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="project-type">
              Project Type
            </label>
            <select
              id="project-type"
              className="select"
              value={projectType}
              onChange={(event) => onProjectTypeChange(event.target.value)}
            >
              <option value="student design concept">Student design concept</option>
              <option value="interaction design">Interaction design</option>
              <option value="service design">Service design</option>
              <option value="industrial design">Industrial design</option>
              <option value="visual communication">Visual communication</option>
              <option value="mixed design project">Mixed design project</option>
            </select>
          </div>

          <div className="field full">
            <label className="label" htmlFor="description">
              Project Parameters
            </label>
            <textarea
              id="description"
              className="textarea"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Describe the design project, intent, target users, constraints, current decisions, and where you feel uncertain."
            />
          </div>

          <div className="field">
            <span className="label">Visual Data</span>
            <label className="upload-card">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={onFileChange}
              />
              <span>
                <span className="upload-icon">[]</span>
                <span className="upload-title">Provide visual context</span>
                <span className="upload-sub">Upload up to 6 sketches, boards, or interface screenshots.</span>
              </span>
            </label>

            {images.length > 0 && (
              <div className="image-strip">
                {images.map((image) => (
                  <div className="image-thumb" key={image.name}>
                    <img src={image.preview} alt={image.name} />
                    <button
                      className="remove-image"
                      type="button"
                      onClick={() => onRemoveImage(image.name)}
                      aria-label={`Remove ${image.name}`}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="field">
            <span className="label">Analytical Lenses - Minimum 2</span>
            <div className="agents-list">
              {agents.map((agent) => {
                const selected = selectedCritics.includes(agent.id);

                return (
                  <button
                    key={agent.id}
                    type="button"
                    className={`agent-btn ${selected ? "selected" : ""}`}
                    onClick={() => onToggleCritic(agent.id)}
                  >
                    <span className="agent-left">
                      <span className="agent-mark">{agent.marker}</span>
                      <span>
                        <span className="agent-name">{agent.name}</span>
                        <span className="agent-desc">{agent.descriptor}</span>
                      </span>
                    </span>
                    <span className="agent-dot" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button className="primary-btn" type="button" disabled={!canSubmit} onClick={onStartCritique}>
          {loading ? "Running interpreter" : "Run Interpreter"}
          <span aria-hidden="true">-&gt;</span>
        </button>

        {errorMessage && <div className="error">{errorMessage}</div>}
      </section>
    </div>
  );
}
