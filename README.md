# ✈️ Wanderlist

A full-stack travel wishlist and journal app. Explore destinations, track your trips, build day-by-day itineraries and visualize your travels on a world map.

---

## Tech Stack

**Frontend**
- React + Vite
- React Router
- Context API
- Dexie.js (IndexedDB for photo storage)
- D3.js + TopoJSON (world map)

**Backend**
- Node.js + Express
- PostgreSQL
- Drizzle ORM
- JWT authentication
- bcrypt password hashing
- Swagger UI

---

## Features

- 🌍 Browse destinations as a guest or logged-in user
- 🔐 Register and login with hashed passwords and JWT
- 📌 Mark destinations as Wishlist / Planned / Visited
- ⭐ Rate visited destinations
- 📷 Upload travel photos (stored in IndexedDB)
- 🗓️ Build day-by-day itineraries for planned trips
- ❤️ Like / favourite destinations
- 🗺️ View visited and planned countries on a world map
- 📖 Travel journal page for visited destinations
- 📄 Paginated destination list

---

## Prerequisites

- Node.js v18+
- PostgreSQL 14+

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/tum-web-lab6.git
cd tum-web-lab6
```

### 2. Set up the database

Make sure PostgreSQL is running:

```bash
brew services start postgresql@16   # macOS
# or
sudo service postgresql start       # Linux
```

Create the database:

```bash
createdb wanderlist
```

### 3. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3001
JWT_SECRET=your_secret_key_here
DATABASE_URL=postgresql://your_username@localhost:5432/wanderlist
```

Generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:3001`
Swagger docs at `http://localhost:3001/api-docs`

### 4. Set up the frontend

Open a new terminal in the project root:

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the Express server (default: 3001) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `DATABASE_URL` | PostgreSQL connection string |

### Frontend (`.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (default: http://localhost:3001/api) |
| `VITE_UNSPLASH_ACCESS_KEY` | Unsplash API key for destination images |


---

## Project Structure

```
tum-web-lab6/
├── src/                        # React frontend
│   ├── components/             # Reusable components
│   ├── context/                # React context (Auth, App)
│   ├── pages/                  # Page components
│   ├── services/               # API calls and IndexedDB
│   └── styles/                 # CSS files
│
├── backend/                    # Express backend
│   ├── src/
│   │   ├── config/             # Database connection
│   │   ├── controllers/        # Route handlers
│   │   ├── db/                 # Drizzle schema
│   │   ├── middleware/         # JWT auth middleware
│   │   └── routes/             # Express routes
│   ├── drizzle/                # Generated migrations
│   └── index.js                # Server entry point
│
├── public/                     # Static assets
└── index.html
```

---

## Running Both Servers

```bash
# Terminal 1 — frontend
npm run dev

# Terminal 2 — backend
cd backend && npm run dev
```