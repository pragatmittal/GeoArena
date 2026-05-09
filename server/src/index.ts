import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerRoomHandlers } from './sockets/roomHandler';
import { registerRoundHandlers } from './sockets/roundHandler';

import questionsRouter from './routes/questions';
import roomsRouter from './routes/rooms';
import leaderboardRouter from './routes/leaderboard';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Normalize origins: auto-add https:// if protocol is missing (e.g. "geo-arena-nu.vercel.app" → "https://geo-arena-nu.vercel.app")
const rawOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

const allowedOrigins = rawOrigins.map((o) =>
  o.startsWith('http://') || o.startsWith('https://') ? o : `https://${o}`
);

console.log('Allowed CORS origins:', allowedOrigins);

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked: ${origin} | Allowed: ${allowedOrigins.join(', ')}`);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
} as any);

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/questions', questionsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/leaderboard', leaderboardRouter);

// @ts-ignore
io.on('connection', (socket: any) => {
  registerRoomHandlers(io, socket);
  registerRoundHandlers(io, socket);
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://pragatmittal:UnPIsTSFvPNGSlqq@cluster0.wu2rf.mongodb.net/GeoArena';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
