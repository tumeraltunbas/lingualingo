# LinguaLingo

A desktop translation app powered by [DeepL](https://www.deepl.com/) and [Google Translate](https://cloud.google.com/translate). Built with Electron, React, and NestJS.

---

## Tech Stack

| Layer                 | Technology                               |
| --------------------- | ---------------------------------------- |
| Desktop shell         | Electron 41                              |
| Frontend              | React 19, Vite, TypeScript, Tailwind CSS |
| Backend               | NestJS, TypeScript                       |
| Translation providers | DeepL API, Google Translate API          |

---

## Project Structure

```
lingualingo/
├── backend/      ← NestJS API server
└── frontend/     ← React + Electron desktop app
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [DeepL API key](https://www.deepl.com/pro-api) and/or a [Google Cloud Translation API key](https://cloud.google.com/translate/docs/setup)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tumeraltunbas/lingualingo.git
cd lingualingo
```

### 2. Set up the backend

```bash
cd backend
npm install
```

The backend works without a `.env` file for local development — it uses sensible defaults (`PORT=8080`, `WEB_BASE_URL=http://localhost:5173`). If you want to override them, copy the example file:

```bash
cp .env.example .env
```

| Variable       | Default                 | Description                             |
| -------------- | ----------------------- | --------------------------------------- |
| `PORT`         | `8080`                  | Port the API server listens on          |
| `WEB_BASE_URL` | `http://localhost:5173` | Allowed CORS origin (your frontend URL) |

Start the backend:

```bash
npm run start:dev
```

The server will be available at `http://localhost:8080`.

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Update the API base URL in `src/constants/api.ts` if your backend runs on a port other than `8080`:

```ts
export const API_BASE = "http://localhost:8080";
```

To run in the browser:

```bash
npm run dev
```

To run as a desktop app:

```bash
npm run dev:electron
```

The `dev:electron` command will start the Vite dev server and launch the Electron window automatically.

---

## API Keys

Every time you start the app, you will be prompted to enter your API key. For security reasons, the key is never persisted. It is not saved to localStorage, sessionStorage, or any file on disk. It exists only in memory for the duration of the session and is passed directly to the provider API with each request.

> **You are solely responsible for your API key usage and any associated costs.** Each provider has its own free tier limits and billing policies. Exceeding free limits will result in charges on your account. Please read the pricing and usage policies of each provider carefully before use. This project and its contributors are not responsible for any charges incurred.

## License

MIT
