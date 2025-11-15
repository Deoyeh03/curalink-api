# CuraLink Backend 🏥

> AI-powered platform connecting patients and researchers to clinical trials, publications, and experts.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## ✨ Features

- **AI-Powered Onboarding**: Natural language profile parsing using OpenAI/Claude
- **Smart Recommendations**: Personalized clinical trial, publication, and expert suggestions
- **Advanced Search**: Full-text search with geospatial filtering
- **Role-Based Access**: Separate patient and researcher experiences
- **Favorites System**: Save and organize items of interest
- **Meeting Requests**: Connect patients with researchers
- **Forum System**: Patient Q&A with researcher responses
- **AI Summarization**: Quick summaries of publications and trials

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Atlas/Compass)
- **ODM**: Mongoose
- **Authentication**: JWT with refresh tokens
- **AI Services**: OpenAI GPT-3.5 (or mock service)
- **Security**: Helmet, bcryptjs, rate limiting
- **Validation**: express-validator

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **MongoDB** installed locally OR **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **OpenAI API Key** (recommended) OR use mock AI service
- **Git** installed

## 🚀 Installation

### 1. Clone or Create Project

```bash
# Create project directory
mkdir curalink-backend
cd curalink-backend

# Initialize npm
npm init -y
```

### 2. Install Dependencies

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cors helmet express-rate-limit express-validator axios openai nodemailer compromise

# Development dependencies
npm install --save-dev nodemon jest supertest
```

### 3. Create Project Structure

```bash
mkdir -p src/{models,routes,controllers,services,middleware,config,scripts}
```

### 4. Copy All Code Files

Copy the following files from the artifacts above:

**Configuration:**
- `.env` (from Environment Setup artifact)
- `src/server.js`
- `src/app.js`
- `src/config/database.js`

**Models:**
- `src/models/User.js`
- `src/models/ClinicalTrial.js`
- `src/models/Publication.js`
- `src/models/ForumPost.js`
- `src/models/MeetingRequest.js`

**Services:**
- `src/services/aiService.js`
- `src/services/searchService.js`
- `src/services/recommendationService.js`

**Middleware:**
- `src/middleware/auth.js`

**Routes:**
- `src/routes/authRoutes.js`
- `src/routes/onboardRoutes.js`
- `src/routes/trialRoutes.js`
- `src/routes/publicationRoutes.js`
- `src/routes/recommendationRoutes.js`
- `src/routes/searchRoutes.js`
- `src/routes/favoriteRoutes.js`
- `src/routes/meetingRoutes.js`
- `src/routes/aiRoutes.js`
- `src/routes/forumRoutes.js`

**Scripts:**
- `src/scripts/seedData.js`

## ⚙️ Configuration

### 1. Set Up Environment Variables

Create `.env` file in the root directory:

```env
# Required
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/curalink
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key

# AI Service (Choose one)
OPENAI_API_KEY=sk-your-openai-key-here
# OR set USE_MOCK_AI=true for testing without API

