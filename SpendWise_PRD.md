# Product Requirements Document (PRD)
# SpendWise - The Fun Financial Advisor

## 1. Executive Summary

SpendWise is a lighthearted, cartoon-themed personal finance web application that helps users manage their income, expenses, and financial goals through an entertaining interface featuring a Jethalal-inspired cartoon advisor. The app combines practical financial tracking with humor and engaging animations to make money management fun and accessible.

## 2. Product Overview

### Vision
To transform personal finance management from a chore into an enjoyable experience by combining practical financial tools with humor and entertainment.

### Mission
Help users make better financial decisions through an engaging, cartoon-themed interface that provides personalized, context-aware advice in a fun and memorable way.

### Key Differentiators
- Jethalal-inspired cartoon advisor with humorous responses
- Sentiment analysis for contextual financial advice
- Playful, animated UI with Lottie/SVG animations
- Lightweight, fast performance with in-memory database
- Chat-style interaction for financial guidance

## 3. Target Audience

### Primary Users
- **Age**: 18-35 years
- **Demographics**: Young professionals, college students, early-career individuals
- **Tech Savvy**: Comfortable with web applications
- **Financial Status**: Beginning their financial journey, looking for guidance
- **Personality**: Appreciate humor, fans of Indian pop culture (especially TMKOC)

### User Personas

**Persona 1: Recent Graduate Raj**
- 23 years old, first job
- Struggles with budgeting and impulse purchases
- Wants financial guidance but finds traditional apps boring
- TMKOC fan who would appreciate the Jethalal references

**Persona 2: Young Professional Priya**
- 28 years old, mid-level professional
- Has financial goals but lacks discipline
- Seeks a fun way to track expenses
- Values quick, accessible tools

## 4. Core Features

### 4.1 Income Management
- **Add Income Sources**: One-time and recurring income entries
- **Income Categories**: Salary, freelance, investments, etc.
- **Visual Income Display**: Animated counter showing total income

### 4.2 Expense Tracking
- **Quick Expense Entry**: Simple form with amount, category, description
- **Expense Types**: One-time and recurring expenses
- **Categories**: Food, entertainment, utilities, transport, etc.
- **Expense History**: Scrollable list with filtering options

### 4.3 Financial Goals
- **Goal Creation**: Set financial targets with deadlines
- **Progress Tracking**: Visual progress bars with animations
- **Goal Categories**: Savings, purchases, debt reduction
- **Milestone Celebrations**: Animated rewards when reaching milestones

### 4.4 Financial Advisor System
- **Context-Aware Analysis**: Evaluates financial health based on:
  - Current income vs expenses ratio
  - Progress toward goals
  - Spending patterns
  - Size of proposed expense
- **Response Types with Mascot Emotions**:
  - **Encouraging** (Happy, thumbs up Jethalal):
    - "Ae bhai! Tumhara budget ekdum sahi hai! Ye expense kar sakte ho! Party karo!"
    - "Wah wah wah! Paisa bacha ke rakha hai tune! Le le ye wala item, tension mat le!"
    - "Arre champion! Tu to ekdum Ambani ban gaya! Ye choti si cheez to le hi sakta hai!"
  - **Cautious** (Worried, hand on chin Jethalal):
    - "Thoda ruko... mahine ka aadha gaya hai, thoda bachke! Babuchak mat bano!"
    - "Hmm... kar to sakte ho, par phir month end mein Maggi khani padegi!"
    - "Arre Tapu ke papa! Budget tight hai... soch samajh ke karo!"
  - **Discouraging** (Shocked, hands on head Jethalal):
    - "Nahiiii! Ye paisa mat udao! Gada electronics ka loan yaad hai? Daya bhabhi se daant padegi!"
    - "Hey maa mataji! Itna kharcha? Bankrupt ho jaoge! Bilkul nahi!"
    - "Nonsense! Ye kya bakwas kar rahe ho? Savings ka kya hoga? Goal ka kya hoga?"
- **Mascot Display Features**:
  - Full-body Jethalal cartoon mascot appears with each message
  - Dynamic facial expressions matching the sentiment
  - Hand gestures and body language animations
  - Speech bubble emerging from mascot with the message
  - Background effects (confetti for encouraging, warning signs for discouraging)
