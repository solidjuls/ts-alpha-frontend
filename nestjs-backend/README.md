# NestJS Backend API

A NestJS backend API service designed to replace the Next.js API routes with a dedicated backend service.

## Features

- ✅ NestJS framework with TypeScript
- ✅ CORS enabled for frontend communication
- ✅ Global API prefix (`/api`)
- ✅ Health check endpoint
- ✅ Environment configuration
- ✅ Development hot reload

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev
```

The server will start on `http://localhost:4000`

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run start:prod` - Start the production build

## API Endpoints

### Base URL: `http://localhost:4000/api`

- `GET /` - Hello World endpoint
- `GET /health` - Health check endpoint

### Example Responses

**GET /api/**
```json
"Hello World from NestJS Backend!"
```

**GET /api/health**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "nestjs-backend",
  "version": "1.0.0",
  "uptime": 123.456
}
```

## Project Structure

```
src/
├── app.controller.ts    # Main application controller
├── app.module.ts        # Root application module
├── app.service.ts       # Main application service
└── main.ts             # Application entry point
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Next Steps

1. Add database integration (Prisma/TypeORM)
2. Implement authentication/authorization
3. Create specific API modules (tournaments, users, etc.)
4. Add validation and error handling
5. Implement logging
6. Add testing setup

## Deployment

This backend is designed to be deployed independently from the frontend. Consider using:

- **Development**: Local development server
- **Staging/Production**: Docker containers, Heroku, AWS, or similar platforms
