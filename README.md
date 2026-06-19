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
<img width="1917" height="837" alt="finwise_1" src="https://github.com/user-attachments/assets/5bf061be-4109-4bab-9eb3-f2540b76a205" />
<img width="1917" height="836" alt="finwise_2" src="https://github.com/user-attachments/assets/30861db7-1eac-466e-b660-0abea912c176" />
<img width="1917" height="835" alt="finwise_3" src="https://github.com/user-attachments/assets/2bac81ed-2175-4ca5-b33d-bb8af4706a24" />
<img width="1917" height="832" alt="finwise_4" src="https://github.com/user-attachments/assets/22ce4ea2-e361-4665-b865-435ab9f6e457" />

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

## Contact & Support

For inquiries, support, or further information regarding the Finwise project, please contact:
- **Email:** [finwise9@gmail.com](mailto:finwise9@gmail.com)

---
*© 2026 Finwise. All rights reserved.*
