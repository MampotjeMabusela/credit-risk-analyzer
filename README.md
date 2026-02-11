# Credit Risk Analyzer

AI-powered credit risk analyzer using:

- **Backend**: Supabase (Postgres + auth) accessed from Next.js API routes
- **Frontend**: React / Next.js (Vercel)

This repo is optimized so you can run everything locally with just the Next.js dev server, and then deploy the frontend to Vercel pointing at your Supabase project.

## Structure

- `frontend/` – Next.js app (pages router), risk dashboard, scenario testing UI, `/api/predict` route
- `supabase/` – SQL schema, seed data, and Edge Functions for your Supabase project

> Note: A `backend/` folder may exist from earlier experiments but is not required for the current setup.

---

## Upload to GitHub

Follow these steps to put your project on GitHub so you can deploy to Vercel and share the code.

### 1. Install Git (if you don’t have it)

- **Windows:** Download and run the installer from [git-scm.com](https://git-scm.com/download/win). During setup, you can leave defaults; choose “Git from the command line and also from 3rd-party software” so `git` works in PowerShell and Cursor.
- **Mac:** Install Xcode Command Line Tools: run `xcode-select --install` in Terminal, or install Git from [git-scm.com](https://git-scm.com/download/mac).

Close and reopen Cursor (or your terminal) after installing so the `git` command is recognized.

### 2. Create a new repository on GitHub

1. Go to [github.com](https://github.com) and sign in.
2. Click the **+** icon (top right) → **New repository**.
3. Set **Repository name** to `credit-risk-analyzer` (or any name you like).
4. Choose **Public**.
5. **Do not** check “Add a README”, “Add .gitignore”, or “Choose a license” (your project already has these or a .gitignore).
6. Click **Create repository**. Keep the page open; you’ll need the repo URL (e.g. `https://github.com/YourUsername/credit-risk-analyzer.git`).

### 3. Initialize Git and push from your computer

Open **PowerShell** (or Terminal on Mac) and run these commands **one at a time** from your project folder. Replace `YOUR_USERNAME` and `credit-risk-analyzer` with your GitHub username and repo name if different.

```powershell
cd "C:\Users\mampo\OneDrive\Documents\credit-risk-analyzer"
```

```powershell
git init
```

```powershell
git add .
```

```powershell
git status
```
(You should see a list of files to be committed; `.env.local` and `node_modules` should **not** appear, thanks to `.gitignore`.)

```powershell
git commit -m "Initial commit: Credit Risk Analyzer"
```

```powershell
git branch -M main
```

```powershell
git remote add origin https://github.com/MampotjeMabusela/credit-risk-analyzer.git
```

```powershell
git push -u origin main
```

If GitHub asks for login, use your GitHub username and a **Personal Access Token** (not your password). Create a token at: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Generate new token**, with scope `repo`.

### 4. Done

Refresh the repo page on GitHub. You should see all your project files. You can now connect this repo to Vercel (see [Deploy: Backend on Supabase, Frontend on Vercel](#deploy-backend-on-supabase-frontend-on-vercel)).

---

## Configure Supabase

Do this once per machine (and per Vercel project when deploying).

### Step 1: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose an organization, name the project (e.g. `credit-risk-analyzer`), set a database password, and pick a region. Click **Create new project** and wait for it to finish.

### Step 2: Apply the database schema

1. In the Supabase dashboard, open **SQL Editor**.
2. Create a new query and paste in the **entire contents** of `supabase/schema.sql`.
3. Click **Run**. You should see success (tables created).
4. (Optional) Open another query, paste the contents of `supabase/seed.sql`, and **Run** to insert sample clients, applications, and one model run so the **Scores** page shows data.

### Step 3: Get your API keys

1. Go to **Project Settings** (gear icon) → **API**.
2. Copy:
   - **Project URL** (e.g. `https://xxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### Step 4: Configure the frontend

1. In the repo, go to the `frontend` folder.
2. Copy the example env file and edit it with your values:
   - **Windows (PowerShell):**  
     `Copy-Item .env.example .env.local`  
     Then open `frontend/.env.local` and replace the placeholders.
   - **Mac/Linux:**  
     `cp .env.example .env.local` then edit `.env.local`.
3. Set these in `.env.local` (no quotes needed):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart the Next.js dev server (`npm run dev`) so it picks up the new env vars.

After this, **Upload Data** and **Scores** will use your Supabase project. The Simulator and Portfolio Dashboard work without Supabase; they use local API routes and in-memory data.

### Optional: Edge Functions (ingest-data, predict-credit-score)

To use the Supabase Edge Functions in this repo:

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and run `supabase login`.
2. From the repo root, link the project: `supabase link --project-ref your-project-ref` (ref is in the project URL).
3. Deploy: `supabase functions deploy ingest-data` and `supabase functions deploy predict-credit-score`.
4. In the dashboard under **Edge Functions**, set secrets if needed (e.g. `SUPABASE_SERVICE_ROLE_KEY`, `MODEL_API_URL`).

---

## Local development (Next.js)

In a terminal (PowerShell on Windows):

```powershell
cd "C:\Users\mampo\OneDrive\Documents\credit-risk-analyzer\frontend"

npm install
```

Create a `.env.local` file in the `frontend` folder with:

```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
```

Then start the dev server:

```powershell
npm run dev
```

Open `http://localhost:3000` in your browser.

- Use the sliders to adjust income, age, loan amount, employment years, and credit history.
- Click **“Recalculate Risk”** to call the `/api/predict` route.
- The default probability and band are computed by the server and displayed in the dashboard.

---

## Deploy: Backend on Supabase, Frontend on Vercel

Use these steps to run your **backend on Supabase** (database + optional Edge Functions) and your **frontend on Vercel**.

### Prerequisites

- Your code pushed to **GitHub** (or GitLab / Bitbucket).

---

### Step 1: Deploy the backend (Supabase)

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com) and sign in.
   - Click **New project**.
   - Choose an organization, name the project (e.g. `credit-risk-analyzer`), set a **database password**, and pick a **region**. Click **Create new project** and wait until it’s ready.

2. **Apply the database schema**
   - In the Supabase dashboard, open **SQL Editor**.
   - Click **New query**, paste the **entire contents** of `supabase/schema.sql`, and click **Run**. Confirm that the tables are created.
   - (Optional) New query again, paste the contents of `supabase/seed.sql`, and **Run** to add sample data.

3. **Get your API keys**
   - Go to **Project Settings** (gear icon) → **API**.
   - Copy and save:
     - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
     - **anon public** key (under “Project API keys”)
   - If you will deploy Edge Functions, also copy the **service_role** key (keep it secret; use only in backend/Edge Functions).

4. **(Optional) Deploy Edge Functions**
   - Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and run `supabase login`.
   - In your project folder (repo root), run:
     - `supabase link --project-ref YOUR_PROJECT_REF` (the ref is the part of your Project URL before `.supabase.co`).
     - `supabase functions deploy ingest-data`
     - `supabase functions deploy predict-credit-score`
   - In the dashboard go to **Edge Functions** → each function → **Secrets** and set `SUPABASE_SERVICE_ROLE_KEY` (and `MODEL_API_URL` if you use an external model API).

Your **backend** is now on Supabase: database is live, and optional APIs are available via Edge Functions.

---

### Step 2: Deploy the frontend (Vercel)

1. **Import the project**
   - Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
   - Click **Add New** → **Project**.
   - **Import** your **credit-risk-analyzer** repository (grant Vercel access to the repo if asked).

2. **Set the root directory**
   - Under “Configure Project”, click **Edit** next to **Root Directory**.
   - Enter `frontend` and confirm. Leave **Framework Preset** as Next.js.

3. **Add environment variables**
   - In **Environment Variables**, add:
     - **Name:** `NEXT_PUBLIC_SUPABASE_URL`  
       **Value:** your Supabase **Project URL** (from Step 1.3).
     - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
       **Value:** your Supabase **anon public** key (from Step 1.3).
   - Select **Production**, **Preview**, and **Development** so all deployments use these.
   - Click **Save**.

4. **Deploy**
   - Click **Deploy**. Wait for the build to finish.
   - Open the **Visit** link (e.g. `https://credit-risk-analyzer-xxx.vercel.app`). Your app should load and use the Supabase backend (Upload Data, Scores, etc.).

---

### Step 3: Verify

- **Frontend:** Open your Vercel URL; use **Simulator**, **Portfolio Dashboard**, **Upload Data**, and **Scores**.
- **Backend:** In Supabase, open **Table Editor** and confirm tables (e.g. `clients`, `applications`, `model_runs`) exist and, if you ran the seed, have sample rows.
- **Scores:** If you ran `seed.sql`, the **Scores** tab on the Vercel app should show at least one row.

---

### Quick reference (Supabase + Vercel)

| Part      | Where it runs | What you get |
|----------|----------------|--------------|
| Backend  | Supabase      | Database + optional Edge Functions (APIs) |
| Frontend | Vercel        | `https://your-project.vercel.app` |

Use the same **Project URL** and **anon key** in Vercel so the frontend talks to your Supabase backend.

---

## Deploy backend and frontend (alternative: Python backend on Railway/Render)

If you want to run the **Python FastAPI** app (`backend/`) as a separate service, use the steps below. The app also works with only Supabase + Vercel (see above).

### Prerequisites

- Code pushed to **GitHub**.
- **Supabase** project created and schema applied (see [Configure Supabase](#configure-supabase)).

---

### Part 1: Deploy the Python backend (Railway or Render)

The backend is a Python FastAPI app in `backend/`. It can be deployed with **Docker** to a host that supports it (e.g. Railway, Render).

#### Option A: Railway (Docker)

1. Go to [railway.app](https://railway.app) and sign in (e.g. with GitHub).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your **credit-risk-analyzer** repo and connect it.
4. After the repo is connected, add a **service**:
   - Choose **Dockerfile** as the deployment method.
   - Set **Root Directory** to `backend` (so the build context is the folder that contains `Dockerfile` and `app/`).
   - Railway will detect `backend/Dockerfile` and build the image.
5. In the service, open **Variables** and add any env vars you need (e.g. `MODEL_PATH`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). None are required for the default dummy model.
6. Open **Settings** → **Networking** → **Generate Domain** to get a public URL (e.g. `https://your-app.up.railway.app`).
7. **Deploy** (triggered automatically on push, or click **Deploy**). Wait until the build and deploy succeed.
8. Test: open `https://your-app.up.railway.app/health` in a browser; you should see `{"status":"ok"}`.
9. **Save this URL** – you’ll use it as the backend URL for the frontend or for Supabase Edge Functions (`MODEL_API_URL`).

#### Option B: Render (Docker)

1. Go to [render.com](https://render.com) and sign in.
2. **New** → **Web Service**.
3. Connect your **GitHub** account and select the **credit-risk-analyzer** repo.
4. Configure:
   - **Environment**: Docker.
   - **Dockerfile path**: `backend/Dockerfile` (Render will use repo root as context; ensure paths in the Dockerfile match, or set **Root Directory** to `backend` if available).
5. Choose a plan (e.g. Free) and region.
6. Add **Environment Variables** if needed (same as Railway).
7. Click **Create Web Service**. Render will build and deploy.
8. Copy the assigned URL (e.g. `https://credit-risk-analyzer.onrender.com`) and test `/health`.
9. Save this URL for the frontend or `MODEL_API_URL`.

---

### Part 2: Deploy the frontend (Next.js on Vercel)

1. **Push your code** to GitHub (if you haven’t already).
2. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
3. Click **Add New** → **Project** and **Import** your **credit-risk-analyzer** repository.
4. **Configure the project**:
   - **Root Directory**: click **Edit**, set to `frontend`, then **Continue**.
   - **Framework Preset**: should be **Next.js** (auto-detected).
   - **Build Command**: leave default (`next build`).
   - **Output Directory**: leave default.
5. **Environment Variables** (required for Supabase and optional for backend):
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key.
   - Optional (if you deployed the FastAPI backend and want the app to call it):
     - `NEXT_PUBLIC_API_BASE_URL` = your backend URL (e.g. `https://your-app.up.railway.app`).
   - Apply to **Production**, **Preview**, and **Development** if you use Vercel for all.
6. Click **Deploy**. Wait for the build to finish.
7. Open the **Visit** link (e.g. `https://credit-risk-analyzer-xxx.vercel.app`). You should see the Credit Risk Analyzer UI (Simulator, Portfolio Dashboard, Upload Data, Scores).

---

### Part 3: Point the app at the deployed backend (optional)

The app works without the Python backend (it uses the Next.js `/api/predict` route). If you deployed the FastAPI backend and want the frontend to call it:

1. In **Vercel** → your project → **Settings** → **Environment Variables**, add or update:
   - `NEXT_PUBLIC_API_BASE_URL` = `https://your-backend-url` (no trailing slash).
2. **Redeploy** the frontend (e.g. **Deployments** → **⋯** → **Redeploy**).
3. Any client-side or server code that uses `process.env.NEXT_PUBLIC_API_BASE_URL` will now call your deployed backend.

---

### Quick reference

| Component   | Where it runs        | URL you get                    |
|------------|----------------------|---------------------------------|
| Backend    | Railway / Render     | `https://your-backend.up.railway.app` (or Render URL) |
| Frontend   | Vercel               | `https://your-project.vercel.app` |
| Database   | Supabase (cloud)     | Already set via env vars       |

