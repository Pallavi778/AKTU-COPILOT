# AKTU Academic Copilot

AKTU Academic Copilot is an AI-ready, full-stack academic assistant platform tailored for AKTU university engineering students. It consolidates Previous Year Papers (PYQs), chapter notes, scholarship updates, and university circulars, and features simulated viva examinations, predictive paper analytics, and algorithmic study planner timelines.

---

## Folder Structure

```
aktu-academic-copilot/
├── server/                 # Express Backend Server
│   ├── config/             # DB Connection Config
│   ├── controllers/        # Route logic (Auth, PYQs, Notes, Mock AI, etc.)
│   ├── middleware/         # Auth guarding
│   ├── models/             # Mongoose schemas (User, Subject, PYQ, Notes, etc.)
│   ├── routes/             # Route definitions
│   ├── scripts/            # DB seed scripts
│   ├── uploads/            # Organized static upload folders (pyqs/, notes/)
│   └── index.js            # Server entry bootstrap
└── client/                 # React Frontend Client (Vite + Tailwind CSS)
    ├── src/
    │   ├── components/     # Reusable layout guards and loaders
    │   ├── context/        # User Authentication context state
    │   ├── layouts/        # Responsive dashboard layout
    │   ├── pages/          # All functional dashboard pages
    │   ├── services/       # Axios API integration
    │   ├── index.css       # Core Tailwind CSS imports & animations
    │   └── App.jsx         # Router setup
    ├── index.html          # Web entry markup
    └── tailwind.config.js  # Color schemes & UI animations setup
```

---

## Technical Specifications & Features

### 1. Authentication Module
- User records containing `name`, `email`, `password` (encrypted with `bcryptjs`), engineering `branch`, and active `semester`.
- Secure protected endpoints using JWT authentication tokens stored in LocalStorage.

### 2. Document Repositories (PYQ & Notes)
- Organized static document directories (`uploads/pyqs/` and `uploads/notes/`).
- Multer-based file upload pipelines accepting PDF documents.
- Query filters supporting branch categorization, semesters, subject codes, and search keywords.

### 3. Analytics & Mock AI Services (No External API Keys Needed)
- **AI Assistant**: Conversations focused on subject contexts, containing preset university queries and streaming message bubbles.
- **PYQ Analytics**: High-fidelity subject statistics, topic recurrence graphs, and unit distributions utilizing responsive custom SVG graphics.
- **Viva Prep**: Step-by-step testing terminals evaluating textual explanations, rendering inline technical grades, and producing scorecard summaries.
- **Study Planner**: Generates check-off milestones, daily study timelines, and coverage checklists based on target exam dates and subjects.
- **Scholarships & Notices**: Tracks announcement timelines, eligibility criteria, and remaining application countdowns.

---

## Step-by-Step Installation & Run Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB (Local instance running on `mongodb://127.0.0.1:27017` OR a MongoDB Atlas connection string)

### 1. Server Setup
Navigate into the `server` directory, create a `.env` configuration file, install packages, and populate the database with seed data.

```bash
cd server
```

Create a `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aktu-copilot
JWT_SECRET=aktu_copilot_super_secret_key
```

Install dependencies:
```bash
npm install
```

Seed the database (Populates standard engineering subjects, circulars, scholarships, papers, and writes static PDF placeholders):
```bash
npm run seed
```

Start the dev server:
```bash
npm run dev
```

The backend server will launch on `http://localhost:5000`.

### 2. Client Setup
Navigate into the `client` directory, install package dependencies, and start the Vite dev server.

```bash
cd ../client
npm install
npm run dev
```

The React dashboard application will hot-reload on `http://localhost:5173`. Open this URL in your web browser.

---

## Key REST API Endpoints

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new student | No |
| **POST** | `/api/auth/login` | Student login | No |
| **GET** | `/api/auth/profile` | Retrieve user profile details | **Yes** |
| **PUT** | `/api/auth/profile` | Update profile information | **Yes** |
| **GET** | `/api/subjects` | Fetch subjects list (supports branch/sem filters) | No |
| **GET** | `/api/pyqs` | Fetch past examination papers list | No |
| **POST** | `/api/pyqs` | Upload new exam PDF | **Yes** |
| **GET** | `/api/notes` | Fetch notes catalog list | No |
| **POST** | `/api/notes` | Upload new study notes PDF | **Yes** |
| **GET** | `/api/scholarships` | Fetch available scholarship opportunities | No |
| **GET** | `/api/notices` | Fetch university circulars feed | No |
| **POST** | `/api/ai/chat` | Get contextual chatbot answers | **Yes** |
| **GET** | `/api/ai/analytics/:code` | Get topic frequency and unit weightages | **Yes** |
| **GET** | `/api/ai/predictions/:code` | Get predicted exam topics list | **Yes** |
| **POST** | `/api/ai/viva/start` | Start mock viva examination | **Yes** |
| **POST** | `/api/ai/viva/submit` | Grade viva response and retrieve next question | **Yes** |
| **POST** | `/api/ai/planner` | Create study schedule checklist | **Yes** |
