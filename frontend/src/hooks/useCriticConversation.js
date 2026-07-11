import { useState } from "react";
import { askCriticFollowUp } from "../api/critiqueApi";

export function useCriticConversation({ agentId, brief, critique, projectInput }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function sendMessage() {
    const question = draft.trim();

    if (!question || isSending) {
      return;
    }

    const history = messages.slice(-8);
    const userMessage = createMessage("user", question);

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setErrorMessage("");
    setIsSending(true);

    try {
      const response = await askCriticFollowUp({
        agentId,
        brief,
        critique,
        originalInput: projectInput,
        messages: history,
        question,
      });

      if (typeof response?.answer !== "string" || !response.answer.trim()) {
        throw new Error("The critic returned an empty answer. Please try again.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("assistant", response.answer.trim()),
      ]);
      setDraft("");
    } catch (error) {
      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== userMessage.id)
      );
      setDraft(question);
      setErrorMessage(error.message || "The critic could not answer that question.");
    } finally {
      setIsSending(false);
    }
  }

  return {
    draft,
    errorMessage,
    isSending,
    messages,
    sendMessage,
    setDraft,
  };
}

function createMessage(role, content) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  };
}
