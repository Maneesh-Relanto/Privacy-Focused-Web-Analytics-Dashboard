#!/bin/bash

# API Base URL
API="http://localhost:3000/api/v1"

# Step 1: Register a new user
echo "=== Step 1: Register User ==="
REG_RESPONSE=$(curl -s -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"siteman@example.com",
    "password":"Password123",
    "name":"Site Manager"
  }')

echo "$REG_RESPONSE"

# Extract token using grep/sed (simple parsing)
TOKEN=$(echo "$REG_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo ""
echo "Token: $TOKEN"
echo ""

# Step 2: Create a website
echo "=== Step 2: Create Website ==="
curl -s -X POST "$API/websites" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"Tech Blog",
    "domain":"https://techblog.example.com",
    "description":"A tech blog about modern web development"
  }'
echo ""
echo ""

# Step 3: List websites
echo "=== Step 3: List Websites ==="
curl -s -X GET "$API/websites" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# Step 4: Create another website
echo "=== Step 4: Create Second Website ==="
curl -s -X POST "$API/websites" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"Portfolio",
    "domain":"https://portfolio.example.com"
  }'
echo ""
echo ""

# Step 5: List websites again
echo "=== Step 5: List Websites Again (to see both) ==="
curl -s -X GET "$API/websites" \
  -H "Authorization: Bearer $TOKEN"
echo ""
