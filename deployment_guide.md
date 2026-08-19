# 🚀 CipherGPT SaaS - Deployment Guide

This guide explains step-by-step how to deploy the CipherGPT SaaS application to production.
- **Frontend (Vercel)**
- **Backend (Render, Koyeb, or Fly.io)**
- **MongoDB Atlas Configuration**

---

## 🛠️ Step 1: Prepare the Codebase for Git
Before deploying, make sure your project is committed to a Git repository (like GitHub).
We have already added `.gitignore` files to both `/frontend` and `/backend` directories to prevent checking in node dependencies, built directories, and your private `.env` credentials.

Initialize Git in the root of your workspace:
```bash
git init
git add .
git commit -m "Initialize project: CipherGPT SaaS with files support, stop response, and custom confirmation modals"
```
Publish this repository as a private repository on your GitHub account.

---

## 🌐 Step 2: Deploy the Backend
Because Vercel is built for serverless hosting and limits execution times (ideal for frontends), a standard persistent Express server is best deployed to a container or server hosting platform.

### Option A: Deploy to Render (Recommended)
1. Sign up/log in to [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following configurations:
   - **Name:** `ciphergpt-backend`
   - **Root Directory:** `backend`
   - **Language/Environment:** `Node`
   - **Build Command:** `npm install && npm run build` (This runs the TypeScript compiler and compiles files to the `/dist` directory)
   - **Start Command:** `node dist/index.js`
5. Click **Advanced** and add the following **Environment Variables** (copying them from your local `backend/.env` file):
   - `PORT`: `5000` (Render overrides this, but keep it as a default)
   - `OPENROUTER_API_KEY`: `sk-or-v1-...`
   - `MONGODB_URL`: `mongodb://...`
   - `JWT_SECRET`: `cae72aaeb36...`
   - `COOKIE_SECRET`: `2644b8ad7...`
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `SMTP_USER`: `lakshaydhoundiyal04@gmail.com`
   - `SMTP_PASS`: `whrr oboe cfxc jbjm`
   - `SMTP_SECURE`: `false`
6. Click **Create Web Service**. Render will build and deploy the server.
7. Copy the generated URL of your backend (e.g., `https://ciphergpt-backend.onrender.com`).

---

## ⚡ Step 3: Deploy the Frontend to Vercel
Vercel is the ultimate host for React/Vite frontends due to its edge delivery network and automatic deployments.

### 📝 Edit Frontend API Base URL
Currently, in development, the frontend proxy is configured to direct calls to `/api/v1` on `http://localhost:5000`. For production, the frontend needs to know where your deployed backend is.
1. Open [`frontend/src/main.tsx`](file:///c:/Users/laksh/OneDrive/Desktop/Projects/CipherGPT-SaaS/frontend/src/main.tsx).
2. Update the default Axios configuration to point to your new Render backend URL:
   ```typescript
   import axios from "axios";
   axios.defaults.baseURL = "https://your-backend-url.onrender.com/api/v1";
   axios.defaults.withCredentials = true; // Required for HTTP-only cookies
   ```

### 🚀 Deploying to Vercel UI
1. Sign up/log in to [Vercel](https://vercel.com/).
2. Click **Add New** → **Project**.
3. Select and import your GitHub repository.
4. Set the following project settings:
   - **Framework Preset:** `Vite` (automatically detected)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**. Vercel will build and assign you a live production URL!

### 🔒 CORS Configuration (Very Important!)
Because the frontend and backend are hosted on separate domains (e.g., `vercel.app` and `onrender.com`), you need to enable CORS inside the backend.
1. Open the backend CORS setup (typically in `backend/src/app.ts` or `backend/src/index.ts`).
2. Verify the CORS `origin` list includes your production Vercel frontend URL:
   ```typescript
   app.use(cors({
     origin: "https://your-frontend-vercel-url.vercel.app",
     credentials: true
   }));
   ```
3. Commit and push the backend change to GitHub; Render will automatically rebuild and apply it!

---

## 💾 Step 4: MongoDB Atlas IP Access List
By default, MongoDB Atlas blocks all incoming connections except for white-listed IP addresses.
1. Log in to your [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. Go to **Network Access** under Security in the left sidebar.
3. Click **Add IP Address**.
4. Since Render/Koyeb dynamically change IP addresses during scale/redeploys, choose **Allow Access From Anywhere** (`0.0.0.0/0`) or configure a private peering connection.
5. Click **Confirm**. Your production server will now connect seamlessly.
