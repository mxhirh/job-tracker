# Job Tracker

A full-stack web application to help users track their job applications, stay organised during the job hunt, and get insights on their progress.

---

## What This Project Does

Job searching can get overwhelming fast — spreadsheets get messy, you forget where you applied, and it's hard to see the bigger picture. This app aims to solve that by giving you a clean dashboard to:

- Log and manage job applications in one place
- Move applications through stages (Applied → Interview → Offer → Rejected) with drag and drop
- Visualise your progress with charts
- Get email reminders for follow-ups
- Securely log in with your own account

---

## Tech Stack

This project is split into two parts — a **client** (front-end) and a **server** (back-end).

### Front-End (Client)
Built with **React** — a popular JavaScript library for building user interfaces.

| Package | What it does |
|---|---|
| `react` | The core library for building the UI |
| `react-router-dom` | Handles navigation between pages (e.g. login page → dashboard) |
| `axios` | Sends requests from the browser to the server (e.g. "fetch my applications") |
| `@hello-pangea/dnd` | Powers drag-and-drop so you can move job cards between columns |
| `recharts` | Renders charts and graphs to visualise your job search stats |

### Back-End (Server)
Built with **Node.js** and **Express** — a lightweight framework for building APIs.

| Package | What it does |
|---|---|
| `express` | Creates the server and handles incoming requests from the client |
| `pg` | Connects the server to a **PostgreSQL** database where all data is stored |
| `bcryptjs` | Hashes (encrypts) passwords before saving them — so they're never stored in plain text |
| `jsonwebtoken` | Creates secure login tokens so users stay logged in without re-entering their password |
| `dotenv` | Loads secret values (like database passwords) from a `.env` file so they're never exposed in the code |
| `cors` | Allows the client (running on port 3000) to safely communicate with the server |
| `nodemailer` | Sends emails — used for follow-up reminders |
| `node-cron` | Runs scheduled tasks automatically (e.g. send a reminder email every morning) |
| `nodemon` | Dev tool that automatically restarts the server when you save changes |

---

## Project Structure

```
job-tracker/
├── client/          # Everything the user sees in the browser (React)
│   ├── public/      # Static files (HTML template, icons)
│   └── src/         # React components and app logic
│       └── App.js   # Root component — the starting point of the UI
│
├── server/          # The behind-the-scenes logic (Node/Express)
│   └── src/
│       └── index.js # Entry point — sets up the server and its configuration
│
├── .gitignore       # Tells Git which files NOT to upload (e.g. node_modules, .env)
└── README.md        # This file
```

---

## What's Been Set Up So Far

### Server
- Express server initialised and configured
- **CORS** enabled so the React client can communicate with the server
- All back-end dependencies installed and ready to use:
  - Database connection (PostgreSQL via `pg`)
  - Authentication system (bcrypt + JWT)
  - Email service (Nodemailer)
  - Scheduled jobs (node-cron)

### Client
- React app created and configured
- All front-end dependencies installed and ready to use:
  - Page routing (React Router)
  - API communication (Axios)
  - Drag-and-drop (hello-pangea/dnd)
  - Charts (Recharts)

---

## Planned Features

- [ ] User registration and login
- [ ] Add, edit, and delete job applications
- [ ] Kanban-style board with drag-and-drop columns (Applied, Interview, Offer, Rejected)
- [ ] Dashboard with charts showing application stats
- [ ] Email reminders for follow-ups
- [ ] Automated daily digest email

---

## How to Run Locally

You'll need **Node.js** installed on your machine.

### 1. Start the server
```bash
cd server
npm install
npm run dev
```

### 2. Start the client
```bash
cd client
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## Why I Built This

Keeping track of job applications manually is frustrating and easy to lose track of. I built this project to solve a real problem I experienced, while also learning how to build a full-stack application with a React front-end, a Node.js API, a PostgreSQL database, and user authentication from scratch.
