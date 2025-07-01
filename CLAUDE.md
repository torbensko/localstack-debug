# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a real-time SQS monitoring dashboard for LocalStack development. It provides a web-based interface to monitor AWS SQS queues running on LocalStack, displaying queue statistics and message contents in real-time using WebSocket connections.

## Development Commands

- `yarn dev` - Start development server with hot reload (uses nodemon)
- `yarn start` - Start production server directly with ts-node
- `npx tsc` - Compile TypeScript (outputs to dist/ directory)

## Architecture

The application consists of:

1. **Express Server** (`src/index.ts`): Main HTTP server that serves static files and handles SQS polling
2. **Socket.IO Integration**: Real-time WebSocket communication for live queue updates
3. **AWS SQS Polling**: Continuous polling of LocalStack SQS queues every 5 seconds
4. **Static Files** (`public/`): Separated frontend assets
   - `public/index.html`: Main dashboard HTML
   - `public/css/styles.css`: Dashboard styling
   - `public/js/client.js`: Client-side Socket.IO logic

## Key Configuration

- **LocalStack Endpoint**: `http://localhost:4566` (ap-southeast-2 region)
- **Server Port**: 3001
- **Queue URLs**: Configured in `queueUrls` array in `src/index.ts:18-23`
- **Polling Interval**: 5 seconds

## LocalStack Integration

- Uses AWS SDK v2 configured for LocalStack
- Polls queue attributes: `ApproximateNumberOfMessages`, `ApproximateNumberOfMessagesNotVisible`, `ApproximateNumberOfMessagesDelayed`
- Receives up to 5 messages per queue with 5-second visibility timeout
- Messages are peeked (not deleted) to maintain visibility for debugging

## Development Setup

1. Ensure LocalStack is running on port 4566
2. Configure your SQS queue URLs in the `queueUrls` array
3. Run `yarn dev` to start the development server
4. Access dashboard at `http://localhost:3001`