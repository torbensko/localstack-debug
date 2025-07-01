import express from "express";
import http from "http";
import { Server } from "socket.io";
import AWS from "aws-sdk";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

// Serve a simple HTML page with Socket.IO client
app.get("/", (req, res) => {
  // Basic CSS for columns and wrapping
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SQS Dashboard</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cousine:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Cousine', monospace;
            font-size: 12px;
            padding: 20px;
          }
          h1 {
            font-size: 34px;
            margin: 20px 0;
          }
          h2 {
            font-size: 16px;
          }
          .container {
            display: flex;
            flex-wrap: wrap;
          }
          .queue-column {
            flex: 1 1 300px;
            border: 1px solid #ccc;
            margin: 10px;
            padding: 10px;
            min-width: 300px;
            max-width: 600px;
          }
          pre {
            white-space: pre-wrap; 
            word-wrap: break-word; 
          }
        </style>
      </head>
      <body>
        <h1>LocalStack SQS Dashboard</h1>
        <div id="data" class="container"></div>

        <script src="/socket.io/socket.io.js"></script>
        <script>
          const socket = io();
          socket.on('update', (payload) => {
            const container = document.getElementById('data');
            container.innerHTML = '';

            // payload is an array of objects => [ { url, attributes, messages }, ... ]
            payload.forEach(queueInfo => {
              const col = document.createElement('div');
              col.classList.add('queue-column');
              col.innerHTML = \`
                <h2>\${queueInfo.url}</h2>
                <ul>
                  <li>ApproximateNumberOfMessages: \${queueInfo.attributes.ApproximateNumberOfMessages || 0}</li>
                  <li>ApproximateNumberOfMessagesNotVisible: \${queueInfo.attributes.ApproximateNumberOfMessagesNotVisible || 0}</li>
                  <li>ApproximateNumberOfMessagesDelayed: \${queueInfo.attributes.ApproximateNumberOfMessagesDelayed || 0}</li>
                </ul>
                <h3>Messages (peeked)</h3>
                <pre>\${JSON.stringify(queueInfo.messages, null, 2)}</pre>
              \`;
              container.appendChild(col);
            });
          });
        </script>
      </body>
    </html>
  `);
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
