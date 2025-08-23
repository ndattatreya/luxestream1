# 🎬 OTT Platform with AI Recommendation System

An AI-powered OTT (Over-The-Top) streaming web application built using the MERN stack. This platform allows users to browse, stream, and get personalized recommendations for movies and TV shows using hybrid machine learning models (Decision Tree + ANN).

> **## Recommendation System - Future Work**

## 🚀 Features

- 🔐 User Authentication (Email + OAuth via Google & GitHub)
- 🎞️ Movie & TV Show Streaming
- 🔍 Advanced Search and Filters
- ❤️ Watchlist Management
- 💳 Razorpay Payment Integration
- 🤖 AI-Powered Recommendation System (To Be Implemented)
  - Content-based Filtering
  - Decision Tree Classifier
  - Artificial Neural Network (ANN) for personalization
- 🛠️ Admin Dashboard for Content Management


## 🧠 AI Recommendation System (To Be Implemented)

Our hybrid recommender system uses:
- ✅ **Content-based Filtering** to suggest similar movies based on metadata.
- 🌲 **Decision Tree Classifier** to learn from user preferences.
- 🧠 **ANN (Artificial Neural Network)** to handle complex patterns and improve personalization.

Model built using:
- Python
- scikit-learn
- TensorFlow


## 🛠️ Tech Stack

**Frontend**  
- React.js  
- Tailwind CSS  

**Backend**  
- Node.js  
- Express.js  

**Database**  
- MongoDB (MongoDB Atlas)

**AI/ML**  
- Python (TensorFlow, scikit-learn)

**Payment Gateway**  
- Razorpay


## 📁 Project Structure

.
├── client/               # React Frontend
├── server/               # Express Backend
├── ai-model/             # Python ML Models
├── README.md             # Project Overview

## 🧪 Running Locally

### Prerequisites
- Node.js
- Python (3.8+)
- MongoDB Atlas account
- Razorpay API keys
- Google & GitHub OAuth credentials

### Clone the repo


git clone [https://github.com/ndattatreya/luxestream1.git](https://github.com/ndattatreya/luxeStream.git)


### Start the Frontend

cd client
npm install
npm run dev

### Start the Backend

cd server
npm install
node server.js

### Run the AI Model (optional API microservice)

cd ai-model
pip install -r requirements.txt
python app.py

## 👥 Contributors

- **Dabbiru Sai Trishvan**  
- **Lakshmi Narasimham Rallabandi**  
- **Dattatreya**

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🌐 Live Demo

[🚀 Hosted on Vercel/Render]
https://luxestream1.vercel.app/


Let me know if you'd like:
- Badges (Build, License, Version, etc.)
- Screenshots section
- Contribution guidelines
- API docs section

I can also help you generate a `requirements.txt`, `.env.example`, or auto-deploy script.
