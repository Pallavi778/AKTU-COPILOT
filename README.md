# AKTU Academic Copilot

AKTU Academic Copilot is a full-stack academic assistance platform made for AKTU engineering students.

The main purpose of this project is to provide students with academic resources such as Previous Year Question Papers (PYQs), notes, scholarship information, PYQ analytics and an AI-based paper predictor in one place.

## Live Project

https://aktu-copilot.vercel.app

## Features

- User registration and login
- Student profile with branch and semester details
- Previous Year Question Paper repository
- PYQ filtering based on semester, subject and year
- PYQ analytics
- Notes repository
- Scholarship information
- AI Paper Predictor
- Responsive dashboard

### AI Paper Predictor

The AI Predictor uses previous year papers available in the backend and uses Google Gemini to generate possible topics and questions based on the available paper data.

**Note:** The predicted paper is not guaranteed to be accurate. It is only based on the previous year papers available in the backend and should be used only as a preparation aid.

## Tech Stack

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
- JWT
- bcryptjs

### Database and Storage

- MongoDB Atlas
- Cloudinary

### AI

- Google Gemini API

### Deployment

- Vercel - Frontend
- Render - Backend

## Project Structure

```text
aktu-academic-copilot/
│
├── server/
│   ├── config/             # Database and service configuration
│   ├── controllers/        # Application logic
│   ├── middleware/         # Authentication and error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── scripts/            # Database scripts
│   └── index.js            # Server entry point
│
└── client/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── context/        # Authentication context
    │   ├── layouts/        # Dashboard layouts
    │   ├── pages/          # Application pages
    │   ├── services/       # API integration
    │   ├── index.css       # Global styles
    │   └── App.jsx         # Main application and routing
    │
    ├── public/             # Static files
    ├── index.html          # Main HTML file
    └── vite.config.js      # Vite configuration