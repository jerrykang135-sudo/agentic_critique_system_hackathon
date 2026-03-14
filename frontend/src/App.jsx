import { useState } from "react";

const DEFAULT_GOALS = [
  "receive critique",
  "reflect on trade-offs",
  "clarify design direction",
];

const AGENT_META = {
  industrial: {
    label: "Industrial Critic",
    accent: "#d06f2f",
    description: "Usability, ergonomics, feasibility, and interaction in use.",
  },
  service: {
    label: "Service Critic",
    accent: "#2d7a63",
    description: "Journey logic, touchpoints, friction, and ecosystem gaps.",
  },
  visual: {
    label: "Visual Critic",
    accent: "#3856d6",
    description: "Clarity, hierarchy, storytelling, and communication cues.",
  },
};

const appStyles = `
  :root {
    color-scheme: light;
    --bg: #f5efe5;
    --paper: rgba(255, 251, 247, 0.86);
    --panel: rgba(255, 255, 255, 0.82);
    --panel-strong: #fffdf9;
    --ink: #1d1c1a;
    --muted: #655f57;
    --line: rgba(40, 32, 20, 0.12);
    --shadow: 0 24px 80px rgba(70, 43, 19, 0.12);
    --radius-lg: 28px;
    --radius-md: 18px;
    --radius-sm: 12px;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background:
      radial-gradient(circle at top left, rgba(244, 190, 96, 0.28), transparent 28%),
      radial-gradient(circle at top right, rgba(73, 128, 255, 0.14), transparent 26%),
      linear-gradient(180deg, #f7f0e5 0%, #f0e7da 55%, #ece4d8 100%);
    color: var(--ink);
    font-family: "Avenir Next", "Segoe UI", sans-serif;
  }

  button, input, textarea, select {
    font: inherit;
  }

  .app-shell {
    min-height: 100vh;
    padding: 32px 20px 48px;
  }

  .app-frame {
    width: min(1240px, 100%);
    margin: 0 auto;
    display: grid;
    gap: 24px;
  }

  .hero {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, rgba(255, 251, 247, 0.86), rgba(255, 246, 237, 0.92));
    backdrop-filter: blur(18px);
    box-shadow: var(--shadow);
    padding: 32px;
  }

  .hero::after {
    content: "";
    position: absolute;
    inset: auto -12% -42% auto;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(208, 111, 47, 0.2), transparent 68%);
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(29, 28, 26, 0.06);
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
  }

  .hero h1 {
    margin: 18px 0 10px;
    max-width: 760px;
    font-family: "Iowan Old Style", "Palatino Linotype", serif;
    font-size: clamp(2.6rem, 5vw, 4.4rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
  }

  .hero p {
    margin: 0;
    max-width: 720px;
    color: var(--muted);
    font-size: 1.03rem;
    line-height: 1.65;
  }

  .hero-grid,
  .studio-grid,
  .results-grid,
  .reflection-grid,
  .critique-grid {
    display: grid;
    gap: 20px;
  }

  .hero-grid {
    margin-top: 26px;
    grid-template-columns: 1.7fr 1fr;
    align-items: end;
  }

  .studio-grid {
    grid-template-columns: 1.45fr 0.95fr;
    align-items: start;
  }

  .results-grid {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: start;
  }

  .reflection-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .critique-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .panel {
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    background: var(--paper);
    backdrop-filter: blur(16px);
    box-shadow: var(--shadow);
    padding: 24px;
  }

  .panel h2,
  .panel h3,
  .panel h4 {
    margin: 0;
    font-family: "Iowan Old Style", "Palatino Linotype", serif;
    letter-spacing: -0.02em;
  }

  .panel h2 {
    font-size: 1.7rem;
  }

  .panel h3 {
    font-size: 1.25rem;
  }

  .panel p,
  .panel li,
  .panel label,
  .panel span,
  .panel strong {
    color: var(--ink);
  }

  .muted {
    color: var(--muted);
  }

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 18px;
  }

  .section-head p {
    margin: 6px 0 0;
    color: var(--muted);
    line-height: 1.55;
  }

  .stack {
    display: grid;
    gap: 14px;
  }

  .field {
    display: grid;
    gap: 8px;
  }

  .field label {
    font-size: 0.92rem;
    font-weight: 700;
  }

  .input,
  .textarea,
  .select {
    width: 100%;
    border: 1px solid rgba(34, 29, 20, 0.12);
    border-radius: var(--radius-md);
    background: rgba(255, 255, 255, 0.78);
    padding: 14px 16px;
    color: var(--ink);
    outline: none;
    transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
  }

  .textarea {
    min-height: 220px;
    resize: vertical;
    line-height: 1.6;
  }

  .input:focus,
  .textarea:focus,
  .select:focus {
    border-color: rgba(56, 86, 214, 0.5);
    box-shadow: 0 0 0 4px rgba(56, 86, 214, 0.08);
    transform: translateY(-1px);
  }

  .goal-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .goal-chip {
    border: 1px solid rgba(34, 29, 20, 0.1);
    border-radius: 999px;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.86);
    cursor: pointer;
    transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
  }

  .goal-chip.active {
    background: rgba(29, 28, 26, 0.92);
    color: white;
    border-color: rgba(29, 28, 26, 0.92);
  }

  .goal-chip:hover,
  .action-button:hover,
  .ghost-button:hover {
    transform: translateY(-1px);
  }

  .upload-box {
    border: 1.5px dashed rgba(34, 29, 20, 0.18);
    border-radius: 24px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.85), rgba(251, 244, 234, 0.95));
    padding: 18px;
  }

  .upload-box input {
    display: block;
    width: 100%;
  }

  .thumb-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    gap: 12px;
    margin-top: 14px;
  }

  .thumb {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.86);
    border: 1px solid rgba(34, 29, 20, 0.08);
    aspect-ratio: 1;
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumb span {
    position: absolute;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border-radius: 10px;
    background: rgba(29, 28, 26, 0.74);
    color: white;
    padding: 6px 8px;
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .action-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
  }

  .action-button,
  .ghost-button {
    border: 0;
    border-radius: 999px;
    padding: 14px 18px;
    cursor: pointer;
    transition: transform 160ms ease, opacity 160ms ease, background 160ms ease;
  }

  .action-button {
    background: linear-gradient(135deg, #1f3e88, #3856d6);
    color: white;
    font-weight: 700;
    min-width: 180px;
  }

  .ghost-button {
    background: rgba(29, 28, 26, 0.06);
    color: var(--ink);
  }

  .action-button:disabled,
  .ghost-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  .step-list,
  .insight-list {
    display: grid;
    gap: 12px;
  }

  .step,
  .insight,
  .brief-card,
  .synthesis-card,
  .reflection-card,
  .status-card {
    border: 1px solid rgba(34, 29, 20, 0.08);
    border-radius: 20px;
    background: var(--panel);
    padding: 16px;
  }

  .step strong,
  .insight strong,
  .brief-card strong,
  .synthesis-card strong,
  .reflection-card strong {
    display: block;
    margin-bottom: 6px;
  }

  .mini-label {
    display: inline-flex;
    margin-bottom: 10px;
    color: var(--muted);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .brief-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .critique-card {
    border: 1px solid rgba(34, 29, 20, 0.08);
    border-radius: 24px;
    background: var(--panel-strong);
    padding: 18px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }

  .critique-card header {
    display: grid;
    gap: 8px;
    margin-bottom: 14px;
  }

  .critique-accent {
    width: 56px;
    height: 6px;
    border-radius: 999px;
  }

  .critique-card p {
    margin: 0;
    color: var(--muted);
    line-height: 1.55;
  }

  .critique-points {
    display: grid;
    gap: 10px;
    margin-top: 14px;
  }

  .critique-point {
    border-radius: 16px;
    background: rgba(249, 245, 239, 0.9);
    padding: 12px;
  }

  .critique-point span {
    display: block;
    color: var(--muted);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .reflection-card textarea {
    min-height: 140px;
  }

  .reflection-prompts {
    display: grid;
    gap: 12px;
  }

  .empty-state {
    text-align: center;
    padding: 44px 24px;
  }

  .empty-state h3 {
    margin-bottom: 10px;
  }

  .status-card {
    background:
      linear-gradient(135deg, rgba(56, 86, 214, 0.12), rgba(255, 255, 255, 0.9));
  }

  .error {
    color: #a83126;
  }

  .caption {
    font-size: 0.9rem;
    color: var(--muted);
  }

  @media (max-width: 1080px) {
    .hero-grid,
    .studio-grid,
    .results-grid,
    .critique-grid,
    .reflection-grid,
    .brief-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .app-shell {
      padding: 18px 14px 36px;
    }

    .hero,
    .panel {
      padding: 20px;
      border-radius: 22px;
    }

    .hero h1 {
      font-size: 2.4rem;
    }
  }
`;

