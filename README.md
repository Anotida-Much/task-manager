# Task Manager

A simple full-stack Task Management System built with Node.js, Express, TypeScript, PostgreSQL, and React.

---

## Features

- User registration and login (JWT authentication)
- Create, view, update, and delete your own tasks
- Filter tasks by status and priority
- Responsive, modern UI (Tailwind CSS)
- Secure: password hashing, input validation, CORS, and more

---

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, PostgreSQL, JWT, bcrypt
- **Frontend:** React, TypeScript, Tailwind CSS, Fetch API

---

## Getting Started

### 1. **Clone the Repository**
```sh
git clone <your-repo-url>
cd task-manager
```

### 2. **Set Up the Database**
- Create a PostgreSQL database:
  ```sql
  CREATE DATABASE task_manager;
  ```
- (Optional) Create test users and tasks using SQL or the app UI.

### 3. **Configure Environment Variables**

#### **Backend**
- Copy `backend/env.example` to `backend/.env` and fill in your DB credentials:
  ```
  PORT=5000
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=task_manager
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  JWT_SECRET=your_jwt_secret
  JWT_EXPIRES_IN=7d
  CORS_ORIGIN=http://localhost:5173
  ```

#### **Frontend**
- In `frontend/.env`:
  ```
  VITE_API_URL=http://localhost:5000
  ```

### 4. **Install Dependencies**

```sh
cd backend
npm install

cd ../frontend
npm install
```

### 5. **Run the App**

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

## API Endpoints

**Authentication**
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get current user (protected)

**Tasks**
- `GET /api/tasks` — List tasks (protected)
- `POST /api/tasks` — Create task (protected)
- `PUT /api/tasks/:id` — Update task (protected)
- `DELETE /api/tasks/:id` — Delete task (protected)

---

## Default Users

You can log in with these test users:

- **Email:** anotida@example.com  |  **Password:** password123
- **Email:** james@gmail.com  |  **Password:** password456

---

## Database Migration

- The backend will create tables automatically on first run using `schema.sql`.
- You can also run the SQL manually in your PostgreSQL client if needed.
- Example: `psql -U your_user -d task_manager -f backend/src/utils/schema.sql`
- Both `backend/env.example` and `frontend/.env.example` are provided for environment setup.

---

## Design Decisions

- Used JWT for stateless authentication.
- Used Tailwind CSS for rapid, responsive UI development.
- Used React Context for simple auth state management.
- Used parameterized queries to prevent SQL injection.
- Used TypeScript throughout for type safety.

---

## Known Issues / Limitations

- No email verification for new users.
- No task due dates or reminders (can be added as a bonus).
- No pagination for tasks (all tasks are loaded at once).
- No file uploads or attachments for tasks.
- No real-time updates (WebSockets).

---

## Notes

- All environment variables are required for local development.
- The backend must be running for the frontend to work.
- Sample data can be added via the UI or SQL.
- For production, update CORS and JWT settings as needed.
- Only 20 concurrent user are allow to connect at once
