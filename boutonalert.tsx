import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.56.1:3000'); 
    socket.onmessage = (event) => {
      console.log('Message reçu:', event.data);
      setNotification(event.data); 
    };

    socket.onopen = () => {
      console.log('Connecté au serveur WebSocket');
    };

    socket.onclose = () => {
      console.log('Déconnecté du serveur WebSocket');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Contrôleur WebSocket</h1>
      {notification && <p style={{ color: 'red' }}>{notification}</p>}
    </div>
  );
};

export default App;
