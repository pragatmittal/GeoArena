import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayerRecord {
  socketId: string;
  username: string;
  score: number;
}

export interface IRoom extends Document {
  code: string;
  host: string;
  players: IPlayerRecord[];
  status: 'waiting' | 'active' | 'finished';
  settings: {
    totalRounds: number;
    roundDuration: number;
    difficulty: 'mixed' | 'easy' | 'medium' | 'hard';
  };
  finalScores: {
    username: string;
    totalScore: number;
    avgDistanceKm: number;
  }[];
  createdAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    code: { type: String, required: true, unique: true },
    host: { type: String, required: true },
    players: [
      {
        socketId: { type: String, required: true },
        username: { type: String, required: true },
        score: { type: Number, default: 0 },
      },
    ],
    status: { type: String, enum: ['waiting', 'active', 'finished'], default: 'waiting' },
    settings: {
      totalRounds: { type: Number, default: 10 },
      roundDuration: { type: Number, default: 30 },
      difficulty: { type: String, enum: ['mixed', 'easy', 'medium', 'hard'], default: 'mixed' },
    },
    finalScores: [
      {
        username: { type: String, required: true },
        totalScore: { type: Number, required: true },
        avgDistanceKm: { type: Number, required: true },
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Room = mongoose.model<IRoom>('Room', RoomSchema);
