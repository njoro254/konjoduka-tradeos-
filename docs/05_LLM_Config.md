# LLM Orchestration & Audit

## Strategy
KonjoDuka uses `LiteLLM` to provide a unified interface for multiple providers.

### Configuration
- **Primary:** GPT-4o (Policy extraction, complex matchmaking).
- **Secondary:** Gemini 1.5 Pro (Large document analysis).
- **Tertiary:** Llama 3 (Local/fallback for basic translations).

### Features
- **Prompt Caching:** Redis-based caching (24h) for frequent queries (e.g., "How to export tomatoes to Ethiopia?").
- **Audit Logging:** Every prompt is logged with:
  - Timestamp
  - User ID (or Guest IP)
  - Tokens used
  - Model provider
  - Calculated cost (USD)

### Dynamic Sourcing
- LLM scrapes KRA and Ethiopian Customs websites monthly.
- Converts raw HTML/PDF into structured JSON for the Policy Engine.