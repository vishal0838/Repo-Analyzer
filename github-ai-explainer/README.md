# GitHub Codebase AI Analyzer

GitHub Codebase AI Analyzer is a full-stack web application that turns a public GitHub repository URL into a readable technical overview. It gathers repository metadata, README content, and a file-tree snapshot from the GitHub API, then asks Gemini to produce a structured analysis for the interface.

The application is designed for quickly understanding an unfamiliar codebase before cloning it or reading its source.

## Features

- Analyze any public GitHub repository from its URL.
- Display repository metadata such as its description, primary language, stars, forks, and open issues.
- Generate an AI summary of the repository and its likely purpose.
- Surface an inferred technology stack, key features, and architecture overview.
- Open an interactive directory-tree modal from the returned repository structure.
- Link directly back to the analyzed repository on GitHub.
- Handle invalid URLs, missing repositories, and AI-provider failures with user-facing errors or safe fallback data.

## Tech stack

| Area | Technology |
| --- | --- |
| Client | React 19, Vite, Tailwind CSS |
| UI icons | Lucide React |
| Server | Node.js, Express 5 |
| External data | GitHub REST API |
| AI analysis | Google Gemini via `@google/genai` |
| HTTP client | Axios |

## Project structure

```text
github-ai-explainer/
├── client/                         # React and Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx            # URL input and analysis request flow
│   │   │   ├── Repocard.jsx        # Repository and AI-analysis presentation
│   │   │   └── DirectoryTree.jsx   # Interactive file-tree modal
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                         # Express API
│   ├── controllers/
│   │   └── repositoryController.js # GitHub fetching and response shaping
│   ├── routes/
│   │   └── repositoryRoutes.js     # API route definitions
│   ├── utils/
│   │   └── aiHelper.js             # Gemini prompting and fallback handling
│   ├── index.js                    # Express server entry point
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- A Gemini API key
- Optional: a GitHub personal access token to reduce GitHub API rate-limit issues

## Getting started

1. Clone the repository and enter the application folder.

   ```bash
   git clone <your-repository-url>
   cd github-ai-explainer
   ```

2. Install server dependencies.

   ```bash
   cd server
   npm install
   ```

3. Create `server/.env` with your local credentials.

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   # Optional, but recommended for higher GitHub API limits
   GITHUB_TOKEN=your_github_personal_access_token
   ```

4. Start the server. It listens on `http://localhost:3000`.

   ```bash
   npm start
   ```

5. In a second terminal, install and start the client.

   ```bash
   cd client
   npm install
   npm run dev
   ```

6. Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

## How it works

```text
Browser
  │ POST /api/repository/analyze { url }
  ▼
Express server
  ├── Fetches repository metadata, README, and file tree from GitHub
  ├── Sends selected context to Gemini
  └── Returns metadata and a structured AI analysis
  ▼
React repository card and directory-tree modal
```

The server limits the file-tree and README context sent to the model, helping keep requests focused and reasonably sized. If Gemini cannot return an analysis, the server supplies a fallback response so basic repository information can still be displayed.

## API reference

### `POST /api/repository/analyze`

Analyzes a public GitHub repository.

Request body:

```json
{
  "url": "https://github.com/facebook/react"
}
```

Successful response shape:

```json
{
  "success": true,
  "data": {
    "name": "react",
    "owner": "facebook",
    "description": "The library for web and native user interfaces.",
    "stars": 0,
    "forks": 0,
    "openIssues": 0,
    "language": "JavaScript",
    "htmlUrl": "https://github.com/facebook/react",
    "aiAnalysis": {
      "summary": "...",
      "techStack": ["..."],
      "keyFeatures": ["..."],
      "directoryStructure": "...",
      "setupGuide": ["..."],
      "architectureOverview": "..."
    }
  }
}
```

Errors use an `error` field and an appropriate HTTP status code. Examples include a missing or invalid GitHub URL, a repository that cannot be retrieved, or an upstream service failure.

### `GET /api/health`

Returns a simple server health response.

```json
{
  "status": "OK",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Available commands

### Client

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Creates a production client build. |
| `npm run preview` | Serves the production build locally. |
| `npm run lint` | Runs ESLint over the client source. |

### Server

| Command | Description |
| --- | --- |
| `npm start` | Starts the Express server. |
| `npm run dev` | Starts the server through Nodemon, if available. |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Authenticates requests to Gemini for codebase analysis. |
| `GITHUB_TOKEN` | No | Authenticates GitHub requests and raises API rate limits. |

Do not commit `.env` files. Both the client and server include `.gitignore` rules to protect local environment files.

## Troubleshooting

### `ERR_CONNECTION_REFUSED` or `Failed to fetch`

Start the server with `npm start` from the `server` directory. The client expects the API at `http://localhost:3000/api/repository/analyze`.

### GitHub rate-limit or repository errors

Verify the repository URL is public and valid. Add `GITHUB_TOKEN` to `server/.env` if unauthenticated GitHub API limits are reached.

### Gemini analysis is unavailable

Confirm `GEMINI_API_KEY` is set in `server/.env`, then restart the server. The UI can still render repository metadata when the server returns its fallback AI-analysis object.

### Vite import/export errors

Confirm component imports match their exported names. For example, `DirectoryTree.jsx` exposes `DirectoryTreeModal` as a named export:

```js
import { DirectoryTreeModal } from "./DirectoryTree";
```

## Security notes

- Only public GitHub repository URLs should be submitted.
- API keys belong in `server/.env`, never in client-side code.
- A GitHub token should use the minimum scopes necessary for the repositories being analyzed.
- Before deployment, restrict CORS to the production client origin rather than allowing every origin.

## Future improvements

- Add repository-analysis history and saved reports.
- Cache GitHub and AI responses to reduce latency and API consumption.
- Add authentication for private analysis history.
- Render the generated setup guide in the repository card.
- Add automated tests for the API controller and UI components.

## License

No license has been defined yet. Add a `LICENSE` file before distributing or accepting external contributions.
