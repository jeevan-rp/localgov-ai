# LocalGov AI

A web application designed to help Indian citizens navigate government service pipelines.

## Architecture

- **Frontend**: React (Vite) + Tailwind CSS (v3)
- **Backend**: Python (Flask) REST API
- **Database**: SQLite (SQLAlchemy)
- **Background Tasks**: Celery with Redis

## Setup & Running Locally (without Docker)

### 1. Backend Setup

Ensure you have Python 3.10+ and Redis installed locally. Make sure Redis server is running on `localhost:6379`.

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Initialize the database with mock data:
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
venv\Scripts\activate # or source venv/bin/activate
celery -A tasks.celery_app worker --loglevel=info -P solo # Use -P solo on Windows
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Setup & Running with Docker Compose

Ensure Docker Desktop is running.

```bash
docker-compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

The database is automatically created in the container. To seed it initially, run:
```bash
docker-compose exec web python seed.py
```
docker-compose up --build -V
