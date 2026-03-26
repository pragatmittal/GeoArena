import { create } from 'zustand';

export interface PlayerState {
  socketId: string;
  username: string;
  score: number;
  guess: { lat: number; lng: number } | null;
  distanceKm: number | null;
  hasGuessed: boolean;
}

export interface GuessResult {
  username: string;
  lat: number;
  lng: number;
  distanceKm: number;
  points: number;
}

export interface GameStoreState {
  phase: 'lobby' | 'question' | 'reveal' | 'finished';
  roomId: string;
  roomCode: string;
  hostUsername: string;
  username: string;
  players: PlayerState[];
  currentQuestion: { name: string; hint: string; region: string } | null;
  correctLocation: { lat: number; lng: number } | null;
  myGuess: { lat: number; lng: number } | null;
  roundIndex: number;
  totalRounds: number;
  timeLeft: number;
  allGuesses: GuessResult[];
  leaderboard: any[];
  finalScores: any[];
  roundDuration: number;
  roundStartedAt: number;

  setPhase: (phase: 'lobby' | 'question' | 'reveal' | 'finished') => void;
  setRoomInfo: (roomId: string, roomCode: string, username: string) => void;
  setPlayers: (players: PlayerState[], hostUsername?: string) => void;
  setQuestion: (roundIndex: number, totalRounds: number, question: any, duration: number) => void;
  setMyGuess: (lat: number, lng: number) => void;
  setReveal: (correctLocation: any, guesses: any[], scores: PlayerState[]) => void;
  resetRound: () => void;
  setGameOver: (finalScores: any[], leaderboard: any[]) => void;
  updateTimeLeft: () => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  phase: 'lobby',
  roomId: '',
  roomCode: '',
  hostUsername: '',
  username: '',
  players: [],
  currentQuestion: null,
  correctLocation: null,
  myGuess: null,
  roundIndex: 0,
  totalRounds: 10,
  timeLeft: 30,
  allGuesses: [],
  leaderboard: [],
  finalScores: [],
  roundDuration: 30,
  roundStartedAt: 0,

  setPhase: (phase) => set({ phase }),
  setRoomInfo: (roomId, roomCode, username) => set({ roomId, roomCode, username }),
  setPlayers: (players, hostUsername) => set(state => ({ 
    players, 
    hostUsername: hostUsername !== undefined ? hostUsername : state.hostUsername 
  })),
  setQuestion: (roundIndex, totalRounds, question, duration) => set({
    phase: 'question',
    roundIndex,
    totalRounds,
    currentQuestion: question,
    roundDuration: duration,
    roundStartedAt: Date.now(),
    timeLeft: duration,
    myGuess: null,
    correctLocation: null,
    allGuesses: []
  }),
  setMyGuess: (lat, lng) => set({ myGuess: { lat, lng } }),
  setReveal: (correctLocation, guesses, scores) => set({
    phase: 'reveal',
    correctLocation,
    allGuesses: guesses,
    players: scores
  }),
  resetRound: () => set({ myGuess: null, correctLocation: null, allGuesses: [] }),
  setGameOver: (finalScores, leaderboard) => set({
    phase: 'finished',
    finalScores,
    leaderboard
  }),
  updateTimeLeft: () => {
    const { roundDuration, roundStartedAt, phase } = get();
    if (phase !== 'question') return;
    const elapsed = Math.floor((Date.now() - roundStartedAt) / 1000);
    const timeLeft = Math.max(0, roundDuration - elapsed);
    set({ timeLeft });
  }
}));

export default useGameStore;
