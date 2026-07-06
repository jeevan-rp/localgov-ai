# Deployment Guide: Vercel, Render, and Supabase

This guide covers how to deploy the LocalGov AI application using **Vercel** for the frontend, **Render** for the backend, and **Supabase** for the PostgreSQL database.

## Prerequisites
- A GitHub account with the project pushed to a repository.
- Accounts on [Supabase](https://supabase.com/), [Render](https://render.com/), and [Vercel](https://vercel.com/).

---

## Step 1: Set up the Database on Supabase

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Choose a strong database password and select a region close to your users (e.g., Mumbai for India).
3. Once the project is created, go to **Project Settings -> Database**.
4. Scroll down to the **Connection string** section, select **URI**, and copy the connection string.
   - It will look something like this: `postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`
   - Make sure to replace `[YOUR-PASSWORD]` with the password you set in step 2.

> [!NOTE]
> SQLAlchemy (used in the backend) requires the protocol to be `postgresql://` (which Supabase provides by default). If you ever see `postgres://`, make sure to change it to `postgresql://`.

---

## Step 2: Prepare the Backend for Render

Before deploying to Render, make sure your backend is ready to accept production environment variables.

1. **Update Database Connection**: Ensure your `backend/app.py` or database config uses an environment variable for the database URI instead of hardcoding SQLite.
   ```python
   import os
   # Example for SQLAlchemy:
   app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///localgov.db')
   ```
2. **Add PostgreSQL Driver**: You must add `psycopg2-binary` to your `backend/requirements.txt` so Python can connect to PostgreSQL.
   ```text
   psycopg2-binary==2.9.9
   ```

### Deploying to Render
1. Go to [Render](https://render.com/) and click **New -> Web Service**.
2. Connect your GitHub repository and select the `localgov-ai` repository.
3. Configure the web service:
   - **Name**: `localgov-backend` (or whatever you prefer)
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
4. Add the following **Environment Variables**:
   - `DATABASE_URL`: Paste the connection string you copied from Supabase.
   - `PYTHON_VERSION`: `3.10.0` (or whatever version you are using locally).
5. Click **Create Web Service**. Wait for the deployment to finish and copy the provided Render URL (e.g., `https://localgov-backend.onrender.com`).

---

## Step 3: Prepare the Frontend for Vercel

The frontend needs to know where the backend is hosted. Currently, the API URL is likely hardcoded to `localhost`.

1. **Update API Calls**: In `frontend/src/components/ChatInterface.jsx` (and any other files making API calls), replace the hardcoded `localhost` URL with an environment variable.
   ```javascript
   // Change this:
   // const API_BASE = 'http://localhost:5000/api'
   
   // To this:
   const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
   ```

### Deploying to Vercel
1. Go to [Vercel](https://vercel.com/) and click **Add New -> Project**.
2. Import your GitHub repository.
3. In the configure project screen:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
4. Add an **Environment Variable**:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: The Render URL you copied earlier + `/api` (e.g., `https://localgov-backend.onrender.com/api`).
5. Click **Deploy**.

---

## Step 4: Seed the Production Database

Since your Supabase database is empty, you need to run your `seed.py` script against it.

### Option A: From your local machine
1. Temporarily set the `DATABASE_URL` environment variable on your local machine to the Supabase connection string.
2. Run the seed script:
   ```bash
   cd backend
   export DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
   python seed.py
   ```

### Option B: Using Render's Shell
1. Go to your backend service dashboard on Render.
2. Click on the **Shell** tab on the left sidebar.
3. Run `python seed.py`. (Since the `DATABASE_URL` is already set in Render's environment variables, this will automatically connect to Supabase).

---

## 🎉 You're Done!
Your application is now live! The frontend is hosted globally on Vercel's CDN, the backend is running on Render, and your data is securely stored in Supabase.
