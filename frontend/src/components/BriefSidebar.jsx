import { normalizeText } from "../utils/responseFormatters";

export function BriefSidebar({ brief, images }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="side-label">Active Brief - Agent 01</div>
        <h2 className="side-title">{brief.statedGoal}</h2>
        <p className="side-sub">Project Type: {normalizeText(brief.projectType)}</p>
      </div>

      <div className="side-stack">
        <div className="side-box">
          <strong style={{ color: "var(--cyan)" }}>Medium</strong>
          <p>{normalizeText(brief.medium)}</p>
        </div>
        <div className="side-box">
          <strong style={{ color: "var(--green)" }}>Target User</strong>
          <p>{normalizeText(brief.targetUser)}</p>
        </div>
        <div className="side-box">
          <strong style={{ color: "var(--purple)" }}>Constraints</strong>
          <p>{normalizeText(brief.constraints)}</p>
        </div>
        <div className="side-box">
          <strong style={{ color: "var(--orange)" }}>Open Questions</strong>
          <p>{normalizeText(brief.openQuestions)}</p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="side-images">
          {images.slice(0, 6).map((image) => (
            <img key={image.name} src={image.preview} alt={image.name} />
          ))}
        </div>
      )}
    </aside>
  );
}
