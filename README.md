# Check the Lease

A free AI tool that reads a US residential lease and explains it in plain English, so renters understand what they are signing before they sign it.

**Live:** [checkthelease.com](https://checkthelease.com)

## What it does

- Upload a lease as a PDF or text file and say which state it is for
- It extracts the text, reads it against that state's tenant law, and returns:
  - the key terms (rent, deposit, late fees, notice periods and so on)
  - potential issues, each with a severity and, where one applies, the statute it rests on
  - protections the lease is missing, for the renter and for the landlord
  - questions worth asking before signing
- A chat assistant answers follow-up questions about the lease and the state's rules
- English and Spanish output

It gives legal information, not legal advice, and the prompts are written to hold that line.

## Why

Thirty-plus pages of legal language, no lawyer, no time. Most renters sign without fully understanding the terms. Check the Lease makes the document readable in a couple of minutes.

## How the state law works

The model is not asked to remember statutes. The repository carries a dataset of 527 tenant-law rules across 56 jurisdictions (50 states, DC and five territories), nearly all with a statute citation. When a lease is analysed, the rules for the selected state are placed in the prompt and the model is told to cite only from that list.

Data: `worker/data/state-previews.json`. Lookup and prompt context: `worker/states.ts`.

## Stack

- **Frontend:** React + TypeScript, built with Vite
- **API:** Hono on Cloudflare Workers
- **PDF parsing:** unpdf
- **Validation:** zod, on the intake, the chat request and the model's JSON output
- **AI:** Groq's OpenAI-compatible API (`openai/gpt-oss-120b` by default, set with the `GROQ_MODEL` variable). The provider sits behind one small module, `worker/llm.ts`.

Designed and built end to end, from the UX and interface through to the production frontend and backend.

## Project structure

```
frontend/            React + Vite app
worker/              Hono API (Cloudflare Workers)
worker/data/         State-law dataset
worker/__tests__/    Unit tests for the API layer
scripts/             Image conversion for the frontend
```

## Local development

Requires Node 22 and, for the image step, Python 3 with Pillow (`pip install Pillow`).

```bash
npm install                       # API dependencies
(cd frontend && npm install)      # frontend dependencies
npm run build:images              # generate the .webp images the frontend imports
npm run build:frontend            # build the React app into frontend/dist/public
npm run dev                       # run the worker locally (wrangler)
```

The optimised `.webp` images are generated from the source JPEGs and are not committed, so `npm run build:images` has to run once before the first frontend build.

The worker needs a `GROQ_API_KEY`. For local development put it in a `.dev.vars` file, which is git-ignored.

## Tests

```bash
npm test            # unit tests (vitest)
npm run typecheck   # TypeScript, API layer
```

The tests cover state lookup, the request and response schemas, and the integrity of the state-law dataset. They run on every push and pull request.

## Deploy

```bash
npm run build:frontend
npm run deploy      # wrangler deploy
```

---

Built by [Ishmael McCalla](https://ishmaelmccalla.com).
