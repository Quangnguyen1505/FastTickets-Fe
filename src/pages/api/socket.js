// pages/api/socket.js
import { Server } from 'socket.io';

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('🔌 Socket.IO server starting...');
    
    io = new Server(res.socket.server, {
      path: '/api/socket_io',
    });

    res.socket.server.io = io;

    io.on('connection', socket => {
      console.log('👤 New client connected:', socket.id);

      socket.on('message', msg => {
        console.log('📩 Message received:', msg);
        io.emit('message', msg); // broadcast lại
      });

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
      });
    });
  } else {
    console.log('✅ Socket.IO already running');
  }

  res.end();
}
