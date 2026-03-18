# Vercel Deployment Guide

Since you have already pushed your modern movie application to GitHub, deploying to Vercel is straightforward. Follow these steps for a perfect launch.

## Step 1: Login to Vercel
1. Go to [vercel.com](https://vercel.com).
2. Click **Log In** and select **Continue with GitHub**.

## Step 2: Import Your Project
1. Once logged in, click the **"Add New..."** button and select **Project**.
2. Find your repository: `Alyabbas93/movie-app`.
3. Click **Import**.

## Step 3: Configure Build & Environment Variables
Vercel will automatically detect that you are using **Next.js**.

> [!IMPORTANT]
> You **must** add your OMDb API key for the search and movie details to work in production.

1. Under the **"Environment Variables"** section, add the following:
   - **Key**: `NEXT_PUBLIC_OMDB_API_KEY`
   - **Value**: `ce4738ca` (Copy this from your `.env.local`)
2. Click **Add**.

## Step 4: Deploy
1. Click the **Deploy** button at the bottom.
2. Vercel will now:
   - Run `npm install`
   - Run `npm run build` (Which we've already verified is "Zero-Error")
   - Generate your production URL.

## Step 5: Post-Deployment Check
1. Once the deployment is complete, Vercel will give you a unique URL (e.g., `movie-app-three.vercel.app`).
2. Open the URL and test:
   - **Search**: Enter "Inception" to verify API connectivity.
   - **Playback**: Click a movie and test Server 1, 2, and 3.
   - **Theme**: Toggle Dark/Light mode.

---
**Troubleshooting Tip**: If the build fails on "Static Page Generation", don't worry—Vercel handles `Suspense` automatically during the build, and our code is already optimized for this.
