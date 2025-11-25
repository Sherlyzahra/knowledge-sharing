# Knowledge - Microservices Q&A and Blog Platform

Ida Ayu Dwi Wirayanti (42230021)
Ni Wayan Ristyani (42230044)
Wahyu Benartdo Sembiring (42230050)
Sherly Az-Zahra (42230057)

A modern Stack Overflow-inspired knowledge sharing platform built with microservices architecture. Users can ask questions, write answers, vote on content, and publish blog articles.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI-green)
![Frontend](https://img.shields.io/badge/Frontend-React+Vite-purple)
![Database](https://img.shields.io/badge/Database-PostgreSQL-orange)

## Architecture

This project consists of 4 independent services:

```
tugas-kelompok-pak-huma-microservice/
├── auth-service/          # User authentication & authorization (Port 8001)
├── question-service/      # Q&A management with voting (Port 8002)
├── blog-service/          # Blog articles management (Port 8003)
└── web-forum/             # React.js frontend (Port 3000)
```

### For Users:
- 🔐 **Authentication**: Secure registration and login with JWT tokens
- ❓ **Questions**: Ask programming questions and get community answers
- 💡 **Answers**: Provide solutions and help others
- ⬆️ **Voting**: Upvote/downvote questions and answers
- 📝 **Blogs**: Write and publish technical articles
- 👀 **Browse**: View questions, answers, and blogs with metadata (views, votes, dates)
- 👤 **User Roles**: Regular users and admin roles

### Technical Features:
- JWT-based authentication with access and refresh tokens
- Role-based access control (RBAC)
- Password hashing with bcrypt
- RESTful API design
- Real-time view tracking
- Vote statistics
- CORS enabled for frontend communication

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0.23
- **Authentication**: JWT (python-jose 3.3.0)
- **Password Hashing**: bcrypt (passlib 1.7.4)
- **Validation**: Pydantic
- **HTTP Client**: httpx 0.25.1

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 7
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: CSS with modern gradients and animations

## 📋 Prerequisites

### For Docker (Recommended)
- **Docker** 20.10+
- **Docker Compose** 2.0+

### For Manual Setup
- **Python** 3.12+
- **Node.js** 20.19+ or 22.12+
- **PostgreSQL** 12+
- **pip** (Python package manager)
- **npm** (Node package manager)

## 🚀 Running the full stack (Docker Compose)

From the project root, you can start everything with Docker Compose. This will build and run the four services and their PostgreSQL databases:

```powershell
docker-compose up -d --build
```

To stop and remove containers, images, volumes and networks created by the compose file:

```powershell
docker-compose down --rmi all --volumes --remove-orphans
docker system prune -af --volumes
```
