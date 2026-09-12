# VidScribe AI

An AI-powered content repurposing platform. Paste a YouTube URL, and VidScribe retrieves the transcript and turns it into 14 formats of content — SEO blog posts, social captions, study materials, and more — each customizable by word count, tone, audience, and language, editable, regeneratable, and exportable.

Built as a full-stack portfolio project demonstrating authentication, REST API design, configurable/extensible architecture, third-party AI integration, and a production-style React frontend with a public marketing site plus an authenticated app.

## Features

- **Public landing page** — hero with a direct YouTube URL input, how-it-works flow, format showcase, features, use cases, and FAQ, fully responsive
- **Authentication** — register/login/logout with JWT, bcrypt password hashing, protected routes, profile editing, and password change
- **YouTube processing** — paste a URL, get the transcript fetched, cleaned, and stored
- **14 AI content formats**, grouped into four categories:
  - *Repurpose:* Summary, Email/Newsletter
  - *SEO & Marketing:* SEO Blog, YouTube Description, FAQ, SEO Pack (keywords/title options/meta descriptions/hashtags)
  - *Social Media:* LinkedIn Post, X Thread, Instagram Caption
  - *Study & Learning:* Study Notes, MCQs, Flashcards, Key Takeaways, Action Items
- **Custom generation parameters** — target word count (presets or custom), tone, target audience, language (English/Hindi/Marathi or custom), and free-text custom instructions, all of which actually shape the AI prompt
- **Content Packs** — select any combination of formats and generate them together in one batch request
- **Result experience per format** — copy to clipboard, inline edit & save, regenerate, or regenerate as shorter/more detailed/simpler/more professional
- **Export** — download any generated content as Markdown (.md) or Word (.docx)
- **Dashboard** — real counts and recent activity computed from actual data
- **History** — search, filter by status, and sort your processed videos
- **Analytics** — content-type breakdown, status breakdown, and a 14-day activity chart, all from real data (no charting library dependency — built with plain CSS)
- **Dark-mode-ready UI** built with Tailwind CSS v4 and shadcn/ui components, sidebar navigation, skeleton loaders, and toast notifications

## Architecture note: configurable content types

Every content format is defined once, in `backend/src/config/contentTypes.js` — its label, category, prompt instructions, expected JSON shape, and whether it supports a word-count parameter. `ai.service.js` has a single `generateContent(type, transcript, params)` function that reads this registry to build the prompt and parse the result; there is no per-format generation function to duplicate. Adding a new content type means adding one entry to the registry (plus one small React display component for how it renders) — not touching the controller, routes, or AI service.

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS v4, shadcn/ui (Radix primitives), React Router, TanStack Query, Axios
**Backend:** Node.js, Express 5, MongoDB + Mongoose
**Auth:** JWT, bcryptjs
**AI:** Groq (OpenAI-compatible API, free tier) — swappable for OpenAI directly by changing the base URL in `ai.service.js`
**Transcripts:** `youtube-transcript`
**Export:** `docx` (Word generation), plain-text Markdown

## Project Structure

```
vidscribe-ai/
├── backend/
│   └── src/
│       ├── config/          # contentTypes.js — the content-type/prompt registry
│       ├── controllers/     # auth, video, content, dashboard, analytics, export
│       ├── middleware/      # auth (JWT), error handling, request validation
│       ├── models/          # User, Video, Transcript, GeneratedContent
│       ├── routes/
│       ├── services/        # youtube.service.js, ai.service.js (Groq, generic per-type generation)
│       ├── utils/           # helpers: tokens, async wrapper, markdown formatting
│       └── validators/
└── frontend/
    └── src/
        ├── components/
        │   ├── content/      # per-format display components + ContentCardShell (copy/edit/regenerate/export), GenerationOptions, ContentPackSelector
        │   ├── landing/      # Navbar, Footer for the public site
        │   └── ui/           # shadcn/ui primitives (some hand-written to match this project's radix-ui import convention)
        ├── context/          # AuthContext, ToastContext
        ├── hooks/            # React Query hooks
        ├── layouts/          # AppLayout (authenticated app shell)
        ├── pages/            # Landing, Login, Register, Dashboard, ProcessVideo, VideoDetail, History, Analytics, Profile
        └── services/         # API client wrappers
```

