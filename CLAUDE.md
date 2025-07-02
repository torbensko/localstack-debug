# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a real-time SQS monitoring dashboard for LocalStack development. It provides a web-based interface to monitor AWS SQS queues running on LocalStack, displaying queue statistics and message contents in real-time using WebSocket connections.

## Development Commands

- `yarn dev` - Start backend server with hot reload (uses nodemon)
- `yarn dev:client` - Start frontend development server (Vite on port 5173)
- `yarn dev:all` - Start both backend and frontend servers concurrently
- `yarn build` - Build React frontend for production
- `yarn start` - Start production server (requires build first)
- `npx tsc` - Compile TypeScript backend (outputs to dist/ directory)

## Architecture

The application consists of:

1. **Backend** (`src/index.ts`): Express server with Socket.IO for real-time communication
   - Serves built React application from `dist/client/`
   - Dynamically discovers SQS queues using AWS SDK
   - Polls all discovered queues every 5 seconds
   - Broadcasts queue data via WebSocket

2. **Frontend** (`client/`): React application with shadcn/ui components
   - `client/src/App.tsx`: Main application component with Socket.IO client
   - `client/src/components/QueueCard.tsx`: Individual queue display component
   - `client/src/components/ui/`: shadcn/ui components (Card, etc.)
   - Built with Vite and Tailwind CSS v4

3. **Real-time Communication**: Socket.IO for live queue updates between backend and frontend

## Key Configuration

- **LocalStack Endpoint**: `http://localhost:4566` (ap-southeast-2 region)
- **Server Port**: 3001
- **Queue Discovery**: Dynamically discovered from LocalStack
- **Polling Interval**: 5 seconds

## LocalStack Integration

- Uses AWS SDK v2 configured for LocalStack
- Dynamically discovers all SQS queues using `listQueues()`
- Polls queue attributes: `ApproximateNumberOfMessages`, `ApproximateNumberOfMessagesNotVisible`, `ApproximateNumberOfMessagesDelayed`
- Receives up to 5 messages per queue with 5-second visibility timeout
- Messages are peeked (not deleted) to maintain visibility for debugging

## Development Setup

1. Ensure LocalStack is running on port 4566
2. For development: Run `yarn dev:all` to start both backend (port 3001) and frontend (port 5173)
3. For production: Run `yarn build` then `yarn start`
4. Access dashboard at:
   - Development: `http://localhost:5173` (with proxy to backend)
   - Production: `http://localhost:3001`

## Technology Stack

- **Backend**: Node.js, Express, Socket.IO, AWS SDK v2
- **Frontend**: React 19, TypeScript, shadcn/ui, Tailwind CSS v4
- **Build Tools**: Vite, PostCSS
- **Development**: nodemon, concurrently