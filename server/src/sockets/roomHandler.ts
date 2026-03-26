import { Server, Socket } from 'socket.io';
import rooms, { PlayerState } from '../game/GameState';
import { Room } from '../models/Room';

export function registerRoomHandlers(io: Server, socket: Socket) {
  socket.on('join_room', async ({ roomId, username }: { roomId: string, username: string }) => {
    try {
      socket.join(roomId);

      let gameState = rooms.get(roomId);
      let isNewRoom = false;
      if (!gameState) {
        isNewRoom = true;
        gameState = {
          roomId,
          players: new Map(),
          questions: [],
          currentRoundIndex: 0,
          phase: 'lobby',
          timerRef: null,
          roundStartedAt: 0,
          originalHost: '',
          currentHost: ''
        };
        rooms.set(roomId, gameState);
      }

      const player: PlayerState = {
        socketId: socket.id,
        username,
        score: 0,
        guess: null,
        distanceKm: null,
        hasGuessed: false,
      };
      
      gameState.players.set(socket.id, player);

      const roomDoc = await Room.findOne({ code: roomId });
      if (!roomDoc) {
        gameState.players.delete(socket.id);
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      if (isNewRoom || !gameState.originalHost) {
        gameState.originalHost = roomDoc.host;
        gameState.currentHost = roomDoc.host;
      }

      if (username === gameState.originalHost) {
        gameState.currentHost = username;
      } else if (!gameState.currentHost || Array.from(gameState.players.values()).findIndex(p => p.username === gameState.currentHost) === -1) {
        gameState.currentHost = Array.from(gameState.players.values())[0].username;
      }

      io.to(roomId).emit('player_joined', { 
        players: Array.from(gameState.players.values()),
        hostUsername: gameState.currentHost
      });
    } catch (err) {
      console.error(err);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  socket.on('leave_room', ({ roomId }: { roomId: string }) => {
    handlePlayerLeave(io, socket, roomId);
  });

  socket.on('disconnect', () => {
    for (const [roomId, gameState] of rooms.entries()) {
      if (gameState.players.has(socket.id)) {
        handlePlayerLeave(io, socket, roomId);
      }
    }
  });
}

function handlePlayerLeave(io: Server, socket: Socket, roomId: string) {
  const gameState = rooms.get(roomId);
  if (!gameState) return;

  const playerInfo = gameState.players.get(socket.id);
  if (!playerInfo) return;

  gameState.players.delete(socket.id);
  socket.leave(roomId);
  
  io.to(roomId).emit('player_left', { socketId: socket.id });

  if (gameState.players.size > 0) {
    if (gameState.currentHost === playerInfo.username) {
      gameState.currentHost = Array.from(gameState.players.values())[0].username;
    }
    io.to(roomId).emit('player_joined', { 
      players: Array.from(gameState.players.values()),
      hostUsername: gameState.currentHost 
    });
  } else {
    rooms.delete(roomId);
  }
}