## Setup

### Prerequisites
- Node.js 20+
- A MongoDB connection string (MongoDB Atlas free tier works)
- A Groq API key (free, no credit card — console.groq.com)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, GROQ_API_KEY, FRONTEND_URL
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# set VITE_API_BASE_URL if not using the default localhost:5000/api
npm run dev
```

## Environment Variables

**backend/.env**
| Variable | Description |
|---|---|
| `PORT` | Backend port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string for signing JWTs |
| `GROQ_API_KEY` | Groq API key (free tier) |
| `FRONTEND_URL` | Deployed frontend origin, used to restrict CORS in production. Leave unset in development to allow all origins. |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |

## API Overview

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
PUT    /api/auth/change-password

POST   /api/videos/process
GET    /api/videos?search=&status=&sort=
GET    /api/videos/:id
DELETE /api/videos/:id

GET    /api/content/types                 (public — powers the landing page's format showcase)
POST   /api/content/:type                 (body: { videoId, params }) — generate/regenerate one format
POST   /api/content/batch                 (body: { videoId, types: [...], params }) — Content Packs
PUT    /api/content/item/:id              (body: { content }) — manual edit/save

GET    /api/export/:videoId/:type/markdown
GET    /api/export/:videoId/:type/docx

GET    /api/dashboard/stats
GET    /api/analytics
```

`params` accepted by generation endpoints: `{ wordCount, tone, audience, language, customInstructions, regenerateOption }` (`regenerateOption` is one of `shorter | detailed | simpler | professional`).

All routes except `/api/auth/register`, `/api/auth/login`, and `/api/content/types` require an `Authorization: Bearer <token>` header.

## Deployment

**Backend (Render):** connect the repo, set root directory to `backend`, build command `npm install`, start command `npm start`, add all backend env vars above (set `NODE_ENV=production` and `FRONTEND_URL` to your deployed Vercel URL).

**Frontend (Vercel):** connect the repo, set root directory to `frontend`, framework preset Vite, add `VITE_API_BASE_URL` pointing to your deployed Render backend + `/api`. A `vercel.json` rewrite rule is included so client-side routes (e.g. refreshing `/dashboard` directly) don't 404.

**Database (MongoDB Atlas):** free M0 tier is sufficient; allow network access from `0.0.0.0/0` (or Render's specific egress IPs, if you want to lock it down further).

## Known Limitations

- Transcript fetching depends on the video having YouTube-provided or auto-generated captions available; videos without captions, or private/age-restricted videos, will fail with a clear error and are still recorded in history with a `failed` status.
- AI generation runs on Groq's free tier, which is rate-limited; heavy usage (especially large Content Packs) may hit those limits — shown as a clear per-format error, not a silent failure.
- DOCX export uses a simple line-by-line Markdown-to-paragraph conversion (headings vs. body text) rather than full Markdown rendering — bold/italic/lists within the body text render as plain text in the Word doc, not as Word formatting.
- Editing structured (non-plain-text) content types is done via a raw JSON textarea rather than a dedicated field-by-field editor — functional, but not the friendliest UI for non-technical users.
- No YouTube video metadata (title/thumbnail) is fetched — videos are identified by their URL, since that would need a separate YouTube Data API key.
- Analytics charts are hand-built with CSS rather than a charting library, to avoid an unnecessary dependency — functional but simple (no tooltips beyond native `title` attributes, no zoom/pan).
- Language quality for Hindi/Marathi/other non-English output depends entirely on the underlying AI model's fluency in that language.

## License

Personal/academic portfolio project.
