# CampusConnect

CampusConnect is a premium, production-ready collegiate social network tailored to enhance connections, academic success, and professional growth.

## Architecture

This project is organized as a monorepo-style structure:
- **`frontend/`**: Vite + React 19 + Tailwind CSS single page application (SPA).
- **`backend/`**: Node.js + Express.js backend with PostgreSQL, Socket.IO, and Cloudinary integrations.
- **`docs/`**: API specifications and database relational schemas.

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Setting up the Backend
1. Go to `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in credentials:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

### Setting up the Frontend
1. Go to `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```

## Future Modules
- **Feed**: Main community feed supporting posts, likes, comments, and shares.
- **Messaging**: Real-time Socket.io chat with user status & message read receipts.
- **Events**: Organization of college summits, meetings, and community gatherings.
- **Resources**: Student-uploaded notes, papers, and collegiate tools.
