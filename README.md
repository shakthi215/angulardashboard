# NexusDash — Enterprise Intelligence Platform

A full-stack Angular 17 + Node.js (TypeScript) + MongoDB Atlas SPA with role-based access control, async API processing demonstration, and a creative dark and light UI.

Live Frontend: https://angulardashboard-sigma.vercel.app/

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v9+
- Angular CLI v17: `npm install -g @angular/cli@17`
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier works)

---

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free cluster
2. In **Database Access**: create a user with read/write access
3. In **Network Access**: add `0.0.0.0/0` (allow all IPs) or your specific IP
4. Click **Connect → Drivers** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
   ```

---

### 2. Backend Setup

```bash
cd angular-dashboard-app/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Edit `.env` and fill in your MongoDB Atlas URI:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/angular_dashboard?retryWrites=true&w=majority
JWT_SECRET=supersecret_change_me_in_production_2024
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

```bash
# Seed the database with demo users and records
npm run seed

# Start the development server
npm run dev
```

Backend will run at: **http://localhost:3000**

---

### 3. Frontend Setup

```bash
cd angular-dashboard-app/frontend

# Install dependencies
npm install

# Start the Angular dev server
npm start
```

Frontend will run at: **http://localhost:4200**

---

## 🔑 Demo Credentials

| Role         | User ID   | Password   |
|--------------|-----------|------------|
| Admin        | ADMIN001  | Admin@123  |
| General User | USR001    | User@123   |

> Or use the **Quick Demo** buttons on the login page.

---

## ✨ Features

### 1. Login Page
- Custom-built form with **User ID, Password, Role** fields
- Role selector (General User / Admin) as interactive pill buttons
- Animated dark background with floating orbs & particles
- JWT-based authentication stored in localStorage
- Input validation + error feedback

### 2. Dashboard (Logged-In Page)
- **User profile header** showing username, department, last login
- **Stats cards** for Total, Active, Pending, Critical, Resolved records
- **Records table** with pagination, search, status/priority filters
- **Role-based access**: General Users see Public/Restricted records; Admins see all including Confidential
- **Async loading demo**: Choose API delay (0 / 1s / 2s / 4s) to observe parallel async processing — profile, stats, and records load independently via `forkJoin` + separate `finalize` loading states

### 3. Admin Panel (Admin only)
- **User Management** with card grid layout
- Create, Edit, Toggle Status, Delete users
- Search and filter by role/status
- **Simulate API delay** to demo async processing
- Modal dialog form with reactive validation

### 4. Architecture Highlights
- **Lazy-loaded feature modules**: `AuthModule`, `DashboardModule`, `AdminModule`
- **Route guards**: `AuthGuard` (protected routes), `AdminGuard` (admin-only routes)
- **HTTP interceptors**: JWT injection + global loading indicator
- **Services**: `AuthService`, `RecordService`, `UserService`, `LoadingService`, `NotificationService`
- **Delay middleware** on the backend: append `?delay=2000` to any API call

---

## 📡 API Endpoints

### Auth
| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| POST   | /api/auth/login     | Login + get JWT      |
| GET    | /api/auth/profile   | Get current user     |
| POST   | /api/auth/logout    | Logout               |

### Records (Authenticated)
| Method | Endpoint            | Description                    |
|--------|---------------------|--------------------------------|
| GET    | /api/records        | Get records (role-filtered)    |
| GET    | /api/records/stats  | Get dashboard stats            |
| GET    | /api/records/:id    | Get single record              |

### Admin (Admin only)
| Method | Endpoint                          | Description        |
|--------|-----------------------------------|--------------------|
| GET    | /api/admin/users                  | List all users     |
| POST   | /api/admin/users                  | Create user        |
| PUT    | /api/admin/users/:id              | Update user        |
| PATCH  | /api/admin/users/:id/toggle-status| Toggle active      |
| DELETE | /api/admin/users/:id              | Delete user        |

### Async Delay Demo
Append `?delay=<milliseconds>` to any endpoint:
```
GET /api/records?delay=2000
GET /api/records/stats?delay=3000
```

---

## 🛠️ Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Angular 17, Angular Material, RxJS, SCSS|
| Backend   | Node.js, Express, TypeScript            |
| Database  | MongoDB Atlas (Mongoose ODM)            |
| Auth      | JWT (jsonwebtoken), bcryptjs            |
| Security  | helmet, cors, express-rate-limit        |
