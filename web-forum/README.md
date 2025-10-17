# Web Forum Frontend

React.js frontend application built with Vite for the Stack Overflow Clone microservices platform.

## Features

- 🔐 User authentication (login/register)
- ❓ Browse and create questions
- 💬 Answer questions
- 👍👎 Vote on questions
- 📝 Write and read blog articles
- 📱 Responsive design
- 🎨 Dark/light mode support

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: CSS3

## Setup

### Prerequisites

- Node.js 20.19+ or 22.12+ (required for Vite 7)
- npm or yarn

**Note**: If you have an older Node.js version, you may encounter compatibility issues. Please upgrade to Node.js 20.19+ or later.

### Installation

```powershell
# Install dependencies
npm install
```

### Development

```powershell
# Start development server
npm run dev

# The app will open at http://localhost:3000
```

### Build for Production

```powershell
# Create production build
npm run build

# Preview production build
npm run preview
```

## API Configuration

The frontend communicates with three backend services. Ensure they are running:

- **Auth Service**: `http://localhost:8001`
- **Question Service**: `http://localhost:8002`
- **Blog Service**: `http://localhost:8003`

API URLs are configured in `src/api.js`.

## Features

### Authentication
- Login/Register with JWT tokens
- Automatic token storage in localStorage
- Protected routes for authenticated users

### Questions & Answers
- Browse all questions
- Create new questions (requires login)
- Post answers to questions
- Upvote/downvote questions
- View tracking

### Blogs
- Read published blog articles
- Write new articles (requires login)
- View count tracking
- Summary and full content view

## Development

This project uses Vite for fast development with Hot Module Replacement (HMR).
