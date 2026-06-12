<div align="center">
  <img src="https://img.shields.io/badge/CodeLoom-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="CodeLoom Logo" />
  <h1>🚀 CodeLoom</h1>
  <p><strong>Next-Generation AI-Powered Learning Management System & Coding Platform</strong></p>

  <p>
    <a href="#-key-features"><img src="https://img.shields.io/badge/Features-Explore-blue?style=for-the-badge" alt="Features"></a>
    <a href="#%EF%B8%8F-tech-stack"><img src="https://img.shields.io/badge/Tech_Stack-View-orange?style=for-the-badge" alt="Tech Stack"></a>
    <a href="#-quick-start"><img src="https://img.shields.io/badge/Setup-Install-success?style=for-the-badge" alt="Installation"></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=flat-square&logo=googlebard&logoColor=white" alt="Gemini AI" />
  </p>
</div>

<br />

## ✨ Overview

**CodeLoom** is a unified, intelligent learning platform that bridges the gap between theoretical learning and practical coding. It eliminates platform fragmentation by combining video courses, an interactive coding workspace, and a context-aware AI tutor into a single, seamless experience.

Built for modern educators and ambitious students, CodeLoom provides an immersive environment where learners can watch lectures, solve algorithmic challenges in multiple languages, and get instant, smart AI hints when they get stuck.

## 🌟 Key Features

### 🎓 For Students
*   **Immersive Learning Environment:** Seamlessly transition between video lectures, markdown notes, and coding challenges.
*   **Integrated Code Workspace:** In-browser IDE (Monaco Editor) supporting **JavaScript, Python, C++, and Java** with instant test case feedback.
*   **Context-Aware AI Tutor:** Powered by Gemini AI. Click "AI Hint" to get pedagogical guidance that reads your code and points you in the right direction without spoiling the answer.
*   **Gamified Progress:** Track your learning streak, view performance charts, and earn achievements.
*   **Verifiable Certificates:** Auto-generated, high-resolution PDF certificates upon 100% course completion.

### 👨‍🏫 For Instructors
*   **Intuitive Curriculum Builder:** Construct rich, modular courses with video uploads, reading materials, and integrated coding exercises.
*   **Automated Assessments:** Define hidden test cases for coding challenges or use the **AI Quiz Generator** to instantly create multiple-choice tests.
*   **Deep Analytics:** Monitor student enrollment, completion rates, and challenge success metrics via a powerful dashboard.

<br />

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Client) & [TanStack Query](https://tanstack.com/query) (Server)
- **Code Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Data Visualization:** [Recharts](https://recharts.org/)

### Backend
- **Framework:** [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication:** JWT (JSON Web Tokens) & bcrypt
- **File Storage:** [Cloudinary](https://cloudinary.com/)

### External Services
- **AI Integration:** [Google Gemini API](https://ai.google.dev/) (Powers the context-aware tutor and quiz generation)
- **Code Execution:** [OneCompiler API](https://onecompiler.com/api) (Secure, sandboxed multi-language code execution)

<br />

## 🏗️ Architecture

CodeLoom employs a decoupled Client-Server architecture for maximum scalability and security:

1.  **Client Tier:** A highly interactive React application leveraging SSR where beneficial, and lazy-loading heavy components (like Monaco) for optimal performance.
2.  **API Tier:** A stateless RESTful Express server that handles business logic, proxies requests to external APIs (to protect secret keys), and manages MongoDB transactions.
3.  **Service Tier:** External APIs are integrated via dedicated service layers, making it easy to swap out AI providers or code execution engines in the future.

<br />

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB cluster (local or Atlas)
- API Keys for: Cloudinary, Google Gemini, and OneCompiler.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BAJI-761/CODELOAM.git
   cd CODELOAM
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file in the `server` directory:*
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   GEMINI_API_KEY=your_gemini_api_key
   ONECOMPILER_API_KEY=your_onecompiler_key
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```
   *Create a `.env.local` file in the `client` directory:*
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

4. **Run the Application**
   Open two terminals:
   
   *Terminal 1 (Backend)*
   ```bash
   cd server
   npm run dev
   ```
   
   *Terminal 2 (Frontend)*
   ```bash
   cd client
   npm run dev
   ```

5. **Populate Seed Data (Optional)**
   To test with a fully populated database:
   ```bash
   cd server
   node seed.js
   ```

<br />

## 📜 License
This project was developed as a core internship submission for Sqrock IT Solutions.

---
<div align="center">
  <sub>Built with ❤️ by an ambitious engineer.</sub>
</div>
