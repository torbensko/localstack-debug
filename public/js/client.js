const socket = io();

socket.on('update', (payload) => {
  const container = document.getElementById('data');
  container.innerHTML = '';

  // payload is an array of objects => [ { url, attributes, messages }, ... ]
  payload.forEach(queueInfo => {
    const col = document.createElement('div');
    col.classList.add('queue-column');
    col.innerHTML = `
      <h2>${queueInfo.url}</h2>
      <ul>
        <li>ApproximateNumberOfMessages: ${queueInfo.attributes.ApproximateNumberOfMessages || 0}</li>
        <li>ApproximateNumberOfMessagesNotVisible: ${queueInfo.attributes.ApproximateNumberOfMessagesNotVisible || 0}</li>
        <li>ApproximateNumberOfMessagesDelayed: ${queueInfo.attributes.ApproximateNumberOfMessagesDelayed || 0}</li>
      </ul>
      <h3>Messages (peeked)</h3>
      <pre>${JSON.stringify(queueInfo.messages, null, 2)}</pre>
    `;
    container.appendChild(col);
  });
});