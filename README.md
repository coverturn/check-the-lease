<!-- Drop a screenshot or short GIF of the product here once you've generated one -->

# Check the Lease

A free AI tool that reads residential tenancy agreements and explains them in plain English, so renters understand what they're signing before they sign it.

**Live:** [checkthelease.com](https://checkthelease.com)

## What it does

- Upload a tenancy agreement as a PDF
- It extracts and reads the document
- Returns a plain-English summary, flags clauses worth a closer look, and answers questions about the lease

## Why

Thirty-plus pages of legal language, no lawyer, no time. Most renters sign without fully understanding the terms. Check the Lease makes the document readable in a couple of minutes.

## Stack

- **Frontend:** React + TypeScript, built with Vite
- **API:** Hono running on Cloudflare Workers (edge)
- **PDF parsing:** unpdf
- **Validation:** zod
- **AI:** an LLM analysis layer that reads the lease and produces the summary and flags

Designed and built end to end, from the UX and interface through to the production frontend and backend.

## Project structure

```
frontend/   React + Vite app
worker/      Hono API (Cloudflare Workers)
```

## Local development

```bash
npm install
npm run dev            # run the worker locally (wrangler)
npm run build:frontend # build the React app
npm run deploy         # deploy to Cloudflare Workers
```

---

Built by [Ishmael McCalla](https://ishmaelmccalla.com).
