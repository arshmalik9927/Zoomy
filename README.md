# 🎥 Zoomy – Real-Time Video Meeting Platform

> A modern full-stack video meeting platform that allows users to create and join real-time video meetings using unique meeting codes.

---

## 📌 About The Project

**Zoomy** is a full-stack real-time video conferencing web application built to provide a simple and interactive online meeting experience.

Users can register and log in, create a meeting, share a unique meeting code, and allow other users to join the same meeting.

The application uses **WebRTC** for real-time peer-to-peer audio/video communication and **Socket.IO** for real-time signaling, chat, participant management, and meeting events.

---

## ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- Logout
- User session using LocalStorage

### 🎥 Meeting
- Create instant meeting
- Join meeting using meeting code
- Real-time video communication
- Real-time audio communication
- Unique meeting codes
- Leave meeting functionality

### 🎤 Meeting Controls
- Microphone ON/OFF
- Camera ON/OFF
- Leave Meeting
- Participants panel
- Real-time participant updates

### 💬 Real-Time Chat
- Send messages instantly
- Receive messages in real-time
- Sender username display
- Separate sender/receiver message bubbles
- Auto-scroll to latest message

### 👥 Participants
- Live participant list
- Participant count
- Logged-in username display
- Real-time join/leave updates

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- React Router

### Backend
- Node.js
- Express.js
- Socket.IO

### Database
- MongoDB
- Mongoose

### Real-Time Communication
- WebRTC
- Socket.IO

---

## 🏗️ Project Architecture

```text
Zoomy
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   │   ├── Hero.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Meeting.jsx
│   │   │   └── JoinMeeting.jsx
│   │   │
│   │   ├── style
│   │   │   ├── Dashboard.css
│   │   │   ├── Meeting.css
│   │   │   └── JoinMeeting.css
│   │   │
│   │   └── App.jsx
│
├── backend
│   ├── controllers
│   │   └── socketmager.js
│   │
│   ├── routes
│   │   ├── meeting.js
│   │   └── user.js
│   │
│   └── server.js
│
└── README.md



## how it works
User
 │
 ▼
Login / Register
 │
 ▼
Dashboard
 │
 ├───────────────┐
 ▼               ▼
Create Meeting   Join Meeting
 │               │
 ▼               ▼
Meeting Code     Enter Code
 │               │
 └───────┬───────┘
         ▼
   Meeting Room
         │
   ┌─────┼─────────┐
   ▼     ▼         ▼
 Video  Chat   Participants
   │     │         │
   └─────┼─────────┘
         ▼
      WebRTC
         +
      Socket.IO
