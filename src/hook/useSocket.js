import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket"; // đường dẫn đúng với project của bạn

const useSocket = (serverUrl, path = "/socket.io", eventName) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = getSocket(serverUrl, path);

    if (eventName) {
      const handler = (msg) => {
        console.log(`Received ${eventName}:`, msg);
        setMessages((prev) => [...prev, msg]);
      };
      socket.on(eventName, handler);

      // Clean up chỉ handler, không disconnect toàn bộ socket
      return () => {
        socket.off(eventName, handler);
      };
    }
  }, [serverUrl, path, eventName]);

  return {
    socket: getSocket(serverUrl, path),
    messages,
  };
};

export default useSocket;