function toTitleCase(value) {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeArray(input) {
  if (Array.isArray(input)) {
    return input.filter(Boolean);
  }

  if (typeof input === "string" && input.trim()) {
    return [input.trim()];
  }

  return [];
}

function getNestedRecord(section) {
  if (!section || typeof section !== "object") {
    return null;
  }

  const firstValue = Object.values(section)[0];
  if (firstValue && typeof firstValue === "object" && !Array.isArray(firstValue)) {
    return firstValue;
  }

  return section;
}

function getBriefEntries(projectBrief) {
  const nestedRecord = getNestedRecord(projectBrief);

  if (!nestedRecord || typeof nestedRecord !== "object" || Array.isArray(nestedRecord)) {
    return [];
  }

  return Object.entries(nestedRecord).map(([label, value]) => ({
    label,
    value: Array.isArray(value) ? value.join("\n") : String(value),
  }));
}

function getCritiqueCards(critiques) {
  if (!critiques || typeof critiques !== "object") {
    return [];
  }

  return Object.entries(critiques).map(([agentKey, section]) => {
    const content = getNestedRecord(section) || {};
    const meta = AGENT_META[agentKey] || {
      label: toTitleCase(agentKey),
      accent: "#655f57",
      description: "A different critique perspective on the design proposal.",
    };

    return {
      key: agentKey,
      ...meta,
      observation: content.Observation || "",
      concern: content.Concern || "",
      suggestion: content.Suggestion || "",
      tradeOff: content["Trade-off"] || content.Tradeoff || "",
      reflectionPrompt: content["Reflection Prompt"] || "",
    };
  });
}

function getSynthesisEntries(synthesis) {
  const nestedRecord = getNestedRecord(synthesis);

  if (!nestedRecord || typeof nestedRecord !== "object") {
    return [];
  }

  return Object.entries(nestedRecord);
}

function fileToData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      const mime = file.type || "";
      const format = mime.split("/")[1] || file.name.split(".").pop() || "png";

      resolve({
        name: file.name,
        format: format.toLowerCase(),
        base64,
        preview: result,
      });
    };

    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

