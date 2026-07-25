<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">LocalRent - AI Local Rental Search</h1>

  <p align="center">
    An AI-Powered Platform for Discovering Affordable Local Rooms & PGs
    <br />
    <a href="#about-the-project"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://localrent-pi.vercel.app/">
      <img src="https://img.shields.io/badge/Live_Demo_(Vercel_--_Primary)-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo (Vercel - Primary)" />
    </a>
    &nbsp;
    <a href="https://localrent-ai-room-finder.onrender.com/">
      <img src="https://img.shields.io/badge/Live_Demo_(Render_--_Backup)-2563EB?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo (Render - Backup)" />
    </a>
    <br />
    <br />
    <a href="https://localrent-pi.vercel.app/"><strong>View Demo (Vercel - Primary)</strong></a> · <a href="https://localrent-ai-room-finder.onrender.com/">View Demo (Render - Backup)</a>
  </p>
</div>

<!-- BADGES -->
<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <br />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white" alt="Resend" />
  <img src="https://img.shields.io/badge/ImageKit-232F3E?style=for-the-badge&logoColor=white" alt="ImageKit" />
</div>

<br />

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#core-features">Core Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#frontend-setup">Frontend Setup</a></li>
        <li><a href="#backend-setup">Backend Setup</a></li>
      </ul>
    </li>
    <li><a href="#production-deployment">Production Deployment</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

## About The Project

**LocalRent** is built to solve a real-world problem faced by students and young professionals stepping into new cities or starting their careers. Finding cheap, affordable, and accessible rooms near offices and educational institutes by searching door-to-door is an exhausting and tedious process. LocalRent bridges this gap by bringing hyper-local room listings right to your fingertips.

By listing their spaces directly on LocalRent, local landlords including homeowners with spare rooms they wouldn't traditionally advertise, can effortlessly offer their accommodations. Once listed on our platform, seekers can easily discover these hidden, affordable gems without the traditional hassle, powered by a seamless, natural language AI search.

### Core Features

*   **AI Natural Language Search:** Skip complex filters. Type exactly what you need (e.g., *"quiet 1BHK near college under 15k"*), and the AI automatically parses your intent to deliver exact matches.
*   **AI Review Summaries:** Our AI aggregates and analyzes dozens of past tenant reviews into a single, highly accurate paragraph, highlighting the genuine pros and cons.
*   **Verified Direct Contact:** Phone numbers are securely masked until a booking is requested and approved, ensuring privacy for both landlords and tenants.
*   **Gamified Trust System:** Build your reputation. Landlords and tenants earn "Trust Scores" and profile badges based on successful, completed stays.
*   **End-to-End Booking Management:** Landlords have a dedicated dashboard to approve requests, mark tenants as "Moved In", and complete stays—unlocking verified reviews.

### Built With

The project utilizes a monolithic repository architecture.

**Frontend UI**
*   React
*   Vite
*   Tailwind CSS
*   Redux Toolkit

**Backend API**
*   Node.js
*   Express.js
*   MongoDB (Mongoose)
*   Google Gemini 3.1 Flash Lite (AI Integration)
*   Resend (Transactional Emails)
*   ImageKit (Media Storage)

---

## Getting Started

To get a local copy up and running, follow these simple steps. You will need to run the **Frontend** and **Backend** concurrently.

### Prerequisites

*   Node.js (v18 or higher)
*   npm (v9 or higher)
*   A MongoDB cluster URI (Atlas)

### 1. Frontend Setup

The frontend consumes the local API running on port 5000.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will now be running on `http://localhost:5173`. API requests to `/api/*` are automatically proxied to the backend.*

### 2. Backend Setup

The backend handles the API, database operations, and third-party services.

1. Open a new terminal window and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory using the template below:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>
   
   JWT_ACCESS_SECRET=your_jwt_access_secret_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
   
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=noreply@yourdomain.com
   
   AI_API_KEY=your_google_gemini_api_key
   AI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/
   AI_MODEL=gemini-3.1-flash-lite
   ```
4. Start the Node.js development server:
   ```bash
   npm run dev
   ```

---

## Production Deployment

LocalRent supports **two deployment strategies** from the same codebase:

### Strategy 1: Monolith on Render (Current)

The Express backend statically serves the compiled React frontend — only a single web service is needed.

1. Connect your GitHub repository to Render.
2. Set the **Build Command** to:
   ```bash
   npm run build
   ```
   *(This triggers the root `package.json` to install dependencies and compile the frontend).*
3. Set the **Start Command** to:
   ```bash
   npm start
   ```
4. Add all environment variables from the `backend/.env` template to Render's dashboard.
   *Note: Render auto-detects `RENDER_EXTERNAL_URL` for CORS, so `CLIENT_URL` is not required.*

> **Live (Render):** [https://localrent-ai-room-finder.onrender.com](https://localrent-ai-room-finder.onrender.com)

### Strategy 2: Frontend on Vercel + Backend on Render

The frontend is deployed as a static Vite build on Vercel. API requests (`/api/*`) are proxied to the existing Render backend via Vercel rewrites — no code changes needed.

1. Import the GitHub repository on [vercel.com](https://vercel.com).
2. Vercel will auto-detect the `vercel.json` config — no manual build/output settings needed.
3. The `vercel.json` already has the Render backend URL configured for API rewrites.
4. *(Optional)* To enable direct API access from the Vercel domain, add the Vercel URL to the `CLIENT_URL` environment variable on Render (comma-separated):
   ```
   CLIENT_URL=https://localrent-ai-room-finder.onrender.com,https://your-app.vercel.app
   ```



## Project Structure

- **[`/frontend`](./frontend/README.md)**: Contains the React source code, components, pages, Redux slices, and UI assets.
- **[`/backend`](./backend/README.md)**: Contains the Express server, MongoDB schemas, controllers, routing logic, and external API integrations.

---

## Contact

Project Link: [https://github.com/your_username/localrent](https://github.com/your_username/localrent)
