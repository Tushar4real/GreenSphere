<div align="center">
  <h1>🌍 GreenSphere</h1>
  <h3>Gamified Environmental Education Platform</h3>
  
  <p>
    <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/AWS-Cognito-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/Version-2.0.0-orange?style=for-the-badge" alt="Version" />
  </p>
  
  <p><em>🌱 Making Environmental Education Engaging Through Gamification</em></p>
</div>

## 🌱 Project Overview

GreenSphere is a **production-ready gamified environmental education platform** that revolutionizes how students learn about environmental science. Built with modern web technologies, it combines interactive learning with gamification to create an engaging educational experience.

### 🎯 Mission
To make environmental education engaging, interactive, and impactful through gamification and real-time learning experiences.

### ⭐ Key Highlights
- 🎮 **Gamified Learning** - Points, badges, and leaderboards
- 🧠 **Interactive Quizzes** - 5 environmental quizzes with instant feedback
- 🌍 **Real-World Tasks** - Hands-on environmental activities
- 📊 **Progress Tracking** - Comprehensive analytics dashboard
- 🌙 **Modern UI/UX** - Dark/Light mode with responsive design
- 👥 **Multi-Role System** - Student, Teacher, and Admin interfaces

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
REACT_APP_API_URL=http://localhost:5001/api
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
PORT=5001
```

## 📁 Project Structure

<details>
<summary><strong>🔍 Click to expand detailed folder structure</strong></summary>

```
GreenSphere/
├── 📱 client/                     # React Frontend Application
│   ├── 🌐 public/
│   │   ├── index.html            # Main HTML template
│   │   └── favicon.ico           # App icon
│   ├── ⚛️ src/
│   │   ├── 🧩 components/        # Reusable UI Components
│   │   │   ├── 📊 Analytics/     # Real-time dashboard widgets
│   │   │   ├── 🎯 QuizCard/      # Interactive quiz interface
│   │   │   ├── 📋 SidePanel/     # Navigation sidebar
│   │   │   ├── 🎮 GamificationDashboard/ # Points & badges display
│   │   │   ├── 🔔 TeacherRequestBar/ # Teacher approval notifications
│   │   │   ├── 🏆 Badge/         # Achievement badge component
│   │   │   ├── 🎨 PointsAnimation/ # Reward animations
│   │   │   ├── 🔧 SystemMonitor/ # Platform health monitoring
│   │   │   ├── 📱 Navbar/        # Main navigation header
│   │   │   ├── 🦶 Footer/        # Site footer
│   │   │   └── ⬆️ ScrollToTop/   # Scroll utility component
│   │   ├── 📄 pages/             # Main Application Pages
│   │   │   ├── 🎓 StudentDashboard/ # Student learning hub
│   │   │   ├── 👩‍🏫 TeacherDashboard/ # Teacher management panel
│   │   │   ├── 👨‍💼 AdminDashboard/   # Admin control center
│   │   │   ├── 📚 Lessons/       # Interactive lesson viewer
│   │   │   ├── 🎯 RealWorldTasks/ # Environmental task management
│   │   │   ├── 🧠 QuizPage/      # Quiz taking interface
│   │   │   ├── 🌐 CommunityPage/ # Student community hub
│   │   │   ├── 📰 News/          # Environmental news feed
│   │   │   ├── 🏆 Leaderboard/   # Rankings and competitions
│   │   │   ├── 🏅 Badges/        # Achievement showcase
│   │   │   ├── 📊 Progress/      # Learning analytics
│   │   │   ├── 🔔 NotificationsPage/ # User notifications
│   │   │   ├── 🏠 HomePage/      # Landing page
│   │   │   ├── 🔐 Login/         # Authentication
│   │   │   └── 📝 Register/      # User registration
│   │   ├── 🔌 services/          # API Integration Layer
│   │   │   ├── apiService.js     # Main API client
│   │   │   ├── api.js            # HTTP request utilities
│   │   │   └── cognitoAuth.js    # AWS Cognito integration
│   │   ├── 🎨 contexts/          # React Context Providers
│   │   │   ├── AuthContext.js    # User authentication state
│   │   │   └── ThemeContext.js   # Dark/Light mode management
│   │   ├── 📊 data/              # Static Data Files
│   │   │   ├── quizData.js       # Environmental quiz questions
│   │   │   └── newsData.js       # Sample news data
│   │   ├── 🎨 styles/            # Global Styling
│   │   │   ├── design-system.css # Design tokens & variables
│   │   │   └── theme-utils.css   # Theme switching utilities
│   │   ├── 🛠️ utils/             # Helper Functions
│   │   │   ├── helpers.js        # General utility functions
│   │   │   └── pointsAnimation.js # Gamification animations
│   │   ├── 📱 App.js             # Main React application
│   │   ├── 🎨 App.css            # Global app styles
│   │   └── 🚀 index.js           # React DOM entry point
│   ├── 📦 package.json           # Frontend dependencies
│   ├── ⚙️ craco.config.js        # Build configuration
│   ├── 🔐 .env                   # Environment variables
│   └── 📋 .env.example           # Environment template
├── 🖥️ server/                    # Node.js Backend API
│   ├── 🎮 controllers/           # Business Logic Controllers
│   │   ├── 🔐 authController.js  # User authentication
│   │   ├── 📚 lessonController.js # Educational content
│   │   ├── 🧠 quizController.js  # Quiz management
│   │   ├── 🎯 realWorldTaskController.js # Task submissions
│   │   ├── 🎮 gamificationController.js # Points & badges
│   │   ├── 🌐 communityController.js # Social features
│   │   ├── 📰 newsController.js  # News feed integration
│   │   ├── 🏆 leaderboardController.js # Rankings
│   │   ├── 🏅 badgeController.js # Achievement system
│   │   ├── 📊 analyticsController.js # Platform analytics
│   │   ├── 🔔 notificationController.js # User notifications
│   │   ├── 👩‍🏫 teacherController.js # Teacher features
│   │   ├── 👥 userController.js  # User management
│   │   ├── 📋 contentController.js # Content management
│   │   └── 👨‍💼 bulkUserController.js # Bulk operations
│   ├── 🗃️ models/                # MongoDB Data Schemas
│   │   ├── 👤 User.js            # User profile & authentication
│   │   ├── 📚 Lesson.js          # Educational lesson content
│   │   ├── 🧠 Quiz.js            # Quiz questions & answers
│   │   ├── 🎯 RealWorldTask.js   # Environmental tasks
│   │   ├── 📝 TaskSubmission.js  # Student task submissions
│   │   ├── 🏆 Badge.js           # Achievement badges
│   │   ├── 🏅 EarnedBadge.js     # User badge relationships
│   │   ├── 📊 UserProgress.js    # Learning progress tracking
│   │   ├── 📝 Post.js            # Community posts
│   │   ├── 🔔 Notification.js    # User notifications
│   │   └── 🏆 Competition.js     # Platform competitions
│   ├── 🛣️ routes/                # API Route Definitions
│   │   ├── 🔐 auth.js            # Authentication endpoints
│   │   ├── 📚 lessons.js         # Lesson CRUD operations
│   │   ├── 🧠 quizzes.js         # Quiz management
│   │   ├── 🎯 realWorldTasks.js  # Task operations
│   │   ├── 🎮 gamification.js    # Points & badges API
│   │   ├── 🌐 community.js       # Social features API
│   │   ├── 📰 news.js            # News feed endpoints
│   │   ├── 🏆 leaderboard.js     # Rankings API
│   │   ├── 🏅 badges.js          # Badge management
│   │   ├── 📊 analytics.js       # Analytics endpoints
│   │   ├── 🔔 notifications.js   # Notification API
│   │   ├── 👩‍🏫 teacher.js        # Teacher-specific routes
│   │   ├── 👥 users.js           # User management
│   │   └── 📋 content.js         # Content management
│   ├── 🔒 middlewares/           # Custom Middleware
│   │   └── auth.js               # JWT authentication middleware
│   ├── ⚙️ config/                # Configuration Files
│   │   ├── database.js           # MongoDB connection
│   │   └── aws.js                # AWS services configuration
│   ├── 📊 scripts/               # Database & Utility Scripts
│   │   ├── seedRealLessons.js    # Educational content seeder
│   │   ├── seedGamificationData.js # Points & badges seeder
│   │   ├── seedMockData.js       # Development test data
│   │   ├── createTestUsers.js    # User account generator
│   │   ├── makeAdmin.js          # Admin role assignment
│   │   └── testAuth.js           # Authentication testing
│   ├── 🛠️ utils/                 # Backend Utilities
│   │   ├── cognitoHelper.js      # AWS Cognito integration
│   │   ├── emailService.js       # Email notifications
│   │   ├── fileUpload.js         # File handling utilities
│   │   └── otpDisplay.js         # OTP generation
│   ├── 📁 uploads/               # File Storage
│   │   └── task-proofs/          # Student task submission files
│   ├── 📦 package.json           # Backend dependencies
│   ├── 🚀 server.js              # Express server entry point
│   ├── 🔐 .env                   # Server environment variables
│   ├── 📋 .env.example           # Environment template
│   └── 📊 server.log             # Application logs
├── 📚 docs/                       # Project Documentation
│   ├── AUTHENTICATION_GUIDE.md   # Auth setup instructions
│   ├── AWS_COGNITO_SETUP.md      # AWS configuration
│   ├── DEPLOYMENT.md             # Production deployment
│   ├── FEATURES_UPDATE.md        # Feature changelog
│   └── QUICK_START.md            # Getting started guide
├── 📦 package.json                # Root package manager
├── 🚫 .gitignore                  # Git ignore rules
└── 📖 README.md                   # This comprehensive guide
```
</details>

### 🏗️ **Architecture Explanation**

#### **Frontend (React Client)**
- **📄 Pages**: Full-screen application views with routing
- **🧩 Components**: Reusable UI elements shared across pages
- **🔌 Services**: API communication and external integrations
- **🎨 Contexts**: Global state management (Auth, Theme)
- **📊 Data**: Static content like quiz questions and sample data
- **🛠️ Utils**: Helper functions and utility libraries

#### **Backend (Node.js Server)**
- **🎮 Controllers**: Business logic and request handling
- **🗃️ Models**: Database schemas and data validation
- **🛣️ Routes**: API endpoint definitions and middleware
- **⚙️ Config**: Database and service configurations
- **📊 Scripts**: Database seeders and utility scripts
- **🛠️ Utils**: Backend helper functions and integrations

#### **Key Design Patterns**
- **🔄 MVC Architecture**: Separation of concerns
- **⚛️ Component-Based UI**: Reusable React components
- **🔌 RESTful API**: Standard HTTP methods and endpoints
- **🎨 Context Pattern**: Global state without prop drilling
- **🔒 Middleware Chain**: Authentication and validation layers

### 📱 **Component Hierarchy**

```
App.js
├── 🔐 AuthContext (Global authentication state)
├── 🎨 ThemeContext (Dark/Light mode management)
├── 📱 Navbar (Always visible navigation)
├── 🛣️ Router
│   ├── 🎓 StudentDashboard
│   │   ├── 🎮 GamificationDashboard
│   │   ├── 📊 Recent Tasks Section
│   │   └── 📋 SidePanel
│   ├── 👩‍🏫 TeacherDashboard
│   │   ├── 📊 Analytics Components
│   │   ├── 🔔 TeacherRequestBar
│   │   └── 📋 Task Management
│   ├── 🎯 RealWorldTasks
│   │   ├── 🧠 QuizCard (Integrated)
│   │   └── 📝 Task Submission Forms
│   └── 🌐 CommunityPage
│       ├── 📝 Post Creation
│       └── 💬 Community Feed
└── 🦶 Footer (Site-wide footer)
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
- **🎭 Animations**: Smooth hover effects, badge celebrations, confetti rewards
- **📱 Responsive Design**: Mobile-first with breakpoints at 768px, 1024px, 1440px
- **♿ Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **🌙 Theme Support**: Light/Dark mode with system preference detection

