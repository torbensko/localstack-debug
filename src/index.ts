import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import AWS from "aws-sdk";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Configure AWS SDK to talk to LocalStack using ap-southeast-2:
const sqs = new AWS.SQS({
  region: "ap-southeast-2",
  endpoint: "http://localhost:4566",
  // If needed: accessKeyId: 'test', secretAccessKey: 'test',
});

// List your LocalStack queue URLs
const queueUrls = [
  // "http://localhost:4566/000000000000/fetch-queue",
  // "http://localhost:4566/000000000000/convert-queue",
  // "http://localhost:4566/000000000000/analyze-queue",
  "http://localhost:4566/000000000000/buildiq-queue",
];

// Serve the main dashboard page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Poll each queue, fetching attributes & messages
async function pollQueues() {
  try {
    const results = await Promise.all(
      queueUrls.map(async (QueueUrl) => {
        // Fetch approximate stats
        const attrData = await sqs
          .getQueueAttributes({
            QueueUrl,
            AttributeNames: [
              "ApproximateNumberOfMessages",
              "ApproximateNumberOfMessagesNotVisible",
              "ApproximateNumberOfMessagesDelayed",
            ],
          })
          .promise();

        // Receive up to 5 messages (do not delete, so they reappear later)
        const msgData = await sqs
          .receiveMessage({
            QueueUrl,
            MaxNumberOfMessages: 5,
            WaitTimeSeconds: 1,
            VisibilityTimeout: 5,
          })
          .promise();

        return {
          url: QueueUrl,
          attributes: attrData.Attributes || {},
          messages: msgData.Messages || [],
        };
      })
    );

    // Broadcast to all connected clients
    io.emit("update", results);
  } catch (err) {
    console.error("Error polling queues:", err);
  }
}

// Poll the queues every 5 seconds
setInterval(pollQueues, 5000);

// Start the server on port 3001
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
