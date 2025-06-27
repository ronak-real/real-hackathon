#!/bin/bash

# Configuration
API_URL="${1:-http://localhost:5000}"
USER_ID="user_1"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Testing SpendWise API at: $API_URL${NC}"
echo "========================================"

echo -e "\n${GREEN}1. Testing Health Check...${NC}"
curl -X GET $API_URL/api/health
echo -e "\n"

echo -e "\n${GREEN}2. Testing Login with Demo Account...${NC}"
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "demo123"}'
echo -e "\n"

echo -e "\n${GREEN}3. Adding Income (Salary)...${NC}"
curl -X POST $API_URL/api/income \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{"amount": 50000, "source": "Monthly Salary", "type": "recurring", "category": "employment"}'
echo -e "\n"

echo -e "\n${GREEN}4. Adding Income (Freelance)...${NC}"
curl -X POST $API_URL/api/income \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{"amount": 15000, "source": "Freelance Project", "type": "one-time", "category": "freelance"}'
echo -e "\n"

echo -e "\n${GREEN}5. Adding Expense (Food)...${NC}"
curl -X POST $API_URL/api/expense \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{"amount": 5000, "description": "Grocery Shopping", "type": "one-time", "category": "food"}'
echo -e "\n"

echo -e "\n${GREEN}6. Adding Expense (Transport)...${NC}"
curl -X POST $API_URL/api/expense \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{"amount": 2000, "description": "Uber rides", "type": "recurring", "category": "transport"}'
echo -e "\n"

echo -e "\n${GREEN}7. Adding Expense (Entertainment)...${NC}"
curl -X POST $API_URL/api/expense \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{"amount": 3000, "description": "Movie and dinner", "type": "one-time", "category": "entertainment"}'
echo -e "\n"

echo -e "\n${GREEN}8. Creating Goal (Emergency Fund)...${NC}"
curl -X POST $API_URL/api/goals \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{"title": "Emergency Fund", "targetAmount": 100000, "category": "savings", "deadline": "2024-12-31"}'
echo -e "\n"

echo -e "\n${GREEN}9. Creating Goal (Vacation)...${NC}"
curl -X POST $API_URL/api/goals \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{"title": "Goa Vacation", "targetAmount": 50000, "category": "travel", "deadline": "2024-06-30"}'
echo -e "\n"

echo -e "\n${GREEN}10. Adding Funds to Goal...${NC}"
curl -X PATCH $API_URL/api/goals/goal_1/fund \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{"amount": 10000}'
echo -e "\n"

echo -e "\n${GREEN}11. Getting Dashboard Summary...${NC}"
curl -X GET $API_URL/api/dashboard \
  -H "x-user-id: user_1" | python -m json.tool 2>/dev/null || curl -X GET $API_URL/api/dashboard -H "x-user-id: user_1"
echo -e "\n"

echo -e "\n${GREEN}12. Getting Financial Advice (Affordable)...${NC}"
curl -X POST $API_URL/api/advice \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{"expenseAmount": 1000, "expenseCategory": "shopping", "description": "New shoes"}'
echo -e "\n"

echo -e "\n${GREEN}13. Getting Financial Advice (Expensive)...${NC}"
curl -X POST $API_URL/api/advice \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_1" \
  -d '{"expenseAmount": 30000, "expenseCategory": "luxury", "description": "New iPhone"}'
echo -e "\n"

echo -e "\n${BLUE}Testing Complete!${NC}"