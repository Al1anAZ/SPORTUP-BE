# 🛠️ E-Commerce Backend API — Express + Prisma + AWS S3

A simple, clean, and scalable backend for an e-commerce platform built with **Express**, **Prisma**, **JWT authentication**, and **AWS S3** for file storage.

---

## ✨ Features

* User authentication (access & refresh tokens)
* Password hashing with bcrypt
* Product CRUD with Prisma ORM
* Image upload via AWS S3 (presigned URLs)
* Input validation using Zod
* Multer for file handling
* CORS configuration
* Cookie-based refresh token support

---

## 🧰 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express
* **ORM:** Prisma
* **Database:** (PostgreSQL / MySQL / SQLite) — your choice
* **Auth:** JSON Web Tokens (JWT)
* **Validation:** Zod
* **Password hashing:** bcrypt
* **File Uploads:** multer + AWS SDK
* **Environment Management:** dotenv

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-repo/ecommerce-backend.git
cd ecommerce-backend

# install dependencies
npm install

# run database migrations (Prisma)
npx prisma migrate dev

# start dev server
npm run dev
```

Default API URL: **[http://localhost:4000](http://localhost:4000)**

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=4000

# JWT
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_EXPIRES=   # e.g. "15m"
REFRESH_TOKEN_EXPIRES=  # e.g. "7d"
BCRYPT_SALT_ROUNDS=10

# CORS
CORS_ALLOW=http://localhost:3000

# AWS S3
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
```

---
