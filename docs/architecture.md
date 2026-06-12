# System Architecture

CodeLoom is designed as a decoupled full-stack application, ensuring scalability, clear separation of concerns, and security.

## High-Level Architecture

The system consists of three main tiers:
1. **Presentation Tier**: Next.js 14 (App Router) React application.
2. **Application Tier**: Node.js & Express.js REST API.
3. **Data Tier**: MongoDB (Atlas) for data persistence.

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │ HTTP  │                 │ Mongoose│                 │
│  Next.js Client │──────▶│  Express API    │──────▶│  MongoDB Atlas  │
│  (Vercel)       │◀──────│  (Render)       │◀──────│                 │
│                 │ JSON  │                 │       │                 │
└────────┬────────┘       └────────┬────────┘       └─────────────────┘
         │                         │
         │                         │
         ▼                         ▼
  ┌─────────────┐           ┌─────────────┐
  │ Local State │           │ 3rd-Party   │
  │ (Zustand &  │           │ APIs        │
  │ React Query)│           │ (Gemini,    │
  └─────────────┘           │ OneCompiler,│
                            │ Cloudinary) │
                            └─────────────┘
```

## Frontend Architecture (`/client`)

The frontend uses Next.js 14 App Router.

### Directory Structure
- `/app`: Next.js App Router pages and layouts.
  - `/(auth)`: Login and registration routes.
  - `/(student)`: Student-facing routes (courses, challenges, dashboard).
  - `/(instructor)`: Instructor-facing routes (dashboard, course management).
- `/components`: Reusable UI components.
  - `/ui`: Base UI components (buttons, inputs, cards) using Tailwind and Radix UI.
  - `/courses`, `/challenges`, `/ai`: Domain-specific components.
- `/lib`: Utility functions and API client.
- `/hooks`: Custom React hooks, heavily utilizing `@tanstack/react-query` for server state.
- `/stores`: Client-side state management using `zustand` (e.g., AI chat state, Quiz state).

### Key Design Patterns
- **Server State vs Client State**: React Query handles all asynchronous data fetching, caching, and mutations. Zustand handles pure client state like "is the AI panel open?".
- **Component Composition**: Extensive use of granular components to prevent prop drilling and keep logic modular.
- **Dynamic Imports**: Heavy dependencies like Monaco Editor and Chart libraries are dynamically imported to keep the initial bundle size small.

## Backend Architecture (`/server`)

The backend is a traditional Express.js REST API using MVC-like patterns.

### Directory Structure
- `/src/controllers`: Request/Response handling logic.
- `/src/models`: Mongoose schemas.
- `/src/routes`: Express router definitions.
- `/src/middleware`: Custom middleware (auth, error handling).
- `/src/config`: Configuration files.
- `/src/services`: Integrations with external services (AI, Code Execution, Cloudinary).

### Key Design Patterns
- **Fat Models, Skinny Controllers**: Business logic is encapsulated in controllers and services, while data validation happens at the Mongoose schema level.
- **Service Layer Abstraction**: Interactions with Google Gemini and OneCompiler are wrapped in dedicated service files, allowing the underlying providers to be swapped out without affecting the core application logic.
- **Middleware-based Authentication**: JWT tokens are validated in middleware, enriching the `req.user` object for downstream controllers.
- **Centralized Error Handling**: A custom error handler middleware catches asynchronous errors and formats them into consistent JSON responses.

## External Services Integration

- **Google Gemini API**: Used for the global AI chat and context-aware hints in the coding workspace. The backend constructs prompts including the user's current context (e.g., their code and the challenge details) to get relevant responses.
- **OneCompiler API**: Executes user code safely in a sandboxed environment. The backend acts as a proxy, forwarding code execution requests to OneCompiler to protect the API key from being exposed to the client.
- **Cloudinary**: Stores course thumbnails and assets. Images are uploaded directly via the backend, which returns the secure URL.
