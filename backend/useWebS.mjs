import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 5000 });

console.log('Servidor WebSocket corriendo en ws://localhost:5000');

wss.on('connection', (ws) => {
  console.log('Un nuevo cliente se conectó');

  ws.on('message', (data) => {
    console.log('Mensaje recibido:', data.toString());

    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(data.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('El cliente se desconectó');
  });
});
