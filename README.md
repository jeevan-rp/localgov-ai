# LocalGov AI 🏛️

[![Live Demo](https://img.shields.io/badge/Live_Demo-local--gov--ai.vercel.app-forestgreen?style=for-the-badge)](https://local-gov-ai.vercel.app/)

LocalGov AI is an intelligent web application designed to help Indian citizens seamlessly navigate complex government service pipelines. By asking a few simple questions, the application provides tailored guidance, dynamically calculated fees, and precise document checklists for essential civic services like Birth Certificates, Income Certificates, and more.

**Live Domain:** [https://local-gov-ai.vercel.app/](https://local-gov-ai.vercel.app/)

---

## ✨ Features

- **Intelligent Triage System:** Dynamic questionnaires that adapt to user input to determine exact eligibility and requirements.
- **Tailored Checklists:** Generates precise, mandatory, and optional document checklists based on user circumstances (e.g., self-employed vs. salaried).
- **Fee Calculation:** Transparent breakdown of processing and convenience fees.
- **Citizen Profiles:** Persistent user accounts that securely store personal information, syncing across devices via our backend API.
- **SMS Notifications:** Asynchronous background worker system for sending timely SMS alerts.
- **Modern UI/UX:** A stunning, fully responsive interface featuring glassmorphism, micro-animations, and a dedicated dark mode.

---

## 🛠 Architecture & Tech Stack

The platform is split into a decoupled modern web architecture:

### Frontend
- **Framework:** React (built with Vite)
- **Styling:** Tailwind CSS (v3) for dynamic, utility-first styling
- **Routing/State:** React Hooks and state-driven component rendering
- **Icons:** Lucide React
- **Hosting:** Vercel

### Backend
- **Framework:** Python / Flask REST API
- **ORM:** SQLAlchemy
- **Database:** PostgreSQL (Hosted on Supabase)
- **Task Queue:** Celery powered by Redis (for SMS background jobs)
- **Hosting:** Render

---

## 📂 Project Structure

```text
localgov-ai/
├── backend/
│   ├── app.py             # Main Flask application and API routes
│   ├── models.py          # SQLAlchemy database schemas (Region, Service, Question, Rule, User)
│   ├── seed.py            # Database seeding script with logic rules for various certificates
│   ├── tasks.py           # Celery background workers
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile         # Docker configuration for backend
├── frontend/
│   ├── public/            # Static assets and favicons
│   ├── src/
│   │   ├── assets/        # Media and logos
│   │   ├── components/    # React components (LandingPage, ChatInterface, Profile, etc.)
│   │   ├── App.jsx        # Main application component and state router
│   │   ├── index.css      # Global Tailwind configuration and custom CSS
│   │   └── main.jsx       # React DOM entry point
│   ├── package.json       # Node dependencies
│   ├── tailwind.config.js # Tailwind theme configuration
│   └── vite.config.js     # Vite bundler configuration
└── DEPLOYMENT.md          # Comprehensive guide for deploying to Vercel/Render
```

---

## 🚀 Setup & Running Locally (without Docker)

### 1. Backend Setup

Ensure you have Python 3.10+ and Redis installed locally. Make sure your Redis server is running on `localhost:6379`.

```bash
cd backend
python -m venv venv

# Activate Virtual Environment (Windows)
venv\Scripts\activate
# Activate Virtual Environment (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Initialize the local SQLite database with mock data:
```bash
python seed.py
```

Start the Flask server:
```bash
python app.py
```

Start the Celery worker (in a new terminal):
```bash
cd backend
venv\Scripts\activate
celery -A tasks.celery_app worker --loglevel=info -P solo # Use -P solo on Windows
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser to view the application!

---

## 🐳 Setup & Running with Docker Compose

Ensure Docker Desktop is running on your machine.

```bash
docker-compose up --build
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

The database is automatically created in the container. To seed it initially, run:
```bash
docker-compose exec web python seed.py
```

---

## 🌍 Deployment

The application is configured for easy deployment to cloud providers:
- **Frontend:** Deploy the `frontend/` directory to **Vercel** as a Vite project. Set the `VITE_API_BASE_URL` environment variable.
- **Backend:** Deploy the `backend/` directory to **Render** as a Python Web Service using Gunicorn (`gunicorn -w 4 -b 0.0.0.0:$PORT app:app`). Set the `DATABASE_URL` and `PYTHON_VERSION`.

For detailed deployment instructions, please refer to [DEPLOYMENT.md](DEPLOYMENT.md).

---
*Built for the citizens of tomorrow.* 🇮🇳
