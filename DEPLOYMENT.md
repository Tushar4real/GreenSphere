# GreenSphere Deployment Guide

## 🚀 Quick Deployment on AWS EC2

### Prerequisites
- AWS Account with EC2 access
- MongoDB Atlas account
- AWS Cognito User Pool setup
- Domain name (optional)

### Step 1: AWS Cognito Setup

1. **Create User Pool**
   ```bash
   # Go to AWS Cognito Console
   # Create User Pool with email verification
   # Note down: User Pool ID and Client ID
   ```

2. **Configure User Pool**
   - Enable email verification
   - Add custom attributes: `custom:role`, `custom:school`
   - Set password policy (minimum 6 characters)
   - Enable self-registration

### Step 2: MongoDB Atlas Setup

1. **Create Cluster**
   ```bash
   # Go to MongoDB Atlas
   # Create free cluster
   # Create database user
   # Whitelist IP addresses (0.0.0.0/0 for development)
   # Get connection string
   ```

### Step 3: EC2 Instance Setup

1. **Launch EC2 Instance**
   ```bash
   # Launch Ubuntu 20.04 LTS t2.micro (free tier)
   # Security Group: Allow HTTP (80), HTTPS (443), SSH (22)
   # Create or use existing key pair
   ```

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install nginx -y

   # Install Git
   sudo apt install git -y
   ```

### Step 4: Deploy Application

1. **Clone Repository**
   ```bash
   cd /home/ubuntu
   git clone https://github.com/your-username/greensphere.git
   cd greensphere
   ```

2. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server
   npm install
   cd ..

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Configuration**
   ```bash
   # Server environment
   cd server
   cp .env.example .env
   nano .env
   ```

   **Server .env file:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greensphere
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # AWS Cognito Configuration
   AWS_REGION=us-east-1
   COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
   COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

   ```bash
   # Client environment
   cd ../client
   cp .env.example .env
   nano .env
   ```

   **Client .env file:**
   ```env
   REACT_APP_API_URL=http://your-ec2-public-ip:5000/api
   REACT_APP_AWS_REGION=us-east-1
   REACT_APP_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
   REACT_APP_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Seed Demo Data**
   ```bash
   cd ../server
   node seedData.js
   ```

5. **Build Client**
   ```bash
   cd ../client
   npm run build
   ```

6. **Start Server with PM2**
   ```bash
   cd ../server
   pm2 start server.js --name "greensphere-server"
   pm2 startup
   pm2 save
   ```

### Step 5: Nginx Configuration

1. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/greensphere
   ```

   **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com your-ec2-public-ip;

       # Serve React build files
       location / {
           root /home/ubuntu/greensphere/client/build;
           index index.html index.htm;
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests to Node.js server
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }

       # Serve uploaded files
       location /uploads {
           alias /home/ubuntu/greensphere/server/uploads;
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

2. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/greensphere /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step 6: SSL Certificate (Optional)

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Get SSL Certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

### Step 7: Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Step 8: Monitoring and Maintenance

1. **Monitor PM2 Processes**
   ```bash
   pm2 status
   pm2 logs greensphere-server
   pm2 restart greensphere-server
   ```

2. **Monitor System Resources**
   ```bash
   htop
   df -h
   free -m
   ```

3. **Backup Database**
   ```bash
   # MongoDB Atlas provides automatic backups
   # For additional backups, use mongodump
   ```

## 🔧 Development Deployment

### Local Development

1. **Start MongoDB locally or use Atlas**
2. **Start Backend**
   ```bash
   cd server
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd client
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Docker Deployment (Alternative)

1. **Create Dockerfile for Server**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Create Dockerfile for Client**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     server:
       build: ./server
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
     client:
       build: ./client
       ports:
         - "80:80"
       depends_on:
         - server
   ```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check API URL in client .env
   - Verify server CORS configuration

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in Atlas

3. **AWS Cognito Issues**
   - Verify User Pool ID and Client ID
   - Check AWS credentials and permissions

4. **File Upload Issues**
   - Check uploads directory permissions
   - Verify multer configuration

### Performance Optimization

1. **Enable Gzip Compression**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Add Caching Headers**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Monitor and Scale**
   - Use CloudWatch for monitoring
   - Consider load balancer for high traffic
   - Implement Redis for session management

## 📱 Mobile Deployment

### Progressive Web App (PWA)

1. **Add Service Worker**
2. **Create Manifest File**
3. **Enable HTTPS**
4. **Test Mobile Responsiveness**

### React Native (Future Enhancement)

1. **Expo CLI Setup**
2. **Shared API Integration**
3. **Platform-specific Features**

---

**🎉 Your GreenSphere platform is now live and ready for the hackathon!**

Access your application at: `http://your-ec2-public-ip` or `https://your-domain.com`