# Optional
CORS_ORIGIN=http://localhost:3000
```

### 2. MongoDB Setup

**Option A: Local MongoDB (Compass)**

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Create database named `curalink`

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a FREE cluster (M0)
3. Set up database user and password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string and update `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/curalink?retryWrites=true&w=majority
```

### 3. Generate Strong JWT Secrets

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy output to `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env`

### 4. AI Service Setup

**Option 1: OpenAI (Recommended)**

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Go to API Keys section
3. Create new secret key
4. Add to `.env`: `OPENAI_API_KEY=sk-...`

**Option 2: Mock AI (Free, for testing)**

Add to `.env`:
```env
USE_MOCK_AI=true
```

This uses simple keyword extraction without API costs.

## 🏃 Running the Application

### Development Mode

```bash
# Start with auto-reload
npm run dev
```

### Production Mode

```bash
npm start
```

### Seed Sample Data

```bash
npm run seed
```

This creates:
- 2 researcher accounts
- 2 clinical trials
- 2 publications

**Test Accounts:**
- Email: `sarah.johnson@research.edu` / Password: `demo123`
- Email: `mchen@oncology.org` / Password: `demo123`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

### Core Endpoints

#### Authentication

**POST** `/auth/signup`
```json
{
  "role": "patient",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**POST** `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**GET** `/auth/me` (Protected)
- Returns current user profile

#### Onboarding

**POST** `/onboard/nl` (Protected)
```json
{
  "nl_text": "I have Brain Cancer (glioblastoma) in Toronto. Looking for immunotherapy trials."
}
```

Returns parsed conditions, keywords, and location.

**PUT** `/onboard/profile` (Protected)
```json
{
  "bio": "15 years experience in neuro-oncology",
  "specialties": ["brain cancer", "immunotherapy"],
  "location": {
    "city": "Boston",
    "country": "USA"
  }
}
```

#### Recommendations

**GET** `/recommendations/patient?limit=20` (Protected, Patient only)

Returns:
```json
{
  "success": true,
  "data": {
    "trials": [...],
    "publications": [...],
    "experts": [...]
  }
}
```

**GET** `/recommendations/researcher?limit=20` (Protected, Researcher only)

#### Search

**GET** `/search?q=immunotherapy&type=trial&location=-71.0589,42.3601&phase=Phase%203`

Query Parameters:
- `q`: Search query (required)
- `type`: `trial`, `publication`, `expert`, or `all` (default: `all`)
- `location`: Longitude,Latitude for geo-proximity
- `phase`: Clinical trial phase
- `status`: Trial status (recruiting, active, etc.)
- `limit`: Results per page (default: 20)
- `skip`: Pagination offset

#### Clinical Trials

**GET** `/trials`
- List all trials

**GET** `/trials/:id`
- Get trial details

**POST** `/trials` (Protected, Researcher only)
```json
{
  "title": "Study of Immunotherapy",
  "description": "...",
  "conditions": ["brain cancer"],
  "phase": "Phase 3",
  "status": "recruiting",
  "locations": [{
    "facility": "Hospital Name",
    "city": "Boston",
    "country": "USA"
  }]
}
```

#### Publications

**GET** `/publications?limit=20&keywords=immunotherapy`

**GET** `/publications/:id`

#### Favorites

**POST** `/favorites` (Protected)
```json
{
  "itemType": "trial",
  "itemId": "507f1f77bcf86cd799439011"
}
```

**GET** `/favorites` (Protected)

**DELETE** `/favorites` (Protected)

#### Meeting Requests

**POST** `/meetings/request` (Protected)
```json
{
  "toUserId": "507f1f77bcf86cd799439011",
  "message": "I'd like to discuss treatment options",
  "contact": {
    "email": "patient@example.com",
    "phone": "+1234567890"
  }
}
```

**GET** `/meetings/requests?type=received` (Protected)

#### AI Services

**POST** `/ai/summarize`
```json
{
  "text": "Long publication abstract or trial description...",
  "maxLength": 150
}
```

**POST** `/ai/parse`
```json
{
  "text": "I have diabetes and high blood pressure in New York"
}
```

#### Forums

**GET** `/forums/posts?category=treatment`

**POST** `/forums/posts` (Protected, Patient only)
```json
{
  "title": "Questions about immunotherapy side effects",
  "body": "I'm considering participating in a trial...",
  "category": "treatment"
}
```

**POST** `/forums/posts/:id/replies` (Protected, Researcher only)
```json
{
  "body": "Common side effects include..."
}
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Manual API Testing

Use the provided Postman collection or curl:

```bash
# Health check
curl http://localhost:5000/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "role": "patient",
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'

# Get recommendations (replace TOKEN)
curl http://localhost:5000/api/recommendations/patient \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🚀 Deployment

### Environment Setup

1. **Heroku**
```bash
heroku create curalink-backend
heroku config:set MONGODB_URI=your-atlas-uri
heroku config:set JWT_SECRET=your-secret
heroku config:set OPENAI_API_KEY=your-key
git push heroku main
```

2. **Railway**
- Connect GitHub repo
- Add environment variables in dashboard
- Deploy automatically

3. **Render**
- Connect repo
- Set environment variables
- Deploy

### Production Checklist

- [ ] Use MongoDB Atlas (not local)
- [ ] Generate strong JWT secrets
- [ ] Enable HTTPS only
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for your frontend domain
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Enable rate limiting
- [ ] Review security headers (Helmet)

## 📁 Project Structure

```
curalink-backend/
├── src/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── middleware/
│   │   └── auth.js                # JWT authentication
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── ClinicalTrial.js       # Trial schema
│   │   ├── Publication.js         # Publication schema
│   │   ├── ForumPost.js           # Forum schema
│   │   └── MeetingRequest.js      # Meeting schema
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── onboardRoutes.js       # Onboarding
│   │   ├── trialRoutes.js         # Trials CRUD
│   │   ├── publicationRoutes.js   # Publications
│   │   ├── recommendationRoutes.js # AI recommendations
│   │   ├── searchRoutes.js        # Search
│   │   ├── favoriteRoutes.js      # Favorites
│   │   ├── meetingRoutes.js       # Meetings
│   │   ├── aiRoutes.js            # AI services
│   │   └── forumRoutes.js         # Forums
│   ├── services/
│   │   ├── aiService.js           # OpenAI integration
│   │   ├── searchService.js       # Search logic
│   │   └── recommendationService.js # Recommendation engine
│   ├── scripts/
│   │   └── seedData.js            # Database seeder
│   ├── app.js                     # Express app setup
│   └── server.js                  # Server entry point
├── .env                           # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoNetworkError: connect ECONNREFUSED`

**Solution**:
- Ensure MongoDB is running: `brew services start mongodb-community` (Mac)
- Or use MongoDB Atlas cloud database

### OpenAI API Errors

**Error**: `401 Unauthorized`

**Solution**:
- Verify API key is correct in `.env`
- Check you have credits: https://platform.openai.com/usage
- Set `USE_MOCK_AI=true` to bypass

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

## 📝 API Rate Limits

- General endpoints: 100 requests / 15 minutes per IP
- AI endpoints: 50 requests / 15 minutes per IP

## 🔐 Security Best Practices

1. **Never commit `.env` files**
2. Use strong, unique JWT secrets
3. Enable HTTPS in production
4. Whitelist CORS origins
5. Validate all user inputs
6. Use parameterized queries (Mongoose does this)
7. Rate limit sensitive endpoints
8. Hash passwords with bcrypt
9. Use secure session management

## 📞 Support

For issues or questions:
- Check existing GitHub issues
- Create new issue with detailed description
- Include error logs and environment details

## 📄 License

MIT License - feel free to use for your projects!

---

**Built with ❤️ for CuraLink Hackathon**

Ready to move to frontend? Let me know when you want to start building the React/Next.js application!