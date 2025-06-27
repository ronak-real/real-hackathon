# SpendWise Backend API Test Curls

## Prerequisites
- Replace `http://localhost:5000` with your deployed backend URL
- Save the user ID from login/register response for authenticated requests

## 1. Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

## 2. Authentication

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123",
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Login with Demo Account
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "password": "demo123"
  }'
```

### Login with Your Account
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

## 3. Income Management (Authenticated)

### Add Income
```bash
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{
    "amount": 50000,
    "source": "Monthly Salary",
    "type": "recurring",
    "category": "employment"
  }'
```

### Get All Income
```bash
curl -X GET http://localhost:5000/api/income \
  -H "x-user-id: user_1"
```

## 4. Expense Management (Authenticated)

### Add Expense
```bash
curl -X POST http://localhost:5000/api/expense \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{
    "amount": 5000,
    "description": "Grocery Shopping",
    "type": "one-time",
    "category": "food"
  }'
```

### Add Another Expense
```bash
curl -X POST http://localhost:5000/api/expense \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{
    "amount": 2000,
    "description": "Uber rides",
    "type": "recurring",
    "category": "transport"
  }'
```

### Get All Expenses
```bash
curl -X GET http://localhost:5000/api/expenses \
  -H "x-user-id: user_1"
```

## 5. Goals Management (Authenticated)

### Create a Goal
```bash
curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{
    "title": "Emergency Fund",
    "targetAmount": 100000,
    "category": "savings",
    "deadline": "2024-12-31"
  }'
```

### Create Another Goal
```bash
curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{
    "title": "Vacation to Goa",
    "targetAmount": 50000,
    "category": "travel",
    "deadline": "2024-06-30"
  }'
```

### Get All Goals
```bash
curl -X GET http://localhost:5000/api/goals \
  -H "x-user-id: user_1"
```

### Add Funds to Goal (use goal ID from previous response)
```bash
curl -X PATCH http://localhost:5000/api/goals/goal_1/fund \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{
    "amount": 10000
  }'
```

## 6. Dashboard Summary (Authenticated)
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "x-user-id: user_1"
```

## 7. Financial Advisor (Authenticated)

### Get Advice for Affordable Expense
```bash
curl -X POST http://localhost:5000/api/advice \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{
    "expenseAmount": 1000,
    "expenseCategory": "entertainment",
    "description": "Movie tickets"
  }'
```

### Get Advice for Expensive Purchase
```bash
curl -X POST http://localhost:5000/api/advice \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{
    "expenseAmount": 25000,
    "expenseCategory": "luxury",
    "description": "New iPhone"
  }'
```

## 8. Test Error Cases

### Test Without Authentication
```bash
curl -X GET http://localhost:5000/api/income
```

### Test Invalid Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "wronguser",
    "password": "wrongpass"
  }'
```

### Test Duplicate Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "password": "anypass",
    "email": "demo@test.com",
    "name": "Demo Duplicate"
  }'
```

### Test Insufficient Balance for Goal
```bash
# First, create expenses that use up most money
curl -X POST http://localhost:5000/api/expense \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{
    "amount": 40000,
    "description": "Rent and Bills",
    "type": "recurring",
    "category": "housing"
  }'

# Then try to add funds exceeding balance
curl -X PATCH http://localhost:5000/api/goals/goal_1/fund \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{
    "amount": 50000
  }'
```

## Full Test Sequence Script

Save this as `test-api.sh` and run with `bash test-api.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:5000"
USER_ID="user_1"

echo "1. Testing Health Check..."
curl -X GET $API_URL/api/health
echo -e "\n\n"

echo "2. Testing Login..."
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "demo123"}'
echo -e "\n\n"

echo "3. Adding Income..."
curl -X POST $API_URL/api/income \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{"amount": 50000, "source": "Salary", "type": "recurring", "category": "employment"}'
echo -e "\n\n"

echo "4. Adding Expenses..."
curl -X POST $API_URL/api/expense \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{"amount": 5000, "description": "Groceries", "type": "one-time", "category": "food"}'
echo -e "\n\n"

echo "5. Creating Goal..."
curl -X POST $API_URL/api/goals \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{"title": "Emergency Fund", "targetAmount": 100000, "category": "savings", "deadline": "2024-12-31"}'
echo -e "\n\n"

echo "6. Getting Dashboard..."
curl -X GET $API_URL/api/dashboard \
  -H "x-user-id: $USER_ID"
echo -e "\n\n"

echo "7. Getting Financial Advice..."
curl -X POST $API_URL/api/advice \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{"expenseAmount": 2000, "expenseCategory": "entertainment", "description": "Party"}'
echo -e "\n\n"
```

## Notes
- All authenticated endpoints require `x-user-id` header
- Use `user_1` for demo account or the ID returned from register/login
- Goal IDs are in format `goal_1`, `goal_2`, etc.
- All amounts are in rupees (₹)
- Dates should be in ISO format (YYYY-MM-DD)