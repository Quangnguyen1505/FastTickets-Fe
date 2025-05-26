import { io } from "socket.io-client";

let socket;

export const getSocket = (serverUrl, path = "/socket.io") => {
  if (!socket) {
    socket = io(serverUrl, { path });
  }
  return socket;
};
