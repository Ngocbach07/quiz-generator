---
title: QuizHub
emoji: 🧠
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
license: mit
short_description: AI quiz generator with BYOK + multi-doc + model scan
---

# QuizHub — AI Quiz/MCQ Generator

A self-hosted web application that generates multiple-choice quizzes from documents, text, and URLs using your own LLM API key (**BYOK**).

## Features

- **Multi-document input**: Upload multiple PDFs / DOCX / TXT / PPTX / MD files, paste text, or fetch from a URL — all sources are concatenated into one quiz.
- **Model scan**: After entering your API key + Base URL, click **Scan models** to fetch the list of available models from your OpenAI-compatible endpoint.
- **BYOK**: Bring your own API key, Base URL, and Model — supports OpenAI, Anthropic, Gemini, DeepSeek, Ollama (any OpenAI-compatible chat/v1 endpoint).
- **Quiz options**: number of questions, single/multi choice, difficulty (easy/medium/hard/mixed).
- **Interactive quiz mode**: take quizzes with progress bar, colored feedback, explanations, and a results screen with an SVG progress ring + grade.
- **Bilingual**: English + Vietnamese (toggle in header).
- **Dark / light mode**.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

Build:

```bash
npm run build && npm start
```

## How to use

1. Upload documents (or paste text / fetch a URL) — you can add as many as you want.
2. Enter your LLM API key and Base URL (e.g. `https://api.openai.com/v1`).
3. Click **Scan models** to populate the model picker, or type a model name manually.
4. Adjust quiz options (number of questions, types, difficulty).
5. Click **Generate Quiz** and take the quiz.

Keys are sent only to your configured Base URL — they never touch anyone else's server.

## Architecture

```
quiz-generator/
├── app/
│   ├── api/
│   │   ├── generate/      # POST quiz generation proxy to your LLM
│   │   └── scan-models/   # GET /models on your LLM endpoint
│   ├── i18n/              # i18next config (en/vi in code)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/            # Header, Footer
│   ├── quiz/              # DocumentUploader, SettingsPanel, QuizView
│   └── ui/                # shadcn/ui base components
├── types/                 # Quiz, SourceDocument, LLMSettings types
├── Dockerfile             # HF Spaces / standalone Next.js
└── next.config.ts         # output: standalone
```

## Tech stack

- Next.js 16 (App Router, Turbopack, standalone output)
- React 19 + TypeScript 5
- Tailwind CSS v4 + shadcn/ui
- lucide-react icons
- i18next (EN/VI)

## License

MIT
