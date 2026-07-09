import { getCritiqueField } from "../utils/responseFormatters";
import { useCriticConversation } from "../hooks/useCriticConversation";

export function CriticCard({
  agent,
  brief,
  critique,
  onReflectionChange,
  projectInput,
  reflection,
}) {
  const hasCritique = Object.keys(critique).length > 0;
  const conversation = useCriticConversation({
    agentId: agent.id,
    brief,
    critique,
    projectInput,
  });

  function handleSubmit(event) {
    event.preventDefault();
    conversation.sendMessage();
  }

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

      <div className="exchange-buffer">
        <label className="label" htmlFor={`followup-${agent.id}`}>
          Exchange Buffer
        </label>
        {conversation.messages.length > 0 && (
          <div className="chat-log" aria-live="polite">
            {console.log(conversation.messages)}
            {conversation.messages.map((message) => (
              <div className={`chat-message ${message.role}`} key={message.id}>
                {message.content}
              </div>
            ))}
            {conversation.isSending && <div className="chat-message assistant pending">Thinking...</div>}
          </div>
        )}
        <form className="chat-composer" onSubmit={handleSubmit}>
          <textarea
            id={`followup-${agent.id}`}
            className="textarea"
            value={conversation.draft}
            onChange={(event) => conversation.setDraft(event.target.value)}
            placeholder={`Ask ${agent.role} about this critique...`}
            disabled={!hasCritique || conversation.isSending}
            maxLength={2000}
          />
          <button
            className="mini-btn"
            type="submit"
            disabled={!hasCritique || !conversation.draft.trim() || conversation.isSending}
          >
            {conversation.isSending ? "Thinking" : "Send"}
          </button>
        </form>
        {conversation.errorMessage && <div className="chat-error">{conversation.errorMessage}</div>}
      </div>
    </article>
  );
}
