# GreenSphere - Gamified Environmental Education Platform

## 🌱 Project Overview
GreenSphere is a production-ready gamified environmental education platform designed for school and college students. It features interactive lessons, gamified quizzes, eco-tasks, points, badges, levels, and leaderboards.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- AWS Cognito setup

### Installation
```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev
```

### Environment Setup
1. Create `.env` files in both `client` and `server` directories
2. Configure AWS Cognito credentials
3. Set up MongoDB Atlas connection

## 🏗️ Tech Stack
- **Frontend:** React.js + CSS Animations + React Icons
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Authentication:** AWS Cognito
- **Deployment:** AWS EC2

## 📁 Project Structure
```
GreenSphere/
├── client/          # React frontend
├── server/          # Node.js backend
├── package.json     # Root package manager
└── README.md
```

## 🎮 Features
- **Students:** Interactive lessons, gamified quizzes, eco-tasks, progress tracking
- **Teachers:** Task approval, special assignments, analytics
- **Admins:** User management, badge system, competitions

## 🎨 Design System
- **Colors:** Green (#28A745), Teal (#20C997), Yellow (#FFC107)
- **Themes:** Light/Dark mode with smooth transitions
- **Animations:** Hover effects, badge pops, confetti, point flying

## 🚀 Deployment
Detailed deployment instructions available in `/server/deployment.md`