### **File Naming Conventions**
- **📄 Pages**: PascalCase folders with matching component names
- **🧩 Components**: PascalCase with descriptive names
- **🔌 Services**: camelCase with 'Service' suffix
- **🛠️ Utils**: camelCase utility functions
- **🎨 Styles**: Component-specific CSS files matching component names

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

## 🌟 **Screenshots & Demo**

<div align="center">
  <p><em>🚀 Live Demo Coming Soon!</em></p>
</div>

## 📞 **Support & Contact**

- 📧 **Email**: support@greensphere.edu
- 💬 **Discord**: [Join our community](https://discord.gg/greensphere)
- 📖 **Documentation**: [Full API Docs](./docs/)
- 🐛 **Issues**: [Report bugs here](https://github.com/yourusername/GreenSphere/issues)

---

<div align="center">
  <h3>🌍 Making Environmental Education Engaging, One Student at a Time</h3>
  <p><strong>Built with ❤️ for a sustainable future</strong></p>
  
  <p>
    <a href="#-quick-start-guide">🚀 Get Started</a> •
    <a href="#-key-features">✨ Features</a> •
    <a href="#-contributing">🤝 Contribute</a> •
    <a href="#-license">📄 License</a>
  </p>
  
  <p><sub>⭐ Star this repo if you find it helpful!</sub></p>
</div>