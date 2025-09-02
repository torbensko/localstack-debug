# localstack-debug

A real-time web dashboard for monitoring AWS SQS queues running on LocalStack. Perfect for debugging queue-based applications during local development.

![LocalStack SQS Dashboard](https://img.shields.io/badge/LocalStack-Compatible-green)

## Features

- **Real-time Queue Monitoring**: Live updates via WebSocket connection
- **Dynamic Queue Discovery**: Automatically finds all SQS queues in LocalStack
- **Message Peeking**: View queue messages without removing them
- **Queue Statistics**: Monitor message counts, delays, and visibility status
- **Zero Configuration**: Works out of the box with LocalStack defaults

## Prerequisites

- Node.js 18+
- LocalStack running with SQS service (port 4566)
- Yarn package manager

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/localstack-debug.git
cd localstack-debug

# Install dependencies
yarn install
```

## Usage

### Development Mode

Start both backend and frontend with hot reload:

```bash
yarn dev:all
```

Then open http://localhost:5173 in your browser.

### Production Mode

```bash
# Build the frontend
yarn build

# Start the server
yarn start
```

Then open http://localhost:3001 in your browser.

## How It Works

The dashboard connects to your LocalStack instance and:
1. Discovers all SQS queues automatically
2. Polls queue statistics every 5 seconds
3. Peeks at up to 5 messages per queue (without deleting them)
4. Broadcasts updates to all connected browsers in real-time

## Configuration

The tool is pre-configured for standard LocalStack setup:
- **LocalStack Endpoint**: `http://localhost:4566`
- **AWS Region**: `ap-southeast-2`
- **Server Port**: `3001` (production) / `5173` (development)

To modify these settings, edit `src/index.ts`.

## Tech Stack

- **Backend**: Express + Socket.IO + AWS SDK v2
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Build**: Vite + PostCSS

## License

MIT