export default function App() {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectType, setProjectType] = useState("interaction design");
  const [projectDescription, setProjectDescription] = useState("");
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);
  const [reflectionNotes, setReflectionNotes] = useState({
    priority: "",
    tradeoff: "",
    nextStep: "",
  });

  const critiqueCards = getCritiqueCards(result?.critiques);
  const briefEntries = getBriefEntries(result?.projectBrief);
  const synthesisEntries = getSynthesisEntries(result?.synthesis);
  const reflectionPrompts = critiqueCards
    .map((card) => card.reflectionPrompt)
    .filter(Boolean);

  if (result?.synthesis) {
    const closingPrompt = getNestedRecord(result.synthesis)?.["Closing Reflection"];
    if (closingPrompt) {
      reflectionPrompts.push(closingPrompt);
    }
  }

  function toggleGoal(goal) {
    setGoals((currentGoals) =>
      currentGoals.includes(goal)
        ? currentGoals.filter((item) => item !== goal)
        : [...currentGoals, goal]
    );
  }

  async function handleFileChange(event) {
    const nextFiles = Array.from(event.target.files || []);
    if (!nextFiles.length) {
      return;
    }

    try {
      const loadedFiles = await Promise.all(nextFiles.map(fileToData));
      setImages((currentImages) => [...currentImages, ...loadedFiles].slice(0, 9));
    } catch (error) {
      console.error(error);
      setErrorMessage("At least one image could not be read.");
    }
  }

  function removeImage(name) {
    setImages((currentImages) => currentImages.filter((image) => image.name !== name));
  }

  function resetWorkspace() {
    setProjectTitle("");
    setProjectType("interaction design");
    setProjectDescription("");
    setGoals(DEFAULT_GOALS);
    setImages([]);
    setResult(null);
    setErrorMessage("");
    setReflectionNotes({
      priority: "",
      tradeoff: "",
      nextStep: "",
    });
  }

  async function handleAnalyze() {
    setLoading(true);
    setErrorMessage("");
    setResult(null);

    try {
      const response = await fetch("/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectDescription: projectTitle.trim()
            ? `${projectTitle.trim()}\n\n${projectDescription.trim()}`
            : projectDescription.trim(),
          projectType,
          goals,
          images: images.map(({ format, base64 }) => ({ format, base64 })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to analyze project");
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{appStyles}</style>
      <main className="app-shell">
        <div className="app-frame">
          <section className="hero">
            <div className="eyebrow">Human-AI Design Critique Studio</div>
            <h1>Design for reflection, not just response.</h1>
            <p>
              This interface helps student designers frame a project, receive
              critique from multiple perspectives, and then articulate what they
              will change, defend, or reconsider next.
            </p>

            <div className="hero-grid">
              <div className="step-list">
                <div className="step">
                  <strong>1. Frame the project clearly</strong>
                  Give the system enough context to critique the concept, not
                  just the screen.
                </div>
                <div className="step">
                  <strong>2. Compare perspectives</strong>
                  Read tensions across industrial, service, and visual critique.
                </div>
                <div className="step">
                  <strong>3. Respond with your own reasoning</strong>
                  Turn critique into a design stance, trade-off, and next move.
                </div>
              </div>

              <div className="status-card">
                <span className="mini-label">Why this fits the hackathon</span>
                <strong>Agentic reasoning over generic generation</strong>
                <p className="muted" style={{ margin: 0 }}>
                  The product makes Nova feel like a critique panel and
                  reflective partner, which is much closer to your concept than
                  a simple chatbot result screen.
                </p>
              </div>
            </div>
          </section>

          <section className="studio-grid">
            <div className="panel">
              <div className="section-head">
                <div>
                  <h2>Project Framing</h2>
                  <p>
                    Help the agents understand the project goal, audience,
                    constraints, and medium before they critique it.
                  </p>
                </div>
              </div>

              <div className="stack">
                <div className="field">
                  <label htmlFor="title">Project title</label>
                  <input
                    id="title"
                    className="input"
                    placeholder="Educational cooking cafe for children"
                    value={projectTitle}
                    onChange={(event) => setProjectTitle(event.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="projectType">Project type</label>
                  <select
                    id="projectType"
                    className="select"
                    value={projectType}
                    onChange={(event) => setProjectType(event.target.value)}
                  >
                    <option value="interaction design">Interaction design</option>
                    <option value="service design">Service design</option>
                    <option value="industrial design">Industrial design</option>
                    <option value="communication design">Communication design</option>
                    <option value="student design concept">Student design concept</option>
                  </select>
                </div>

                <div className="field">
                  <label>Critique goals</label>
                  <div className="goal-row">
                    {[
                      "receive critique",
                      "reflect on trade-offs",
                      "clarify design direction",
                      "surface blind spots",
                      "prepare for jury review",
                    ].map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        className={`goal-chip ${goals.includes(goal) ? "active" : ""}`}
                        onClick={() => toggleGoal(goal)}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="description">Project description</label>
                  <textarea
                    id="description"
                    className="textarea"
                    value={projectDescription}
                    onChange={(event) => setProjectDescription(event.target.value)}
                    placeholder="Describe the concept, intended users, scenario, key interactions, current design decisions, and where you feel uncertain."
                  />
                </div>

                <div className="field upload-box">
                  <label htmlFor="images">Attach sketches, boards, or concept images</label>
                  <input
                    id="images"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={handleFileChange}
                  />
                  <div className="caption">
                    Up to 9 images. These give the critique agents visual context.
                  </div>

                  {images.length > 0 && (
                    <div className="thumb-grid">
                      {images.map((image) => (
                        <button
                          key={image.name}
                          type="button"
                          className="thumb"
                          onClick={() => removeImage(image.name)}
                          title={`Remove ${image.name}`}
                        >
                          <img src={image.preview} alt={image.name} />
                          <span>{image.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="action-row">
                  <button
                    type="button"
                    className="action-button"
                    onClick={handleAnalyze}
                    disabled={loading || !projectDescription.trim()}
                  >
                    {loading ? "Running critique studio..." : "Run agent critique"}
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={resetWorkspace}
                    disabled={loading}
                  >
                    Reset workspace
                  </button>
                  <span className="caption">
                    Tip: stronger critique comes from describing what you are
                    trying to achieve, not just what the interface looks like.
                  </span>
                </div>

                {errorMessage && <div className="error">{errorMessage}</div>}
              </div>
            </div>

            <div className="panel">
              <div className="section-head">
                <div>
                  <h2>Reflection-Oriented UI</h2>
                  <p>
                    This layout is designed to teach reasoning habits, which is
                    likely stronger for your story than a polished but generic
                    chatbot interface.
                  </p>
                </div>
              </div>

              <div className="insight-list">
                <div className="insight">
                  <strong>Structured brief first</strong>
                  The UI makes the student articulate intent before the AI
                  speaks, so the critique has better grounding.
                </div>
                <div className="insight">
                  <strong>Critique as perspectives</strong>
                  Agent cards show different lenses instead of collapsing
                  everything into one answer blob.
                </div>
                <div className="insight">
                  <strong>Reflection as output</strong>
                  The most important area is the student response section, where
                  they commit to trade-offs and next steps.
                </div>
              </div>

              <div className="status-card" style={{ marginTop: 18 }}>
                <span className="mini-label">Presentation cue</span>
                <strong>Frame it as a studio critique panel</strong>
                <p className="muted" style={{ margin: "8px 0 0" }}>
                  In the demo, emphasize that the system does not just judge the
                  design. It scaffolds a student&apos;s thinking process.
                </p>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="section-head">
              <div>
                <h2>Critique Workspace</h2>
                <p>
                  Once the agents respond, this area turns the JSON into a
                  usable critique conversation.
                </p>
              </div>
            </div>

            {!result && !loading && (
              <div className="empty-state">
                <h3>Your critique session will appear here</h3>
                <p className="muted">
                  Start with a project description and supporting images. The
                  app will surface the project brief, multi-agent critique, and
                  reflection prompts.
                </p>
              </div>
            )}

            {loading && (
              <div className="empty-state">
                <h3>Building the critique panel...</h3>
                <p className="muted">
                  The project interpreter is framing the brief and the critique
                  agents are comparing perspectives.
                </p>
              </div>
            )}

            {result && (
              <div className="stack">
                <div className="results-grid">
                  <div className="stack">
                    <div>
                      <span className="mini-label">Project brief</span>
                      <div className="brief-grid">
                        {briefEntries.length > 0 ? (
                          briefEntries.map((entry) => (
                            <div className="brief-card" key={entry.label}>
                              <strong>{entry.label}</strong>
                              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.55 }}>
                                {entry.value}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="brief-card">
                            <strong>Brief unavailable</strong>
                            <div className="muted">
                              The response did not include a structured brief in
                              a display-friendly format.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="mini-label">Critique agents</span>
                      <div className="critique-grid">
                        {critiqueCards.map((card) => (
                          <article className="critique-card" key={card.key}>
                            <header>
                              <div
                                className="critique-accent"
                                style={{ background: card.accent }}
                              />
                              <h3>{card.label}</h3>
                              <p>{card.description}</p>
                            </header>

                            <div className="critique-points">
                              <div className="critique-point">
                                <span>Observation</span>
                                {card.observation || "No observation returned."}
                              </div>
                              <div className="critique-point">
                                <span>Concern</span>
                                {card.concern || "No concern returned."}
                              </div>
                              <div className="critique-point">
                                <span>Suggestion</span>
                                {card.suggestion || "No suggestion returned."}
                              </div>
                              <div className="critique-point">
                                <span>Trade-off</span>
                                {card.tradeOff || "No trade-off returned."}
                              </div>
                              <div className="critique-point">
                                <span>Reflection prompt</span>
                                {card.reflectionPrompt || "No reflection prompt returned."}
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="stack">
                    <div className="synthesis-card">
                      <span className="mini-label">Synthesis</span>
                      <div className="stack">
                        {synthesisEntries.map(([label, value]) => (
                          <div key={label}>
                            <strong>{label}</strong>
                            <div className="muted" style={{ lineHeight: 1.55 }}>
                              {String(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="status-card">
                      <span className="mini-label">Session summary</span>
                      <strong>
                        {result?.inputSummary?.imageCount || 0} image
                        {(result?.inputSummary?.imageCount || 0) === 1 ? "" : "s"} reviewed
                      </strong>
                      <p className="muted" style={{ margin: "8px 0 0" }}>
                        Project type:{" "}
                        {result?.inputSummary?.projectType || projectType}
                      </p>
                    </div>

                    <div className="synthesis-card">
                      <span className="mini-label">Prompts to answer aloud</span>
                      <div className="reflection-prompts">
                        {normalizeArray(reflectionPrompts).length > 0 ? (
                          normalizeArray(reflectionPrompts).slice(0, 4).map((prompt) => (
                            <div key={prompt} className="brief-card">
                              {prompt}
                            </div>
                          ))
                        ) : (
                          <div className="brief-card">
                            Reflection prompts will appear here when available.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="mini-label">Student response</span>
                  <div className="reflection-grid">
                    <div className="reflection-card">
                      <strong>Which critique matters most right now?</strong>
                      <p className="muted" style={{ marginTop: 8 }}>
                        Choose the critique that changes your design direction
                        the most, and explain why.
                      </p>
                      <textarea
                        className="textarea"
                        value={reflectionNotes.priority}
                        onChange={(event) =>
                          setReflectionNotes((current) => ({
                            ...current,
                            priority: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="reflection-card">
                      <strong>What trade-off will you accept?</strong>
                      <p className="muted" style={{ marginTop: 8 }}>
                        Name the thing you are willing to lose to improve what
                        matters more.
                      </p>
                      <textarea
                        className="textarea"
                        value={reflectionNotes.tradeoff}
                        onChange={(event) =>
                          setReflectionNotes((current) => ({
                            ...current,
                            tradeoff: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="reflection-card">
                      <strong>What will you change next?</strong>
                      <p className="muted" style={{ marginTop: 8 }}>
                        Turn the critique into a concrete next design action or
                        test.
                      </p>
                      <textarea
                        className="textarea"
                        value={reflectionNotes.nextStep}
                        onChange={(event) =>
                          setReflectionNotes((current) => ({
                            ...current,
                            nextStep: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
