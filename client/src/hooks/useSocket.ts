import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

let globalSocket: Socket | null = null;

export function useSocket(): Socket | null {
  if (!globalSocket) {
    globalSocket = io(SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });
  }

  return globalSocket;
}
