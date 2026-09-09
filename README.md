# VidScribe AI

An AI-powered content intelligence platform. Paste a YouTube URL, and VidScribe retrieves the transcript and generates six formats of content from it: an SEO blog post, a summary, a LinkedIn post, an X (Twitter) thread, study notes, and multiple-choice quiz questions. All generated content is saved and exportable as Markdown or Word (.docx).

Built as a full-stack portfolio project demonstrating authentication, REST API design, third-party AI integration, and a production-style React frontend.

## Features

- **Authentication** — register/login/logout with JWT, bcrypt password hashing, protected routes, profile editing, and password change
- **YouTube processing** — paste a URL, get the transcript fetched, cleaned, and stored
- **AI content generation** — Summary, SEO Blog (title/meta/slug-ready/FAQs/reading time), LinkedIn post, X thread, Study Notes, and MCQs, each independently generatable/regeneratable
- **Dashboard** — real counts (videos processed, blogs generated, total content generated) and recent activity, computed from actual data
- **History** — list of all processed videos with status, with delete
- **Export** — download any generated content as Markdown (.md) or Word (.docx)
- **Analytics API** — content-type breakdown and 14-day activity, available at `GET /api/analytics`
- **Dark-mode-ready UI** built with Tailwind CSS v4 and shadcn/ui components, sidebar navigation, skeleton loaders, and toast notifications

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
│       ├── config/         # DB connection
│       ├── controllers/    # auth, video, content, dashboard, analytics, export
│       ├── middleware/     # auth (JWT), error handling, request validation
│       ├── models/         # User, Video, Transcript, GeneratedContent
│       ├── routes/
│       ├── services/       # youtube.service.js, ai.service.js (Groq)
│       ├── utils/          # helpers: tokens, async wrapper, markdown formatting
│       └── validators/
└── frontend/
    └── src/
        ├── components/     # shared UI (shadcn) + content/ (per-format display cards)
        ├── context/        # AuthContext, ToastContext
        ├── hooks/          # React Query hooks
        ├── layouts/        # AppLayout (sidebar shell)
        ├── pages/          # Login, Register, Dashboard, ProcessVideo, VideoDetail, History, Profile
        └── services/       # API client wrappers
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
GET    /api/videos
GET    /api/videos/:id
DELETE /api/videos/:id

POST   /api/content/summary
POST   /api/content/blog
POST   /api/content/:type      (type: linkedin | twitter | notes | mcq)

GET    /api/export/:videoId/:type/markdown
GET    /api/export/:videoId/:type/docx

GET    /api/dashboard/stats
GET    /api/analytics
```

All routes except `/api/auth/register` and `/api/auth/login` require an `Authorization: Bearer <token>` header.

## Deployment

**Backend (Render):** connect the repo, set root directory to `backend`, build command `npm install`, start command `npm start`, add all backend env vars above (set `NODE_ENV=production` and `FRONTEND_URL` to your deployed Vercel URL).

**Frontend (Vercel):** connect the repo, set root directory to `frontend`, framework preset Vite, add `VITE_API_BASE_URL` pointing to your deployed Render backend + `/api`. A `vercel.json` rewrite rule is included so client-side routes (e.g. refreshing `/dashboard` directly) don't 404.

**Database (MongoDB Atlas):** free M0 tier is sufficient; allow network access from `0.0.0.0/0` (or Render's specific egress IPs, if you want to lock it down further).

## Known Limitations

- Transcript fetching depends on the video having YouTube-provided or auto-generated captions available; videos without captions, or private/age-restricted videos, will fail with a clear error and are still recorded in history with a `failed` status.
- AI generation runs on Groq's free tier, which is rate-limited; heavy usage may hit those limits (visible as a clear error, not a silent failure).
- DOCX export uses a simple line-by-line Markdown-to-paragraph conversion (headings vs. body text) rather than full Markdown rendering — bold/italic/lists within the body text render as plain text in the Word doc, not as Word formatting.
- No YouTube video metadata (title/thumbnail) is fetched — videos are identified by their URL, not a fetched title, since that would need a separate YouTube Data API key.
- Single free-tier AI model; no per-request model selection.

## License

Personal/academic portfolio project.
