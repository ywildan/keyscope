# KeyScope

**Map every AI model accessible through an API key—in seconds.**

KeyScope is a privacy-first, OpenAI-compatible model discovery tool. Enter an API key, choose a provider, and KeyScope calls its `/models` endpoint through a small Vercel serverless proxy. Results are grouped into language, embedding, and other models with one-click copy actions.

![KeyScope](https://img.shields.io/badge/KeyScope-Model%20Intelligence-64E9FF?style=for-the-badge&labelColor=070A12)
[![License](https://img.shields.io/badge/License-MIT-77F5BB?style=for-the-badge)](LICENSE)

## Highlights

- **Instant model mapping** — inspect the complete model surface exposed by a key.
- **Privacy-first flow** — keys are forwarded for the request only; KeyScope does not store them.
- **Interactive control-room UI** — live scan state, animated visual system, search filtering, and copy feedback.
- **Automatic grouping** — language, embedding, and other model families are easy to scan.
- **OpenAI-compatible by default** — use a preset or any custom gateway exposing `GET /models`.
- **Clear failure states** — invalid keys, permission errors, rate limits, missing routes, and upstream failures are translated into readable messages.

## Supported providers

| Provider | Default base URL |
| --- | --- |
| OpenAI | `https://api.openai.com/v1` |
| DeepSeek | `https://api.deepseek.com/v1` |
| Groq | `https://api.groq.com/openai/v1` |
| OpenRouter | `https://openrouter.ai/api/v1` |
| Together AI | `https://api.together.xyz/v1` |
| Mistral | `https://api.mistral.ai/v1` |
| Fireworks AI | `https://api.fireworks.ai/inference/v1` |
| Perplexity | `https://api.perplexity.ai` |
| xAI (Grok) | `https://api.x.ai/v1` |
| NVIDIA NIM | `https://integrate.api.nvidia.com/v1` |
| Anthropic | `https://api.anthropic.com/v1` |
| LiteLLM / custom gateways | Any compatible base URL |

> For New API or one-api gateways, include `/v1` in the custom base URL (for example, `https://gateway.example/v1`). KeyScope appends `/models` automatically.

## How it works

```text
Browser                 Vercel Function                  Provider
   |  POST /api/models       |  GET /v1/models + Bearer key  |
   | ----------------------> | ----------------------------> |
   | <----- models[] ------- | <--------- model data -------- |
```

The browser sends `{ apiKey, baseUrl }` to `/api/models`. The function calls the provider, normalizes common response shapes (`data`, `models`, or a raw array), and returns only sorted model IDs to the client.

## Local development

This repository has no build step and no runtime dependencies.

```bash
npx vercel dev
```

The app is deployed as a static `index.html` with `api/models.js` as a Node.js serverless function. Import the repository into [Vercel](https://vercel.com/new) or run:

```bash
npm install --global vercel
vercel --prod
```

## API reference

### `POST /api/models`

Request:

```json
{ "apiKey": "sk-...", "baseUrl": "https://api.openai.com/v1" }
```

Successful response:

```json
{ "models": ["gpt-4o", "text-embedding-3-small"], "count": 2 }
```

The function returns a readable `error` field for upstream failures and intentionally avoids persisting or logging the submitted key.

## Repository layout

```text
keyscope/
├── index.html       # Static UI, styles, animations, and client logic
├── api/models.js    # Vercel serverless proxy
├── vercel.json      # Function configuration
├── README.md
└── LICENSE
```

## License

Released under the [MIT License](LICENSE).
