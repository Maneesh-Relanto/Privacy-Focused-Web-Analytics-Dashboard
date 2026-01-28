# Backend Setup Guide - Phase 1 Week 1

This guide walks you through setting up the authentication backend with PostgreSQL and Prisma ORM.

---

## 📋 Prerequisites

- **Node.js**: 22.x or higher
- **npm/pnpm**: 10.14.0 or higher
- **PostgreSQL**: 14.x or higher (or Docker)

---

## Step 1: PostgreSQL Installation

Choose one of these options:

### Option A: Docker (Recommended - Easiest)

```bash
# Create and start PostgreSQL container
docker run --name privacy-analytics-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=analytics_db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:16

# Verify it's running
docker ps
```

**Connection String for `.env`:**
```
DATABASE_URL="postgresql://admin:password123@localhost:5432/analytics_db"
```

---

### Option B: macOS (Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create database and user
createdb analytics_db
psql analytics_db -c "CREATE USER admin WITH PASSWORD 'password123';"
psql analytics_db -c "ALTER USER admin CREATEDB;"
```

**Connection String for `.env`:**
```
DATABASE_URL="postgresql://admin:password123@localhost:5432/analytics_db"
```

---

### Option C: Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres createdb analytics_db
sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD 'password123';"
sudo -u postgres psql -c "ALTER USER admin CREATEDB;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE analytics_db TO admin;"
```

**Connection String for `.env`:**
```
DATABASE_URL="postgresql://admin:password123@localhost:5432/analytics_db"
```

---

### Option D: Windows

1. Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer:
   - Choose version: PostgreSQL 16
   - Port: 5432 (default)
   - Username: admin
   - Password: password123 (remember this!)
   - Installation directory: default
3. pgAdmin will open after installation - you can use it to verify

**Connection String for `.env`:**
```
DATABASE_URL="postgresql://admin:password123@localhost:5432/analytics_db"
```

---

## Step 2: Setup Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and update DATABASE_URL
# DATABASE_URL="postgresql://admin:password123@localhost:5432/analytics_db"
```

---

## Step 3: Install Prisma & Dependencies

```bash
# Install Prisma and required packages
npm install -D prisma @prisma/client
npm install bcryptjs jsonwebtoken express cors
npm install -D @types/bcryptjs @types/jsonwebtoken @types/cors

# Or with pnpm
pnpm add -D prisma @prisma/client
pnpm add bcryptjs jsonwebtoken express cors
pnpm add -D @types/bcryptjs @types/jsonwebtoken @types/cors
```

---

## Step 4: Initialize Prisma

Prisma should auto-detect the existing schema, but run this to confirm:

```bash
# Generate Prisma client
npx prisma generate

# Optionally view the schema
npx prisma studio
```

---

## Step 5: Create Database Tables

```bash
# Run migrations to create tables
npx prisma migrate dev --name init

# If you get an error about existing tables, use:
npx prisma db push --force-reset
```

**What this does:**
1. Creates all tables based on `prisma/schema.prisma`
2. Generates Prisma Client for queries
3. Creates `.prisma/migrations/` folder with migration history

---

## Step 6: Verify Database Setup

```bash
# Open Prisma Studio (web UI to view database)
npx prisma studio

# This opens http://localhost:5555 where you can:
# - View all tables
# - Create, read, update, delete records
# - Test relationships
```

---

## Step 7: Test Database Connection

Create a test file `test-db.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Test connection
  const userCount = await prisma.user.count()
  console.log(`✅ Connected to database. Users: ${userCount}`)
  
  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed_password_here'
    }
  })
  console.log('✅ Test user created:', user.id)
  
  // Clean up
  await prisma.user.delete({ where: { id: user.id } })
  console.log('✅ Test user deleted')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run it:
```bash
npx tsx test-db.ts
```

---

## Step 8: Database Schema Overview

Your database has these key tables:

### **users**
- Stores user accounts
- Fields: id, email, password, apiKey, createdAt, etc.

### **websites**
- Tracks different domains users are monitoring
- Fields: id, userId, domain, trackingCode, etc.

### **events**
- Raw analytics events from websites
- Fields: id, websiteId, eventType, pageUrl, timestamp, properties, etc.

### **sessions**
- User sessions grouped by visitor
- Fields: id, websiteId, startTime, endTime, duration, etc.

### **visitors**
- Anonymous visitor profiles
- Fields: id, websiteId, fingerprint, pageViews, etc.

### **aggregated_metrics**
- Pre-calculated hourly/daily metrics for performance
- Fields: id, websiteId, bucket, pageViews, uniqueVisitors, etc.

### **page_analytics**
- Per-page statistics
- Fields: id, websiteId, pageUrl, views, bounceRate, etc.

---

## Troubleshooting

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Docker
docker ps | grep postgres
```

### Database Already Exists
```
error: database "analytics_db" already exists
```
**Solution**: Drop and recreate
```bash
# Remove the container (Docker)
docker rm postgres-analytics

# Or drop database (native)
sudo -u postgres dropdb analytics_db
```

### Schema Mismatch
```
Prisma schema out of sync with database
```
**Solution**: 
```bash
# Reset everything
npx prisma migrate reset

# Or force push schema
npx prisma db push --force-reset
```

### Prisma Client Not Generated
```
Cannot find module '@prisma/client'
```
**Solution**:
```bash
npm install @prisma/client
npx prisma generate
```

---

## Next Steps

Once setup is complete:

1. ✅ Database configured and tables created
2. ⏭️ Implement authentication endpoints:
   - `POST /api/v1/auth/register` - User registration
   - `POST /api/v1/auth/login` - User login
   - `POST /api/v1/auth/refresh` - Token refresh
3. ⏭️ Add JWT middleware for protected routes
4. ⏭️ Implement API key generation for tracking script

---

## Useful Commands

```bash
# View database in web UI
npx prisma studio

# Generate Prisma client (after schema changes)
npx prisma generate

# Create a migration
npx prisma migrate dev --name <migration_name>

# Reset database (warning: deletes all data)
npx prisma migrate reset

# Seed database with initial data
npx prisma db seed

# Pull schema from existing database
npx prisma db pull

# Format Prisma schema
npx prisma format
```

---

## Security Notes

**For Development:**
- Using default credentials in `.env` is fine
- Keep `.env` in `.gitignore` (already done)

**For Production:**
- Use strong passwords: `pwgen 32 1` or generate with `openssl rand -base64 32`
- Store credentials in environment variables or secrets manager
- Use connection pooling (PgBouncer)
- Enable SSL/TLS for database connections
- Set up automated backups
- Use read replicas for high availability

**Connection String Format (Production):**
```
postgresql://user:password@host:port/database?sslmode=require&schema=public
```

---

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Studio Guide](https://www.prisma.io/studio)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
