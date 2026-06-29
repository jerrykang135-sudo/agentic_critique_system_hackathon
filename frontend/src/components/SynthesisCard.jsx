export function SynthesisCard({ synthesisItems }) {
  return (
    <section className="sleek-card synthesis-card">
      <div className="synthesis-label">
        <div>
          <span>Agent 05</span>
          <strong>SYNTHESIS</strong>
        </div>
      </div>
      <div className="synthesis-body">
        {synthesisItems.length ? (
          synthesisItems.map(([label, value]) => (
            <div className="synthesis-item" key={label}>
              <strong>{label}</strong>
              <p>{value}</p>
            </div>
          ))
        ) : (
          <p className="empty">No synthesis was returned.</p>
        )}
      </div>
    </section>
  );
}
