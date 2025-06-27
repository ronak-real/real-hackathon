# SpendWise - The Fun Financial Advisor

A cartoon-themed personal finance web application featuring Jethalal as your financial advisor!

## Features

- 💰 **Income Management** - Track one-time and recurring income
- 💸 **Expense Tracking** - Categorize and monitor your spending
- 🎯 **Financial Goals** - Set and track savings goals
- 🤔 **Financial Advisor** - Get humorous financial advice with animations (Jethalal-style)
- 📊 **Dashboard** - Visual summary of your financial health

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: In-memory storage
- **Testing**: Jest, Supertest

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
```bash
cd /path/to/real-hackathon
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server (from the backend directory):
```bash
npm run dev
```
The backend will run on http://localhost:5000

2. In a new terminal, start the frontend (from the frontend directory):
```bash
npm run dev
```
The frontend will run on http://localhost:5173

3. Open your browser and visit http://localhost:5173

### Running Tests

To run backend tests:
```bash
cd backend
npm test
```

## Usage

1. **Dashboard** - View your financial summary
2. **Add Income** - Record your earnings
3. **Add Expense** - Track your spending
4. **Goals** - Set financial targets
5. **Financial Advisor** - Get advice before making purchases

## API Endpoints

- `GET /api/health` - Health check
- `GET/POST /api/income` - Income management
- `GET/POST /api/expenses` - Expense tracking
- `GET/POST /api/goals` - Goal management
- `GET /api/dashboard` - Dashboard summary
- `POST /api/advice` - Get financial advice

## Development

The project structure:
```
real-hackathon/
├── backend/
│   ├── server.js         # Express server
│   ├── server.test.js    # API tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   └── App.jsx       # Main app
│   └── package.json
└── *.md                  # Documentation files
```

## License

MIT