# TaskVerse – Full Stack Personal Task Manager

TaskVerse is a full stack web application for personal task management. Each user has their own private environment where they can create, manage, and track their tasks, progress, and time logs.

## Technologies

- **Frontend**: React (with Vite + TypeScript), React Router, Axios, CSS Modules
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT authentication
- **Other**: Semantic HTML, form handling, RESTful API, per-user access

## Features

- User authentication (register, login) using JWT
- Each user has access only to their own data
- Core entities:
  - User
  - Task
  - Category
  - Tag
  - TimeLog
- Task management: CRUD, filters, and associations
- Organized routing and styling (CSS Modules)
- Ready for deployment (Vercel/Netlify for frontend, Render/Railway for backend)
