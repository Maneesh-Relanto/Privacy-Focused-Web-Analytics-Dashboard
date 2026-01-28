# API Documentation - Authentication Endpoints

**[← Back to README](../README.md)** | **[Documentation Index](./INDEX.md)** | **[Developer Guide](./DEVELOPER_GUIDE.md)** | **[Website Management](./WEBSITE_MANAGEMENT_GUIDE.md)**

**Base URL**: `http://localhost:3000/api/v1`

---

## Authentication Endpoints

### 1. Register User

**Endpoint**: `POST /auth/register`

**Description**: Create a new user account and receive authentication tokens.

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe" // optional
}
```

**Password Requirements**:

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

**Response** (201 Created):

```json
{
  "user": {
    "id": "clm1234567890abcdef",
    "email": "user@example.com",
    "name": "John Doe",
    "apiKey": "pk_test_abcdef1234567890",
    "createdAt": "2024-01-28T10:30:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
}
```

**Error Responses**:

- **400 Bad Request** - Invalid input

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid request body",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "password": ["Password must contain at least one uppercase letter"]
    }
  }
}
```

- **409 Conflict** - Email already registered

```json
{
  "error": "CONFLICT",
  "message": "Email already registered"
}
```

**Example cURL**:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

---

### 2. Login User

**Endpoint**: `POST /auth/login`

**Description**: Authenticate with email and password to receive tokens.

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response** (200 OK):

```json
{
  "user": {
    "id": "clm1234567890abcdef",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-28T10:30:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
}
```

**Error Responses**:

- **401 Unauthorized** - Invalid credentials

```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid email or password"
}
```

- **403 Forbidden** - Account inactive

```json
{
  "error": "FORBIDDEN",
  "message": "Account is inactive"
}
```

**Example cURL**:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

---

### 3. Get Current User

**Endpoint**: `GET /auth/me`

**Description**: Get authenticated user profile information.

**Request Headers**:

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Response** (200 OK):

```json
{
  "user": {
    "id": "clm1234567890abcdef",
    "email": "user@example.com",
    "name": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-28T10:30:00Z"
  }
}
```

**Error Responses**:

- **401 Unauthorized** - Missing or invalid token

```json
{
  "error": "UNAUTHORIZED",
  "message": "Authentication required"
}
```

- **404 Not Found** - User not found

```json
{
  "error": "NOT_FOUND",
  "message": "User not found"
}
```

**Example cURL**:

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

---

### 4. Logout User

**Endpoint**: `POST /auth/logout`

**Description**: Logout user (invalidate token). In production, tokens should be blacklisted.

**Request Headers**:

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Response** (200 OK):

```json
{
  "message": "Logged out successfully"
}
```

**Example cURL**:

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Authentication Flow

### Registration Flow

```
1. POST /auth/register
   ├─ Validate email & password
   ├─ Check if email exists
   ├─ Hash password with bcrypt
   ├─ Generate API key
   ├─ Create user in database
   └─ Return tokens & user info

2. User receives accessToken + refreshToken
3. Store tokens securely in localStorage/sessionStorage
```

### Login Flow

```
1. POST /auth/login
   ├─ Validate credentials
   ├─ Find user by email
   ├─ Verify password hash
   ├─ Check if account is active
   └─ Generate tokens

2. User receives accessToken + refreshToken
3. Store tokens in client
```

### Protected Route Access

```
1. Client includes: Authorization: Bearer <token>
2. Middleware verifies JWT signature
3. Middleware decodes token to get userId & email
4. Request proceeds with user info in req.user
```

---

## Token Structure

### Access Token

```
Payload: {
  userId: "clm1234567890abcdef",
  email: "user@example.com",
  iat: 1706425800,
  exp: 1707030600
}
Expires in: 7 days
```

### Refresh Token

```
Payload: {
  userId: "clm1234567890abcdef",
  email: "user@example.com",
  iat: 1706425800,
  exp: 1707030600
}
Expires in: 7 days
Note: In production, should have longer expiry and be stored separately
```

---

## Using the API

### JavaScript/Fetch Example

```javascript
// 1. Register
const registerResponse = await fetch(
  "http://localhost:3000/api/v1/auth/register",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user@example.com",
      password: "SecurePass123",
      name: "John Doe",
    }),
  },
);

const { tokens } = await registerResponse.json();
localStorage.setItem("accessToken", tokens.accessToken);

// 2. Get user profile
const userResponse = await fetch("http://localhost:3000/api/v1/auth/me", {
  headers: {
    Authorization: `Bearer ${tokens.accessToken}`,
  },
});
const { user } = await userResponse.json();
console.log("Current user:", user);

// 3. Logout
await fetch("http://localhost:3000/api/v1/auth/logout", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${tokens.accessToken}`,
  },
});
```

---

## Error Handling

### Common Error Codes

| Code             | Status | Meaning                          |
| ---------------- | ------ | -------------------------------- |
| VALIDATION_ERROR | 400    | Invalid request format           |
| UNAUTHORIZED     | 401    | Missing or invalid token         |
| FORBIDDEN        | 403    | Access denied (inactive account) |
| CONFLICT         | 409    | Resource already exists          |
| NOT_FOUND        | 404    | Resource not found               |
| INTERNAL_ERROR   | 500    | Server error                     |

### Error Response Format

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable message",
  "details": {} // optional
}
```

---

## Security Notes

### Access Token

- ✅ Short-lived (7 days)
- ✅ Sent with every protected request
- ✅ Should NOT be stored in localStorage (XSS vulnerable)
- 🔒 Best: Store in secure HTTP-only cookie (if SameSite=Strict)

### Refresh Token

- ✅ Longer-lived
- ✅ Used to get new access tokens
- ✅ Should be stored securely
- 🔒 Best: HTTP-only cookie with rotation

### Password Storage

- ✅ Bcrypt with salt (10 rounds)
- ✅ Never log or return passwords
- ✅ Password validation on registration

### API Keys

- ✅ Generated for tracking script
- ✅ Hashed and stored in database
- ✅ Format: `pk_` prefix + 32 random characters

---

## Next Steps

- Implement refresh token rotation
- Add rate limiting (100 requests per 15 minutes)
- Add email verification
- Add password reset flow
- Add 2FA support
- Implement token blacklist/revocation
