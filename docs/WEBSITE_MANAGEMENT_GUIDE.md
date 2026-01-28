# Website Management API Guide

This guide explains how to use the website management endpoints to register and manage websites for analytics tracking.

---

## Overview

Before you can track analytics for a website, you need to:

1. **Register a user account** - Create an account via `/api/v1/auth/register`
2. **Login** - Get an access token via `/api/v1/auth/login`
3. **Create a website** - Register your website via `/api/v1/websites`
4. **Use the tracking code** - Embed the tracking code on your website

---

## Endpoints

### Create a Website

**Endpoint**: `POST /api/v1/websites`

**Authentication**: Required (Bearer token)

**Request Body**:

```json
{
  "name": "My Blog",
  "domain": "https://example.com",
  "description": "My personal blog"
}
```

**Response** (201 Created):

```json
{
  "id": "clp0a1b2c3d4e5f6g7h8i9j0",
  "userId": "clp0a1b2c3d4e5f6g7h8i9j0",
  "name": "My Blog",
  "domain": "https://example.com",
  "description": "My personal blog",
  "trackingCode": "pm-a7x9k2-1706425600000",
  "createdAt": "2026-01-28T10:30:00.000Z",
  "updatedAt": "2026-01-28T10:30:00.000Z"
}
```

---

### List All Websites

**Endpoint**: `GET /api/v1/websites`

**Authentication**: Required (Bearer token)

**Response**:

```json
{
  "websites": [
    {
      "id": "clp0a1b2c3d4e5f6g7h8i9j0",
      "userId": "clp0a1b2c3d4e5f6g7h8i9j0",
      "name": "My Blog",
      "domain": "https://example.com",
      "description": "My personal blog",
      "trackingCode": "pm-a7x9k2-1706425600000",
      "createdAt": "2026-01-28T10:30:00.000Z",
      "updatedAt": "2026-01-28T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

### Get Website Details

**Endpoint**: `GET /api/v1/websites/:id`

**Authentication**: Required (Bearer token)

**Response**:

```json
{
  "id": "clp0a1b2c3d4e5f6g7h8i9j0",
  "userId": "clp0a1b2c3d4e5f6g7h8i9j0",
  "name": "My Blog",
  "domain": "https://example.com",
  "description": "My personal blog",
  "trackingCode": "pm-a7x9k2-1706425600000",
  "createdAt": "2026-01-28T10:30:00.000Z",
  "updatedAt": "2026-01-28T10:30:00.000Z"
}
```

---

### Update Website

**Endpoint**: `PUT /api/v1/websites/:id`

**Authentication**: Required (Bearer token)

**Request Body** (all fields optional):

```json
{
  "name": "Updated Blog Name",
  "domain": "https://newdomain.com",
  "description": "Updated description"
}
```

**Response**:

```json
{
  "id": "clp0a1b2c3d4e5f6g7h8i9j0",
  "userId": "clp0a1b2c3d4e5f6g7h8i9j0",
  "name": "Updated Blog Name",
  "domain": "https://newdomain.com",
  "description": "Updated description",
  "trackingCode": "pm-a7x9k2-1706425600000",
  "createdAt": "2026-01-28T10:30:00.000Z",
  "updatedAt": "2026-01-28T11:00:00.000Z"
}
```

---

### Delete Website

**Endpoint**: `DELETE /api/v1/websites/:id`

**Authentication**: Required (Bearer token)

**Response**:

```json
{
  "success": true,
  "message": "Website deleted successfully"
}
```

---

## Testing with cURL

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

Save the `accessToken` from the response.

### 3. Create a Website

```bash
curl -X POST http://localhost:3000/api/v1/websites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "My Blog",
    "domain": "https://example.com",
    "description": "My personal blog"
  }'
```

### 4. List All Websites

```bash
curl -X GET http://localhost:3000/api/v1/websites \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Get Website Details

```bash
curl -X GET http://localhost:3000/api/v1/websites/WEBSITE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 6. Update Website

```bash
curl -X PUT http://localhost:3000/api/v1/websites/WEBSITE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Updated Blog Name",
    "description": "Updated description"
  }'
```

### 7. Delete Website

```bash
curl -X DELETE http://localhost:3000/api/v1/websites/WEBSITE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Error Responses

### 400 - Validation Error

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid request body",
  "details": {
    "fieldErrors": {
      "domain": ["Invalid domain URL"]
    }
  }
}
```

### 401 - Unauthorized

```json
{
  "error": "UNAUTHORIZED",
  "message": "Missing or invalid authorization header"
}
```

### 404 - Not Found

```json
{
  "error": "NOT_FOUND",
  "message": "Website not found"
}
```

### 409 - Conflict (Duplicate Domain)

```json
{
  "error": "CONFLICT",
  "message": "This domain is already registered for your account"
}
```

### 500 - Server Error

```json
{
  "error": "INTERNAL_ERROR",
  "message": "Failed to create website"
}
```

---

## Tracking Code

Each website is automatically assigned a unique tracking code when created. This code is used to identify your website when submitting analytics events.

**Format**: `pm-{random}-{timestamp}`

**Example**: `pm-a7x9k2-1706425600000`

You can use the tracking code in your website to:

- Initialize the tracking script
- Submit events to the analytics API
- Validate incoming analytics data on the backend

---

## Next Steps

Once you've registered a website, you can:

1. Embed the tracking script on your website (coming in Phase 2)
2. Track page views and user interactions
3. View analytics data in the dashboard
4. Access detailed metrics via the API endpoints
