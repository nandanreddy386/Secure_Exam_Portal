# Secure Exam Portal — Frontend (exam-ui)

A React frontend for the Secure Exam Portal project. This repository contains the UI for students, teachers and admins to manage and take exams. The full project includes a separate backend found in the `exam-backend` folder.

**Quick summary**: React (Create React App) frontend that communicates with a Node/Express + MongoDB backend to provide role-based exam creation, exam sessions, OTP verification and results.

**Key features**
- Role-based interfaces: Student, Teacher, Admin
- Exam creation and management (Teacher)
- Secure exam sessions for students
- OTP-based verification for authentication
- Results viewing and export

**Relevant folders**
- `public/` — static assets and manifest
- `src/` — React source code (components, styles)

## Prerequisites
- Node.js (v14+ recommended)
- npm (bundled with Node.js)
- MongoDB (local or hosted)

## Backend (exam-backend)
The backend lives in the sibling folder `exam-backend`. It uses Express and MongoDB (Mongoose).

Basic steps to install and run the backend (from project root or inside `exam-backend`):

PowerShell / Command Prompt:
```powershell
cd exam-backend
npm install
# start backend (this project provides server.js)
node server.js
```

Notes: The backend expects environment variables (create a `.env` file in `exam-backend`):
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JSON Web Token secret
- `PORT` — backend port (e.g. 5000)
- Optional email settings for OTP (SMTP credentials)

## Frontend (exam-ui)
Install and run the React app:

PowerShell / Command Prompt:
```powershell
cd exam-ui
npm install
npm start
```

This will open the app at http://localhost:3000 by default. The frontend expects the backend API to be accessible (update API base URLs in `src` if needed).

## Available Scripts
See `exam-ui/package.json` for exact scripts. Common commands:
- `npm start` — run dev server
- `npm run build` — build production bundle
- `npm test` — run tests

## Environment & Configuration
- Update API endpoints in `src` where `axios` is configured (search for the base URL). Adjust to match your backend host/port.
- Ensure `MONGO_URI` and `JWT_SECRET` are set for backend before running.

## Project structure (high-level)
- `exam-backend/` — Node/Express backend and scripts
- `exam-ui/` — React frontend (this folder)

## Contributing
If you want to improve the project:
1. Fork the repo
2. Implement changes on a branch
3. Open a pull request with a clear description

## Troubleshooting
- If the frontend cannot reach the backend, confirm the backend is running and CORS is enabled.
- For database errors, verify `MONGO_URI` and that MongoDB is reachable.

## Next steps you might want
- Add a `start` script to `exam-backend/package.json` (e.g., `"start": "node server.js"`).
- Add a `.env.example` file showing required environment variables.

---
If you'd like, I can:
- Add `exam-backend` `start` script to `package.json`.
- Create a `.env.example` in `exam-backend`.
Tell me which one to do next.
