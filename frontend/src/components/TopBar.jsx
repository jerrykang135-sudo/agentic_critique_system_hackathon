export function TopBar({ selectedCriticCount, showReset, onReset }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">DP</div>
        <div className="brand-title">
          <strong>Personalise AI Critique</strong>
          {/*<span>Studio</span>*/}
        </div>
      </div>

      <div className="top-status">
        <span>
          <span className={`pulse ${selectedCriticCount >= 2 ? "active" : ""}`} />
          {selectedCriticCount} critics connected
        </span>
        {showReset && (
          <button className="ghost-btn" type="button" onClick={onReset}>
            Reset Session
          </button>
        )}
      </div>
    </header>
  );
}
