# VedaAI Assessment Creator

> An AI-powered examination paper generator. Describe your assignment, and VedaAI produces a fully structured, print-ready question paper in seconds — with real-time progress updates.

**Live App Demo:** [https://vedaai-frontend.onrender.com/](https://vedaai-frontend.onrender.com/)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [AI Generation Flow](#ai-generation-flow)
- [Future Improvements](#future-improvements)

---

## Overview

VedaAI Assessment Creator allows educators to define assignment parameters (question types, marks, difficulty, due date) and instantly generate a complete, formatted exam paper using Google Gemini. The generation runs as a background job — thanks to BullMQ — so the API responds instantly while the AI works asynchronously. Once complete, the client is notified via WebSocket with no polling required.

---

## Architecture

```
Browser (Next.js)
      │
      │  POST /api/v1/assignments
      ▼
Express API Server
      │
      │  Creates Assignment document (status: pending)
      │  Adds job to BullMQ queue
      │  Returns 202 immediately
      ▼
Redis (BullMQ Queue)
      │
      ▼
Question Generation Worker
      │  Builds prompt → calls Gemini API
      │  Parses and validates JSON response
      │  Updates MongoDB (status: completed)
      │  Emits "assignment_done" via Socket.io
      ▼
Socket.io → Browser
      │
      ▼
Next.js re-fetches assignment → renders exam paper
```

---

## Features

- **Assignment Creation Form** — Configurable question types, marks, due date, and instructions with input validation
- **AI Question Generation** — Powered by Google Gemini; produces structured JSON with sections, questions, difficulty levels, and marks
- **Background Queue Processing** — BullMQ workers handle AI calls asynchronously; no blocking API responses
- **Real-time Updates** — Socket.io emits `assignment_done` directly to the connected client room; no polling
- **Exam Paper UI** — Clean, print-ready exam layout with section headers, formatted questions, and difficulty badges
- **PDF Export** — One-click browser native print-to-PDF preserving all formatting
- **Failure Handling** — BullMQ retry logic with configurable backoff; graceful error propagation
- **Duplicate Index Warning Fix** — Mongoose schema carefully designed to avoid index conflicts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Zustand |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB + Mongoose |
| Queue | BullMQ + Redis |
| Real-time | Socket.io |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| Dev Tools | ts-node-dev, nodemon, ESLint |

---

## Folder Structure

```
VedaAI/
├── backend/
│   ├── src/
│   │   ├── config/          # env, database, redis, bullmq configs
│   │   ├── controllers/     # Express route handlers
│   │   ├── middlewares/     # Validation, error handling, notFound
│   │   ├── models/          # Mongoose schemas (Assignment, User)
│   │   ├── queues/          # BullMQ queue definitions
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Business logic (AI generation, assignment)
│   │   ├── sockets/         # Socket.io event handlers
│   │   ├── workers/         # BullMQ workers
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # HTTP server + Socket.io bootstrap
│   ├── .env
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── assignment/
    │   │   ├── new/         # Assignment creation page
    │   │   └── [id]/        # Assignment output page
    │   ├── groups/          # Stub page
    │   ├── library/         # Stub page
    │   ├── layout.tsx
    │   └── globals.css
    ├── components/
    │   ├── layout/Sidebar.tsx
    │   ├── AssignmentForm.tsx
    │   ├── AssignmentOutput.tsx
    │   ├── DownloadPdfButton.tsx
    │   └── ExamPaper.tsx
    ├── hooks/               # useAssignment, useAssignmentSocket
    ├── lib/                 # Socket.io singleton
    ├── services/            # API service layer
    ├── store/               # Zustand store
    ├── types/               # Shared TypeScript types
    ├── .env.local
    └── package.json
```

---

## Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB (local or cloud)
- Redis (local)
- Google Gemini API key — [Get one here](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vedaai.git
cd vedaai
```

### 2. Redis Setup (macOS)

```bash
brew install redis
brew services start redis

# Verify it's running
redis-cli ping
# → PONG
```

### 3. MongoDB Setup (macOS)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify
mongosh --eval "db.runCommand({ connectionStatus: 1 })"
```

### 4. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables)), then:

```bash
npm run dev
# → http://localhost:3000/api/v1/health
```

### 5. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file (see below), then:

```bash
npm run dev
# → http://localhost:3001
```

---

## Environment Variables

### Backend — `backend/.env`

```env
# Application
NODE_ENV=development
PORT=3000

# MongoDB
MONGO_URI=your mongo db uri

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# CORS — comma-separated allowed origins
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

## Running Locally

Run the backend and frontend in **separate terminals**:

```bash
# Terminal 1 — Backend (port 3000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3001)
cd frontend && npm run dev
```

Open **http://localhost:3001** in your browser.

> **Production build:**
> ```bash
> cd frontend && npm run build && npm run start
> ```

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/assignments` | Create a new assignment |
| `GET` | `/assignments` | Fetch all assignments |
| `GET` | `/assignments/:id` | Fetch assignment by ID |
| `PATCH` | `/assignments/:id` | Update an assignment |
| `DELETE` | `/assignments/:id` | Delete an assignment |
| `POST` | `/assignments/generate/:id` | Trigger AI question generation (fire-and-forget → returns 202) |

### Example: Create Assignment

```bash
curl -X POST http://localhost:3000/api/v1/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Physics Mid-Term",
    "dueDate": "2026-06-01",
    "questionTypes": ["mcq", "short_answer"],
    "numQuestions": 10,
    "marks": 50,
    "instructions": "Focus on thermodynamics and optics"
  }'
```

### Example: Trigger Generation

```bash
curl -X POST http://localhost:3000/api/v1/assignments/generate/<assignment_id>
# Returns 202 Accepted immediately
# Client receives "assignment_done" event via Socket.io when ready
```

---

## AI Generation Flow

1. **Trigger:** `POST /assignments/generate/:id` adds a job to the `question-generation` BullMQ queue and returns `202` instantly.

2. **Worker:** The BullMQ worker picks up the job and calls `generateQuestionsWithAI()`.

3. **Prompt:** A structured prompt is sent to Gemini, instructing it to return a strict JSON schema:
    ```json
    {
      "sections": [
        {
          "title": "Multiple Choice Questions",
          "instruction": "Choose the best answer",
          "questions": [
            { "text": "...", "difficulty": "easy", "marks": 2 }
          ]
        }
      ]
    }
    ```

4. **Parsing:** The raw response is sanitized (markdown fences stripped), validated against the expected shape, and stored in MongoDB.

5. **Notification:** Once saved, the backend emits `assignment_done` via Socket.io to the client's room (`join:room` → `assignmentId`).

6. **UI Update:** The frontend's `useAssignmentSocket` hook detects the event, re-fetches the assignment from MongoDB, and updates the Zustand store — rendering the exam paper instantly.

**Failure handling:** If Gemini fails or returns invalid JSON, the BullMQ job is marked as failed. The worker respects the API's `Retry-After` header for rate-limit errors.

---

## Future Improvements

- **File Parsing** — Extract text from uploaded PDFs/DOCX to use as AI context for more accurate questions
- **Assignment History Page** — A `/assignments` dashboard listing all created papers
- **Auth & Multi-tenancy** — JWT-based auth so educators have private assignment libraries
- **Export Formats** — DOCX export in addition to PDF
- **Question Bank** — Save and reuse generated questions across multiple assignments
- **Difficulty Distribution Control** — Let users specify desired easy/medium/hard ratios
- **Websocket Failure State** — Emit `assignment_failed` event if the worker exhausts retries, allowing the client to show a retry button

---

> Built with ❤️ for educators. Powered by Google Gemini.
