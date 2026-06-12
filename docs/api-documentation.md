# API Documentation

The CodeLoom backend provides a RESTful API. All endpoints are prefixed with `/api/v1`.

## Authentication & Authorization

All protected routes require a Bearer token in the `Authorization` header.
```
Authorization: Bearer <your_jwt_token>
```

Roles are strictly enforced. A Student cannot access Instructor endpoints, and vice versa.

## Core Endpoints

### Auth (`/auth`)
- `POST /register` - Register a new user (student or instructor).
- `POST /login` - Authenticate and receive JWT token.
- `GET /me` - Get current logged-in user details.

### Courses (`/courses` & `/instructor/courses`)
- `GET /courses` - Get all published courses (public).
- `GET /courses/:id` - Get course details (public).
- `GET /courses/:id/learn` - Get course content for learning (requires enrollment).
- `GET /instructor/courses` - Get courses created by the current instructor.
- `POST /instructor/courses` - Create a new course (Instructor only).
- `PUT /instructor/courses/:id` - Update a course (Instructor only).
- `DELETE /instructor/courses/:id` - Delete a course (Instructor only).

### Progress (`/progress`)
- `GET /progress` - Get student's overall progress across all courses.
- `POST /progress/enroll` - Enroll in a course.
- `PUT /progress` - Update progress (mark lesson complete).

### Challenges (`/challenges`)
- `GET /challenges` - List all coding challenges.
- `GET /challenges/:id` - Get specific challenge details.
- `POST /challenges/:id/run` - Execute code against visible test cases.
- `POST /challenges/:id/submit` - Execute code against all test cases and record score.

### AI Assistant (`/ai`)
- `POST /ai/chat` - Send a message to the AI assistant with optional context.
- `POST /ai/hint` - Request a smart hint for a coding challenge.
- `POST /ai/generate-quiz` - (Instructor) Generate a quiz based on a topic.

### Certificates (`/certificates`)
- `GET /certificates` - Get all certificates earned by the student.
- `GET /certificates/:id` - Verify a specific certificate by ID.

### Uploads (`/uploads`)
- `POST /uploads/thumbnail` - Upload an image to Cloudinary (Instructor only).

## Error Handling

The API returns standard HTTP status codes:
- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient role permissions
- `404 Not Found` - Resource does not exist
- `500 Internal Server Error` - Server-side issue

Error responses follow a consistent format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

Success responses follow:
```json
{
  "success": true,
  "data": { ... }
}
```
