# SmartSyllabus - Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier works)
- Git

### Step 1: Clone & Install
```bash
git clone https://github.com/ysyed9/SmartSyllabus.git
cd SmartSyllabus
```

### Step 2: Set Up MongoDB
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and `<cluster>` in the connection string

### Step 3: Environment Setup

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/syllabus-app?retryWrites=true&w=majority
PORT=5000
```

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 5: Run the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 6: Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🎉 You're Ready!

Your SmartSyllabus application is now running locally. You can:
- Upload syllabus files (PDF/Images)
- Add and track assignments
- Generate calendar files
- View upcoming assignments

## 📚 Next Steps
- Check the main [README.md](README.md) for detailed documentation
- Explore the API endpoints
- Deploy to production using the deployment guide

## 🆘 Need Help?
- Check the [Troubleshooting section](README.md#-troubleshooting) in the main README
- Open an issue on GitHub
- Review the API documentation 