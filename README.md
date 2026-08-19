# 🌌 CipherGPT SaaS Platform

A premium, state-of-the-art AI chatbot workspace designed for developers, writers, and power users. Built with clean, modern web aesthetics (vibrant neon accents, dark mode, smooth micro-animations) and robust full-stack engineering.

---

## 🚀 Key Features

- **Multi-Session Chat Threads**: Create, switch between, and delete chat threads inside a collapsible, responsive sidebar.
- **Dynamic Scroll Control**: Floating "Scroll to Bottom" button appears when scrolling up, providing one-click viewport resets.
- **Stop Response Option**: Real-time browser abort signal listener (`AbortController`) to instantly cancel completions mid-generation.
- **Streaming Animations**: Highly responsive word-by-word streaming typing animation for newly generated AI completions.
- **In-Browser Document Parsing**: Client-side PDF text extraction (`pdfjs-dist`) and image previews with rich status badges.
- **OTP Account Recovery**: Node.js mail sender using secure SMTP App-Passwords for Gmail (with Ethereal local testing sandboxes).
- **Responsive Layout**: Desktop-side collapsible panels and mobile sliding navigation drawer overlays.
- **Proper Code & Table Styling**: Fenced tables with hover properties and full scrollable column boundaries.
- **Custom Confirmation Modals**: Seamless dialog popups replacing standard browser warning popups.
- **Persistent Theme Swapping**: Light & Dark mode settings saved in local storage.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 (Vite) + TypeScript + React Router v6 + Vanilla CSS variables
- **Backend**: Node.js + Express + TypeScript (Nodemon compiler)
- **Database**: MongoDB Atlas + Mongoose ODM (Nested DocumentArrays mapping)
- **AI Integrations**: OpenRouter SDK (Auto-failover free router model pool via `openrouter/free`)
- **Document Utilities**: pdfjs-dist (Global Worker compilation thread)

---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas Account](https://mongodb.com/) (or local MongoDB server instance)
- [OpenRouter Account](https://openrouter.ai/) (for free AI endpoint access API keys)

### 2. Configure Environment Variables
Inside `/backend`, create a `.env` file (copied from the detailed commented structure in `/backend/.env`):
```env
OPENROUTER_API_KEY=your_openrouter_api_key
MONGODB_URL=your_direct_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
COOKIE_SECRET=your_cookie_encryption_secret
PORT=5000

# Gmail SMTP Configuration for OTP resets:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_SECURE=false
```

### 3. Install Dependencies & Start Development Servers
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view your local platform instance!

---

## 🌐 Production Deployment Summary

For complete step-by-step production deployment steps on:
- **Frontend** (Vercel)
- **Backend** (Render / Koyeb / Fly.io)
- **CORS & IP White-listing configurations**

Please refer to our detailed [Production Deployment Guide](deployment_guide.md) located in the project's root folder.
