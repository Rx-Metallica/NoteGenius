# 🧠 NoteGenius – AI-Powered Note-Taking App

> A full-stack MERN application that lets users create, organize, and chat with their notes — powered by **Gemini AI**.  
> Built by ❤️ [Aditya Mote](https://moteaditya.vercel.app/)

---

## 🚀 Live Demo
🌐 **Frontend:** [https://note-genius-chi.vercel.app/](#)  
⚙️ **Backend API:** [https://note-genius-server.vercel.app/](#)

---

## ✨ Features

### 🧑‍💻 Authentication
- Register & Login using **JWT**
- Passwords hashed with **bcrypt**
- User-specific data isolation (each user sees only their notes)

### 📝 Notes Management
- Create, Read, Update, Delete (CRUD) notes
- Notes stored in MongoDB with timestamps
- Only authenticated users can access their notes

### 🤖 AI Integration (Gemini)
- Automatically generates **summaries and tags** from note title + description
- AI-powered **chat system** that lets users interact with their own notes
- Uses **Google Gemini 1.5 Flash API**

### 📊 Analytics (Optional Future)
- Track total notes, tags, and recent activity

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **AI Integration** | Gemini API (Google Generative AI) |
| **Auth** | JWT + bcrypt |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend) |

---

## 🏗️ Folder Structure
backend/
├── config/ # Database connection
├── controllers/ # Business logic
│ ├── authController.js
│ ├── noteController.js
│ └── chatController.js
├── middleware/ # JWT auth middleware
│ └── auth.js
├── models/ # Mongoose schemas
│ ├── User.js
│ └── Note.js
├── routes/ # API endpoints
│ ├── authRoutes.js
│ ├── noteRoutes.js
│ └── chatRoutes.js
├── utils/ # Helper functions (Gemini integration)
│ └── aiHelper.js
├── .env
└── server.js

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/<your-username>/NoteGenius.git
cd NoteGenius

cd backend
npm install

cd frontend
npm install

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key

Frontend
npm run dev

Backend
nodemon server.js

🧠 Gemini AI Integration

Gemini is used to:

Generate summaries and tags for each note

Power the chat interface that answers based on user’s own notes

🔗 API Endpoint:
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

💬 Chat with Notes (Example)
POST /api/chat
Authorization: Bearer <token>

{
  "message": "Summarize my notes about React"
}


Response:

{
  "reply": "React basics include components, state, and props for UI development."
}
```

## 🛡️ Security

JWT tokens stored securely

Passwords hashed with bcrypt

Protected routes for user notes and chat

📸 Screenshots
Dashboard	AI Chat

<img width="1841" height="900" alt="image" src="https://github.com/user-attachments/assets/37470d17-6f89-4aab-a65b-ba37f4fd0010" />
