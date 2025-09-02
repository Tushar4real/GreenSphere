# 🌍 GreenSphere - Gamified Environmental Education Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/AWS-Cognito-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
</div>

## 🌱 Project Overview

GreenSphere is a **production-ready gamified environmental education platform** designed to revolutionize how students learn about environmental science. Built with modern web technologies, it combines interactive learning with gamification to create an engaging educational experience.

### 🎯 Mission
To make environmental education engaging, interactive, and impactful through gamification and real-time learning experiences.

## ✨ Key Features

### 👨‍🎓 **Student Experience**
- 📚 **Interactive Lessons**: 8 comprehensive environmental topics with multimedia content
- 🎮 **Gamified Quizzes**: Points, badges, and level progression system
- 🏆 **Achievement System**: Unlock badges for completing tasks and milestones
- 📊 **Progress Tracking**: Real-time dashboard with learning analytics
- 🌐 **Community Hub**: Share eco-friendly tips and connect with peers
- 📰 **Live Environmental News**: Real-time BBC RSS feed integration
- 🏅 **Leaderboards**: Compete with classmates and track rankings

### 👩‍🏫 **Teacher Dashboard**
- 📋 **Task Management**: Approve student eco-tasks and assignments
- 📈 **Student Analytics**: Monitor individual and class progress
- 🎯 **Custom Assignments**: Create specialized environmental challenges
- 👥 **Class Overview**: Real-time student engagement metrics
- 📊 **Performance Reports**: Detailed learning outcome analysis

### 👨‍💼 **Admin Control Panel**
- 👥 **User Management**: Comprehensive student and teacher administration
- 📊 **Real-time Analytics**: Platform usage and engagement metrics
- 🖥️ **System Monitoring**: Live platform health and performance tracking
- 🏆 **Badge System**: Create and manage achievement rewards
- 🎪 **Competition Management**: Organize platform-wide challenges
- 📈 **Advanced Reporting**: Detailed platform statistics and insights

## 🏗️ Technical Architecture

### **Frontend Stack**
- **React.js 18.2+** - Modern component-based UI
- **CSS3 Animations** - Smooth transitions and micro-interactions
- **React Icons** - Comprehensive icon library
- **Responsive Design** - Mobile-first approach
- **Poppins Font** - Consistent typography throughout

### **Backend Stack**
- **Node.js + Express** - RESTful API architecture
- **MongoDB Atlas** - Cloud-native database with real-time queries
- **AWS Cognito** - Secure authentication and user management
- **RSS Feed Integration** - Real-time environmental news
- **JWT Tokens** - Secure session management

### **Key Integrations**
- **BBC News RSS** - Live environmental news feed
- **Real-time Database** - Dynamic content loading
- **Cloud Storage** - Scalable file management
- **Analytics Engine** - User behavior tracking

## 🚀 Quick Start Guide

### Prerequisites
```bash
# Required software
Node.js (v16 or higher)
MongoDB Atlas account
AWS Cognito setup
Git
```

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/GreenSphere.git
cd GreenSphere

# Install all dependencies
npm run install-all

# Start development servers
npm run dev
```

### Environment Configuration

**Client (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AWS_REGION=your-aws-region
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_CLIENT_ID=your-client-id
```

**Server (.env)**
```env
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-jwt-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
PORT=5000
```

## 📁 Project Structure

```
GreenSphere/
├── 📁 client/                    # React Frontend Application
│   ├── 📁 public/               # Static assets and HTML template
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   ├── Analytics/       # Real-time analytics dashboard
│   │   │   ├── SystemMonitor/   # Platform health monitoring
│   │   │   └── ...             # Other shared components
│   │   ├── 📁 pages/           # Main application pages
│   │   │   ├── StudentDashboard/ # Student learning interface
│   │   │   ├── TeacherDashboard/ # Teacher management panel
│   │   │   ├── AdminDashboard/   # Admin control center
│   │   │   ├── Lessons/         # Interactive lesson viewer
│   │   │   ├── CommunityPage/   # Student community hub
│   │   │   ├── News/            # Environmental news feed
│   │   │   └── ...             # Additional pages
│   │   ├── 📁 services/        # API integration layer
│   │   └── 📁 utils/           # Helper functions and utilities
│   └── package.json            # Frontend dependencies
├── 📁 server/                   # Node.js Backend API
│   ├── 📁 controllers/         # Request handling logic
│   │   ├── authController.js   # Authentication endpoints
│   │   ├── newsController.js   # News feed integration
│   │   ├── communityController.js # Community features
│   │   └── ...                # Other API controllers
│   ├── 📁 models/              # MongoDB data schemas
│   ├── 📁 routes/              # API route definitions
│   ├── 📁 middleware/          # Custom middleware functions
│   ├── seedRealLessons.js      # Educational content seeder
│   └── package.json           # Backend dependencies
├── package.json                # Root package manager
└── README.md                   # This comprehensive guide
```

## 🎨 Design System

### **Color Palette**
- 🟢 **Primary Green**: `#28A745` - Main brand color
- 🔵 **Accent Teal**: `#20C997` - Secondary actions
- 🟡 **Warning Yellow**: `#FFC107` - Alerts and highlights
- ⚫ **Dark Mode**: `#1a1a1a` - Night theme support

### **Typography**
- **Primary Font**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive Scaling**: Fluid typography system

### **UI Components**
- **Animations**: Smooth hover effects, badge celebrations, confetti rewards
- **Responsive Design**: Mobile-first with breakpoints at 768px, 1024px, 1440px
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Theme Support**: Light/Dark mode with system preference detection

## 📊 Platform Statistics

- **8 Interactive Lessons** across 4 environmental topics
- **Real-time News Integration** from BBC Environmental RSS
- **Multi-role Authentication** (Student, Teacher, Admin)
- **Gamification System** with points, badges, and leaderboards
- **Community Features** with persistent post storage
- **Advanced Analytics** with real-time user tracking
- **System Monitoring** with live health metrics

## 🔧 Development Features

### **Code Quality**
- Modern ES6+ JavaScript syntax
- Component-based React architecture
- RESTful API design patterns
- Error handling and validation
- Security best practices

### **Performance Optimizations**
- Lazy loading for components
- Database query optimization
- Caching strategies for news feeds
- Responsive image loading
- Minified production builds

## 🚀 Deployment

### **Production Setup**
```bash
# Build for production
npm run build

# Deploy to AWS EC2
# Detailed instructions in /server/deployment.md
```

### **Environment Requirements**
- **AWS EC2 Instance** (t3.medium recommended)
- **MongoDB Atlas Cluster** (M10+ for production)
- **AWS Cognito User Pool** configured
- **Domain with SSL Certificate**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **BBC News RSS** for environmental news integration
- **MongoDB Atlas** for reliable cloud database services
- **AWS Cognito** for secure authentication
- **React Community** for excellent documentation and support

---

<div align="center">
  <p><strong>🌍 Making Environmental Education Engaging, One Student at a Time</strong></p>
  <p>Built with ❤️ for a sustainable future</p>
</div>