- **Visual Presentation**:
  - Mascot slides in from side of screen
  - Message appears in comic-style speech bubble
  - Emotion-specific animations (jumping for joy, scratching head, face-palm)
  - Sound effects optional (Jethalal's signature expressions)

### 4.5 Dashboard
- **Financial Summary**: Income, expenses, savings at a glance
- **Spending Trends**: Simple charts with cartoon annotations
- **Goal Overview**: Progress cards for all active goals
- **Quick Actions**: Floating action buttons for common tasks

## 5. Technical Requirements

### 5.1 Frontend Stack
- **Framework**: React.js or Vue.js
- **Styling**: Tailwind CSS for responsive design
- **Animations**: 
  - Lottie for complex character animations
  - Framer Motion for UI transitions
  - CSS animations for micro-interactions
- **State Management**: Context API or Zustand (lightweight)
- **Build Tool**: Vite for fast development

### 5.2 Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: In-memory storage (JavaScript objects/arrays)
- **APIs**: RESTful endpoints for CRUD operations
- **Analysis Engine**: Custom JavaScript logic for sentiment analysis
- **Optional AI Integration**: Claude AI API for enhanced responses

### 5.3 Key APIs
- `POST /api/income` - Add income entry
- `POST /api/expense` - Add expense entry
- `GET /api/summary` - Get financial summary
- `POST /api/goals` - Create financial goal
- `POST /api/advice` - Get financial advice for an expense
- `GET /api/dashboard` - Get dashboard data

### 5.4 Data Models

```javascript
// Income Model
{
  id: string,
  amount: number,
  source: string,
  type: 'one-time' | 'recurring',
  date: Date,
  category: string
}

// Expense Model
{
  id: string,
  amount: number,
  description: string,
  type: 'one-time' | 'recurring',
  date: Date,
  category: string
}

// Goal Model
{
  id: string,
  title: string,
  targetAmount: number,
  currentAmount: number,
  deadline: Date,
  category: string
}

// Advice Request Model
{
  expenseAmount: number,
  expenseCategory: string,
  currentBalance: number,
  monthlyIncome: number,
  monthlyExpenses: number,
  goals: Goal[]
}
```

## 6. UI/UX Requirements

### 6.1 Design Principles
- **Playful & Approachable**: Cartoon theme throughout
- **Simple & Clean**: Minimal clutter, clear CTAs
- **Mobile-First**: Responsive design for all devices
- **Fast & Smooth**: Instant feedback with animations

### 6.2 Key Screens
1. **Landing/Dashboard**: Overview with Jethalal greeting
2. **Income Management**: Form with animated success states
3. **Expense Tracker**: List view with category icons
4. **Goals Screen**: Card-based layout with progress animations
5. **Advice Chat**: WhatsApp-style interface with Jethalal avatar

### 6.3 Visual Elements
- **Color Palette**: Bright, cheerful colors (yellow, green, blue)
- **Typography**: Playful, rounded fonts
- **Icons**: Custom cartoon-style icons for categories
- **Animations**: Smooth transitions, bouncy effects

## 7. User Stories

### Epic 1: Income Management
- As a user, I want to add my salary so that the app knows my financial capacity
- As a user, I want to set recurring income so I don't have to add it monthly

### Epic 2: Expense Tracking
- As a user, I want to quickly log expenses so I can track my spending
- As a user, I want to categorize expenses so I can see spending patterns

### Epic 3: Financial Goals
- As a user, I want to set savings goals so I can work towards them
- As a user, I want to see my progress so I stay motivated

### Epic 4: Financial Advice
- As a user, I want to ask if I should make a purchase so I can decide wisely
- As a user, I want humorous feedback so the experience is enjoyable

## 8. Success Metrics

### Engagement Metrics
- **Daily Active Users**: Track regular usage
- **Advice Requests**: Number of times users seek Jethalal's advice
- **Feature Adoption**: Usage of different features

### Financial Impact
- **Savings Rate**: Users' savings as percentage of income
- **Goal Completion**: Percentage of goals achieved
- **Expense Reduction**: Month-over-month expense trends

### User Satisfaction
- **Session Duration**: Time spent in app
- **Return Rate**: Users coming back daily/weekly
- **Advice Follow-through**: Users following Jethalal's recommendations

## 9. MVP Scope

### Must Have
1. Basic income/expense entry
2. Simple dashboard with totals
3. Jethalal advisor with 3-5 pre-programmed responses
4. One animated Jethalal expression
5. Basic goal creation and tracking
6. In-memory data storage

### Nice to Have
1. Multiple Jethalal expressions
2. Expense categories with icons
3. Progress animations
4. Claude AI integration
5. Data persistence (localStorage)

### Out of Scope
1. User authentication
2. Real database integration
3. Complex financial analytics
4. Mobile app version
5. Multi-language support

## 10. Development Timeline

### Phase 1: Setup & Core
- Project setup with Vite + React
- Basic routing and layout
- In-memory data structure

### Phase 2: Features
- Income/expense forms
- Dashboard components
- Goal management
- Basic sentiment analysis logic

### Phase 3: Jethalal Integration
- Advisor UI component
- Response logic
- Basic animations

### Phase 4: Polish & Testing
- UI refinements
- Bug fixes
- Testing and optimization

## 11. Future Enhancements

### Version 2.0
- User authentication and data persistence
- Advanced analytics and insights
- More cartoon characters for different advice
- Social features (share goals/achievements)
- Gamification elements

### Version 3.0
- Mobile applications
- Bank integration
- Investment advice
- Community challenges
- Premium features with advanced AI

## 12. Risks & Mitigation

### Technical Risks
- **Risk**: Complex animations affecting performance
- **Mitigation**: Use CSS animations where possible, lazy load Lottie

### Time Constraints
- **Risk**: Feature scope creep
- **Mitigation**: Clear MVP definition, modular development

### User Adoption
- **Risk**: Users not finding it useful beyond novelty
- **Mitigation**: Focus on genuine financial value with humor as enhancement