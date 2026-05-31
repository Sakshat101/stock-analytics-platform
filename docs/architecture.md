# System Architecture

React Frontend
│
├── Dashboard
├── Portfolio
├── Watchlist
├── Analytics
├── Alerts
└── News Sentiment
│
▼
Node.js + Express API
│
├── Authentication
├── Portfolio APIs
├── Watchlist APIs
├── Analytics APIs
├── Alerts APIs
└── Socket.IO Server
│
├───────────────► PostgreSQL (Neon)
│
▼
FastAPI AI Service
│
└── 7-Day Forecast API

Data Flow:

User
↓
React Frontend
↓
Express Backend
↓
PostgreSQL Database

AI Requests
↓
React Frontend
↓
FastAPI AI Service
↓
Prediction Response
