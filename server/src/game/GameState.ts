import { IQuestion } from '../models/Question';

export interface PlayerState {
  socketId: string;
  username: string;
  score: number;
  guess: { lat: number; lng: number } | null;
  distanceKm: number | null;
  hasGuessed: boolean;
}

export interface GameState {
  roomId: string;
  players: Map<string, PlayerState>;   // key = socketId
  questions: IQuestion[];              // shuffled subset from DB
  currentRoundIndex: number;
  phase: 'lobby' | 'question' | 'reveal' | 'finished';
  timerRef: NodeJS.Timeout | null;
  roundStartedAt: number;
  originalHost: string;
  currentHost: string; // Date.now() for drift correction
}

const rooms = new Map<string, GameState>();
export default rooms;
