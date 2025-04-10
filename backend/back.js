const WebSocket = require('ws');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected');

  const writeStream = fs.createWriteStream('received.webm');

  ws.on('message', message => {
    writeStream.write(Buffer.from(message));
  });

  ws.on('close', () => {
    writeStream.end();
    console.log('Recording saved as received.webm');
  });
});
