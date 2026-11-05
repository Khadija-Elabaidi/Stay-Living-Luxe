import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const setupWebSocket = (onMessageReceived, topic) => {
  const client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8085/ws'),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('Connecté au WebSocket');
      client.subscribe(topic, (message) => {
        if (message.body) {
          try {
            onMessageReceived(JSON.parse(message.body));
          } catch {
            onMessageReceived(message.body);
          }
        }
      });
    },
  });

  client.activate();
  return client;
};