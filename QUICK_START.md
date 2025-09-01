# GreenSphere Quick Start Guide

## 🚀 Development Setup (5 minutes)

### 1. Install Dependencies
```bash
# Root dependencies
npm install

# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

### 2. Environment Setup

**Option A: Demo Mode (No AWS required)**
```bash
# Server .env (already configured)
PORT=8000
MONGODB_URI=mongodb://localhost:27017/greensphere
JWT_SECRET=your-super-secret-jwt-key-for-development
AWS_ACCESS_KEY_ID=demo-access-key

# Client .env (already configured)
REACT_APP_API_URL=http://localhost:8000/api
```

**Option B: Real AWS Cognito**
- Follow [COGNITO_SETUP.md](./COGNITO_SETUP.md) for full AWS setup
- Replace demo values with real AWS credentials

### 3. Start Development Servers

```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api

## 🧪 Test the Application

### Demo Accounts (Demo Mode)
- **Email**: Any valid email format
- **Password**: Any password (6+ characters)
- **Profile**: Fill any details

### Features to Test
1. **Registration**: Create account with email/password
2. **Login**: Sign in with credentials
3. **Dashboard**: View student dashboard
4. **Navigation**: Test different pages

## 📁 Project Structure
```
/greensphere
├── /client          # React frontend
│   ├── /components   # Reusable UI components
│   ├── /pages        # Dashboard, Login, Signup
│   ├── /contexts     # Auth & Theme context
│   └── /utils        # API helpers
├── /server           # Node.js backend
│   ├── /controllers  # Business logic
│   ├── /models       # MongoDB schemas
│   ├── /routes       # API endpoints
│   ├── /middlewares  # Auth middleware
│   └── /utils        # Helper functions
└── README.md
```

## 🔧 Available Scripts

### Root Level
```bash
npm run dev          # Start both client and server
npm run install-all  # Install all dependencies
```

### Server
```bash
npm start           # Production server
npm run dev         # Development with nodemon
node seedData.js    # Seed demo data
```

### Client
```bash
npm start           # Development server
npm run build       # Production build
```

## 🎮 Demo Features

- **Gamified Dashboard**: Points, levels, badges
- **Interactive Lessons**: Environmental education content
- **Task System**: Eco-friendly challenges
- **Leaderboards**: School and global rankings
- **Dark/Light Theme**: Toggle theme support
- **Responsive Design**: Mobile-friendly interface

## 🔍 Troubleshooting

### Port Issues
```bash
# Kill processes on ports
lsof -ti:3000,8000 | xargs kill -9
```

### MongoDB Connection
- Install MongoDB locally or use MongoDB Atlas
- Update MONGODB_URI in server/.env

### AWS Cognito Issues
- Check [COGNITO_SETUP.md](./COGNITO_SETUP.md)
- Use demo mode for development

## 📚 Next Steps

1. **Customize**: Modify colors, content, and features
2. **Deploy**: Follow deployment guides for production
3. **Extend**: Add new gamification features
4. **Scale**: Implement caching and optimization

## 🆘 Need Help?

- Check console logs for errors
- Verify environment variables
- Ensure all dependencies are installed
- Use demo mode if AWS setup is complex