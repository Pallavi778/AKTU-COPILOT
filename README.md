# 🎓 AKTU Academic Copilot

AKTU Academic Copilot is a full-stack academic assistance platform designed specifically for students of Dr. A.P.J. Abdul Kalam Abdul Kalam Technical University (AKTU).

The platform brings important academic resources together in one place, including Previous Year Question Papers (PYQs), PYQ analytics, notes, scholarships, student profiles, and an AI-powered paper predictor.

## 🌐 Live Demo

🚀 **Live Project:** https://aktu-copilot.vercel.app

---

## ✨ Features

### 📚 PYQ Repository

- Browse Previous Year Question Papers
- Filter papers based on semester, subject, branch, and year
- Access organized question paper resources
- Helps students prepare using previous examination patterns

### 📊 PYQ Analytics

- Analyze patterns across previous year papers
- Identify frequently appearing topics
- View subject-wise examination trends
- Helps students understand important areas for preparation

### 🤖 AI Paper Predictor

- Uses previous year question papers available in the backend
- Analyzes historical paper patterns
- Generates predicted topics and possible questions
- Helps students prioritize their preparation

> ⚠️ **Disclaimer:** AI predictions are not guaranteed to appear in the actual examination. Predictions are generated based on patterns and information available in the previous year papers stored in the backend.

### 📝 Notes Repository

- Access academic notes through the platform
- Organized according to available subjects and academic resources
- Provides students with additional preparation material

### 🎓 Scholarship Hub

- Provides scholarship-related information
- Displays scholarship opportunities and relevant details
- Helps students discover financial assistance opportunities

### 👤 Student Profile

- Student registration and login
- Secure authentication
- Personalized student profile
- Semester and branch information

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- Mongoose
- JWT Authentication
- bcryptjs

### Database & Storage

- MongoDB Atlas
- Cloudinary

### AI

- Google Gemini API

### Deployment

- Vercel — Frontend
- Render — Backend

---

## 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │      Student     │
                         └────────┬─────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │    React + Vite        │
                     │       Frontend         │
                     │        Vercel          │
                     └────────────┬───────────┘
                                  │
                             REST API
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │    Node.js + Express   │
                     │        Backend         │
                     │         Render         │
                     └──────────┬─────┬───────┘
                                │     │
                    ┌───────────┘     └────────────┐
                    ▼                              ▼
          ┌──────────────────┐           ┌──────────────────┐
          │   MongoDB Atlas  │           │    Cloudinary    │
          │  Application DB  │           │  File Storage    │
          └──────────────────┘           └──────────────────┘
                                │
                                ▼
                     ┌────────────────────────┐
                     │    Google Gemini API   │
                     │     AI Prediction      │
                     └────────────────────────┘