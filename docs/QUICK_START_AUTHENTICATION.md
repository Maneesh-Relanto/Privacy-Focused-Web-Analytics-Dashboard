# Quick Start - Authentication API

Get the authentication system up and running in 5 minutes.

---

## ⚡ 5-Minute Setup

### 1. Install Dependencies (2 min)

```bash
npm install @prisma/client bcryptjs jsonwebtoken
```

### 2. Setup PostgreSQL (2 min)

**Option A: Docker (Easiest)**

```bash
docker run --name analytics-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=analytics_db \
  -p 5432:5432 \
  -d postgres:16
```

**Option B: Already have PostgreSQL?**

```bash
createdb analytics_db
```

### 3. Configure Database (1 min)

```bash
# Copy and edit .env
cp .env.example .env

# Update DATABASE_URL in .env:
# DATABASE_URL="postgresql://admin:password123@localhost:5432/analytics_db"
```

### 4. Create Tables (Optional - verify)

```bash
npx prisma migrate dev --name init
```

---

## 🚀 Test It Out

### Register a User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

### Save the Token

```bash
# From response, copy the accessToken value
# export TOKEN="your_token_here"
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📚 Complete Guides

For more details, see:

- **Setup Guide**: `docs/BACKEND_SETUP_GUIDE.md` (PostgreSQL, Prisma, troubleshooting)
- **API Docs**: `docs/API_DOCUMENTATION.md` (all endpoints, examples, error handling)
- **Implementation**: `.confidential/PHASE1_WEEK1_IMPLEMENTATION.md` (what was built)

---

## 🔑 Key Endpoints

| Method | Endpoint                | Purpose            |
| ------ | ----------------------- | ------------------ |
| POST   | `/api/v1/auth/register` | Create account     |
| POST   | `/api/v1/auth/login`    | Login & get tokens |
| GET    | `/api/v1/auth/me`       | Get user profile   |
| POST   | `/api/v1/auth/logout`   | Logout             |

---

## ✅ Checklist

- [ ] Install dependencies
- [ ] Setup PostgreSQL
- [ ] Create `.env` with DATABASE_URL
- [ ] Run `npx prisma migrate dev`
- [ ] Test register endpoint
- [ ] Test login endpoint
- [ ] Test get user endpoint

---

**Having issues?** Check `docs/BACKEND_SETUP_GUIDE.md` troubleshooting section.
