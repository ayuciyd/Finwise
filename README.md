# FinWise 💰

FinWise is a full-stack personal finance tracker and budget planner designed for university students. It helps users track spending, hit saving goals, and get visual insights into their financial health.

## Project Structure

```
FinWise/
├── client/     # React + Vite + Tailwind CSS (Frontend)
├── server/     # Express.js + Node.js (Backend API)
└── README.md   # Root documentation
```

## Features
- **Interactive Dashboard:** Dynamic remaining budget trackers, spent indicators, and transaction insights.
- **Budget Categories:** Setup spending categories (Food, Transport, Utilities, etc.) with strict monthly limit bars.
- **Savings Goals:** Track motivational goals (Macbook, Goa Trip) with an integrated savings projection calculator.
- **Financial Reports:** Generate monthly, quarterly, or yearly spend and savings breakdowns.
- **Surplus Auto-Transfer:** Scan the previous month for leftover budgets and prompt users to invest them.

---

## Local Setup

### Prerequisite
Make sure you have Node.js and PostgreSQL installed.

### 1. Database Configuration
Create a PostgreSQL database and write down your connection string.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and set your credentials:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```
4. Run the server locally:
   ```bash
   node server.js
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and set the backend API endpoint:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## Deployment Configuration

- **Database:** Supabase (PostgreSQL - Connection Pooler URL recommended)
- **Hosting Service:** Render (Web Service - serves both React frontend assets and Express API)
