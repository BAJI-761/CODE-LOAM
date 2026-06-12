# Deployment Guide

CodeLoom uses a decoupled architecture with a Next.js App Router frontend and an Express.js Node backend. They should be deployed as separate services.

## Backend Deployment (Render)

We recommend deploying the backend on [Render.com](https://render.com) using their Web Service.

### 1. Prerequisites
- Create a MongoDB Atlas cluster and get the connection string.
- Create a Cloudinary account for file storage and get the keys.
- Get a Google Gemini API Key.
- Get a OneCompiler API Key for code execution.

### 2. Render Setup
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Set Environment Variables:
   - `PORT`: `5000` (Render defaults to 10000, but CodeLoom defaults to 5000 internally if unset, though it takes process.env.PORT)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `your_mongodb_connection_string`
   - `JWT_SECRET`: `a_secure_random_string`
   - `JWT_EXPIRE`: `30d`
   - `CLOUDINARY_CLOUD_NAME`: `your_cloud_name`
   - `CLOUDINARY_API_KEY`: `your_api_key`
   - `CLOUDINARY_API_SECRET`: `your_api_secret`
   - `GEMINI_API_KEY`: `your_gemini_api_key`
   - `ONECOMPILER_API_KEY`: `your_onecompiler_api_key`

5. Deploy! Once deployed, copy the Render URL (e.g., `https://codeloom-api.onrender.com`).

## Frontend Deployment (Vercel)

We recommend deploying the frontend on [Vercel](https://vercel.com) for native Next.js support.

### 1. Vercel Setup
1. Create a new **Project** on Vercel.
2. Connect your GitHub repository.
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
4. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.onrender.com/api/v1` (replace with your actual Render URL and append `/api/v1`)
5. Deploy!

## Post-Deployment

### 1. CORS Configuration
Ensure your backend allows requests from your Vercel URL. The backend is configured to accept requests from the domains specified in the `CORS_ORIGIN` environment variable or accept all by default if not set strictly. 

### 2. Database Seeding (Optional)
If you want to populate your production database with seed data:
1. Temporarily connect to your production MongoDB cluster from your local machine.
2. Update your local `server/.env` with the production `MONGO_URI`.
3. Run `node seed.js` in the `server` directory.
4. **Warning**: This will wipe existing data in the cluster. Do not do this if real users are already on the platform!

## Troubleshooting

- **API calls failing from frontend:** Ensure `NEXT_PUBLIC_API_URL` is set correctly and points to the HTTPS endpoint of your backend, including the `/api/v1` path.
- **Images not uploading:** Verify your Cloudinary keys in the backend environment variables.
- **AI/Code execution failing:** Verify the Gemini and OneCompiler API keys in the backend environment variables.
