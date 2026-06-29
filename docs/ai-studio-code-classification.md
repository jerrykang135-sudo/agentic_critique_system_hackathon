# AI Studio Export Classification

Source archive: `designprism.zip`

## Frontend Code Reused

- `src/App.tsx`: visual structure and user flow inspiration for DesignPrism Studio.
- `src/types.ts`: session concepts mapped into local React state.
- `src/index.css`: visual direction translated into dependency-free CSS inside `frontend/src/App.jsx`.

## Code Kept Out Of The Browser

- `src/services/geminiService.ts`
- `src/services/agentPrompts.ts`
- `.env.example` values for Gemini access
- `@google/genai` dependency

These pieces initialize the model client, read an API key, send prompts, parse model output, and orchestrate critique agents. They should live behind the Express API because browser code is visible to users and cannot protect secrets or prompt orchestration.

## Backend Responsibilities

- API keys and provider SDK clients
- Prompt templates and agent instructions
- Brief interpretation
- Critique generation
- Synthesis generation
- Follow-up critique chat
- Server-side validation
- Future database reads and writes

## Current Integration

The migrated frontend calls the existing backend endpoint:

```js
POST /analyze
```

The request body stays aligned with the current Express contract:

```js
{
  projectDescription,
  projectType,
  images
}
```

Follow-up critique chat is intentionally disabled in the UI until a backend route such as `POST /follow-up` exists.
