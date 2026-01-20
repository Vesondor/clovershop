# Deployment Guide

This project consists of two parts:

1.  **Frontend**: Next.js application (Root directory) - Recommended host: **Vercel**
2.  **Backend**: Node.js/Express application (`server/` directory) - Recommended host: **Render** or **Railway**

> [!WARNING] > **Important Note regarding Image Uploads**:
> Your current backend code saves images to the local `public/` folder.
>
> - On platforms like **Vercel**, **Render**, or **Heroku**, the file system is "ephemeral". This means **uploaded images will vanish** every time the server restarts or redeploys.
> - To fix this for production, you should refactor the upload logic to use a service like **Cloudinary** or **AWS S3**.

## 1. Hosting the Frontend (Vercel)

1.  Push your latest code to GitHub.
2.  Go to [Vercel](https://vercel.com) and "Add New Project".
3.  Import your repository.
4.  **Build Settings**: Default settings should work (`npm run build`).
5.  **Environment Variables**:
    - `NEXT_PUBLIC_API_BASE_URL`: The URL of your deployed Backend (see step 2).
    - `NEXTAUTH_URL`: Your Vercel production URL (e.g. `https://your-shop.vercel.app`).
    - `NEXTAUTH_SECRET`: A random string.

## 2. Hosting the Backend (Render/Railway)

Since Vercel is optimized for frontend, it is best to host the Express API separately.

### Option A: Render (Free Tier available)

1.  Create a new **Web Service** on [Render](https://render.com).
2.  Connect your GitHub repo.
3.  **Root Directory**: `server`
4.  **Build Command**: `npm install`
5.  **Start Command**: `npm start`
6.  **Environment Variables**:
    - `DATABASE_URL`: Your Postgres Connection String.
    - `ALLOWED_ORIGINS`: Your Vercel Frontend URL (e.g. `https://your-shop.vercel.app`).
    - `FRONTEND_URL`: Same as above.

## 3. Local Development

I have updated your `package.json` so you can run both servers with one command:

```bash
npm run dev
```

This will start:

- Frontend on `http://localhost:3000`
- Backend on `http://localhost:3001`
