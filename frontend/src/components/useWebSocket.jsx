import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { baseURL } from '../config/AxiosHelper';

const useWebSocket = (roomId, currentUser, connected) => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected to chat");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });

        const heartbeatInterval = setInterval(() => {
          client.send(
            `/app/presence/${roomId}/heartbeat`,
            {},
            JSON.stringify({ username: currentUser, roomId: roomId })
          );
        }, 30000);

        return () => {
          clearInterval(heartbeatInterval);
          if (client.connected) {
            client.disconnect();
          }
        };
      });
    };

    if (connected) {
      connectWebSocket();
    }

    return () => {
      if (stompClient?.connected) {
        stompClient.disconnect();
      }
    };
  }, [roomId, currentUser, connected]);

  return { stompClient, messages, setMessages };
};

export default useWebSocket;