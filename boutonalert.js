const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Un client est connecté');

  ws.on('message', (message) => {
    console.log(`Message reçu: ${message}`);

    ws.send('Message reçu par le serveur');
  });

  ws.on('close', () => {
    console.log('Un client s\'est déconnecté');
  });
});

server.listen(3000, () => {
  console.log('Serveur WebSocket écoutant sur le port 3000');
});
