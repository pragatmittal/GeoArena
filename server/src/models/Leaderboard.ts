import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaderboard extends Document {
  username: string;
  totalScore: number;
  avgDistanceKm: number;
  gamesPlayed: number;
  createdAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboard>(
  {
    username: { type: String, required: true, index: true },
    totalScore: { type: Number, default: 0 },
    avgDistanceKm: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Leaderboard = mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);
