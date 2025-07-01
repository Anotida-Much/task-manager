# Task Manager

A full-stack Task Management System built with Node.js, Express, TypeScript, PostgreSQL, and React.

---

## Features

- User registration and login (JWT authentication)
- Create, view, update, and delete your own tasks
- Filter and paginate tasks by status and priority
- API rate limiting for security
- Responsive, modern UI (Tailwind CSS)
- Secure: password hashing, input validation, CORS, and more

---

## Tech Stack

- **Backend:** Node.js (v20+), Express (v4+), TypeScript (v5+), PostgreSQL (v15+), JWT, bcrypt
- **Frontend:** React (v18+), TypeScript, Tailwind CSS, Fetch API

---

## Project Structure

```
task-manager/
  backend/    # Node.js + Express API
  frontend/   # React + Vite client
```

---

## Getting Started

### 1. Clone the Repository
```sh
git clone (https://github.com/Anotida-Much/task-manager.git)
cd task-manager
```

### 2. Set Up the Database
- Create a PostgreSQL database:
  ```sql
  CREATE DATABASE task_manager;
  ```
- (Optional) Add test users/tasks using SQL or the app UI.

---

### 3. Configure Environment Variables

#### Backend
- Copy `backend/env.example` to `backend/.env` and fill in your DB credentials:
  ```env
  PORT=5000
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=task_manager
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  JWT_SECRET=your_jwt_secret
  JWT_EXPIRES_IN=7d
  CORS_ORIGIN=http://localhost:5173
  RATE_LIMIT_WINDOW=15 * 60 * 1000 # 15 minutes
  RATE_LIMIT_MAX=100 # max requests per window per IP
  ```

#### Frontend
- In `frontend/.env`:
  ```env
  VITE_API_URL=http://localhost:5000
  ```

---

### 4. Install Dependencies

```sh
cd backend
npm install

cd ../frontend
npm install
```

---

### 5. Run the Application

- **Start the backend:**
  ```sh
  cd backend
  npm run dev
  ```
- **Start the frontend:**
  ```sh
  cd frontend
  npm run dev
  ```
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Documentation

### Authentication
- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — User login
- `GET /api/auth/profile` — Get current user profile (protected)

### Tasks
- `GET /api/tasks` — Get user's tasks (protected, supports filtering and pagination)
  - Query params: `status`, `priority`, `page`, `limit`
- `POST /api/tasks` — Create new task (protected)
- `PUT /api/tasks/:id` — Update task (protected)
- `DELETE /api/tasks/:id` — Delete task (protected)

### Rate Limiting
- All API endpoints are protected by rate limiting middleware (default: 100 requests per 15 minutes per IP).

### Pagination
- The `GET /api/tasks` endpoint supports pagination via `page` and `limit` query parameters.

---

## TypeScript Interfaces
- User model
- Task model
- API request/response types
- JWT payload

(See `backend/src/types/` and `frontend/src/types/` for details.)

---

## Middleware
- **Authentication:** JWT-based, protects all task endpoints
- **Validation:** Joi-based request validation for auth and task routes
- **Error Handling:** Centralized error handler
- **CORS:** Configured for local development
- **Rate Limiting:** Express-rate-limit middleware

---

## Frontend Features
- Login/Register page with toggle, validation, and error handling
- Dashboard with task list/grid, filtering, sorting, and pagination
- Task form for create/edit (modal or page)
- Responsive, modern UI (Tailwind CSS)
- React hooks and context for state management
- Loading indicators and notifications

---

## Test Users

You can log in with these test users:

- **Email:** anotida@example.com  |  **Password:** password123
- **Email:** james@gmail.com      |  **Password:** password456

---

## Troubleshooting
- **TypeScript errors:** Ensure all dependencies are installed and Node.js v20+ is used
- **Build errors:** Run `npm run build` in `backend` to check for TypeScript issues
- **Frontend not connecting:** Ensure backend is running and CORS settings match
- **Database issues:** Double-check `.env` DB credentials and PostgreSQL status

---

## Assumptions & Design Decisions
- JWT is used for stateless authentication
- Rate limiting is applied globally to all API endpoints
- Pagination is implemented for task listing
- TypeScript strict mode is enabled
- All environment variables are required for local development
- The backend must be running for the frontend to work
- Sample data can be added via the UI or SQL
- For production, update CORS and JWT settings as needed
- Only 20 concurrent users are allowed to connect at once
