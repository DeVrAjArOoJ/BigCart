# BigCart — E-Commerce Web Application

A full-stack MERN e-commerce starter with product management, cart, checkout, authentication, role-based admin access, order history, and order tracking.

## Tech stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs

## Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## 1. Configure the backend
```bash
cd server
cp .env.example .env
```
Edit `server/.env` and set `MONGO_URI` and a long random `JWT_SECRET`.

Install and start:
```bash
npm install
npm run seed
npm run dev
```
The seed command creates a demo admin account and sample products. Demo admin:
- Email: `admin@shopsphere.local`
- Password: `Admin123!`

Change the password and secret before deploying. The seed command will not overwrite an existing account with that email.

## 2. Configure the frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Main features
- Product catalogue with search and category filter
- Product details and add-to-cart
- Register / login with JWT authentication
- Cart quantity controls and checkout
- Order history and order tracking
- Admin dashboard to add, edit, and delete products
- Admin order management to update status
- Server-side validation and protected routes

## Important notes
- This is a learning/demo project, not a production-ready commerce system.
- Checkout creates an order but does not charge a payment method.
- For production, add a payment gateway, rate limiting, email verification, password reset, audit logging, tests, and stronger deployment/security configuration.
