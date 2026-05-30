# Premium Scholars

A full-stack web platform for university students combining a beauty e-commerce shop, a structured mentorship program, and a first-year requirements ordering system.

## Tech Stack

- **Frontend** — React 18, TypeScript, Vite, Tailwind CSS 3, React Router v6, Axios
- **Backend**  — Node.js, Express 4, TypeScript, MongoDB, Mongoose 8, JWT, Multer, bcryptjs

## Project Structure

premium-scholars/
├── frontend/   # React + TypeScript + Vite
└── backend/    # Node.js + Express + TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone and install

```bash
git clone https://github.com/your-username/premium-scholars.git
cd premium-scholars

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env — set VITE_API_URL (default: http://localhost:5000/api)
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- Admin account: `admin@premiumscholars.co.ke` / `Admin@1234`
- 10 mentor verification codes (visible in admin panel)

### 4. Start development servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000/api  
Uploads: http://localhost:5000/uploads

## User Roles

| Role   | Can do |
|--------|--------|
| Admin  | Everything. Create/edit/delete products, news, users. Manage mentors and orders. |
| Mentor | View own mentees. Access mentor dashboard. |
| Mentee | Browse freely. Place orders (authenticated). View assigned mentor. |

## Mentor Code Flow

1. Admin generates codes at **Admin Panel → Mentors → Generate Code**
2. Admin shares the code manually (email, WhatsApp, etc.)
3. User registers with role = Mentor and enters the code
4. Code is marked used — cannot be reused

## Key API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET  | /api/auth/me | Any | Current user |
| GET  | /api/beauty | — | List beauty products |
| POST | /api/beauty | Admin | Create beauty product |
| GET  | /api/requirements | — | List requirements items |
| POST | /api/requirements/order | Any | Place order |
| GET  | /api/mentorship/my-mentees | Mentor | Mentor's mentees |
| GET  | /api/news | — | All news posts |
| POST | /api/news | Admin | Publish news post |
| GET  | /api/admin/summary | Admin | Dashboard stats |
| GET  | /api/admin/mentors | Admin | All mentors + counts |
| GET  | /api/admin/mentees/:id | Admin | Mentee by ID |

## Deployment Notes

- Set `NODE_ENV=production` in backend `.env`
- Use a process manager like PM2 for the backend: `pm2 start dist/server.js`
- Serve the frontend build with Nginx or a static host (Vercel, Netlify)
- Point your Nginx proxy to the backend for `/api` and `/uploads` routes
- Use MongoDB Atlas for the database in production
- Change `JWT_SECRET` to a long random string — never use the default
- Change the seeded admin password immediately after first login

