const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 5000 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const role = data.role;
      const text = data.text;

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            from: role,
            text: text
          }));
        }
      });
    } catch (err) {
      console.error('Invalid message format:', err);
    }
  });

  ws.on('close', () => {
    console.log('A client disconnected.');
  });
});

console.log('WebSocket chat server running on ws://localhost:5000');

