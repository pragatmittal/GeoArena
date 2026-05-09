# 🌍 GeoArena

**GeoArena** is a real-time multiplayer geography quiz game. Players join a shared room, get asked to locate a place on a world map, click their guess, and earn points based on how close they are to the correct answer. The closer your pin, the higher your score.

> 🚀 **Live Demo:** [geo-arena-nu.vercel.app](https://geo-arena-nu.vercel.app)  
> 🖥️ **Backend API:** [geoarena.onrender.com](https://geoarena.onrender.com)

---

## 📸 How It Works

1. **Enter a username** on the home page
2. **Host a game** (creates a room with a 6-letter code) or **Join an existing room** using a code
3. Once **2+ players** are in the lobby, the host clicks **Start Game**
4. Each round shows a location name + a hint — players **click on the map** to place their guess
5. After every player guesses (or the timer runs out), the **correct location is revealed** along with everyone's pins and points earned
6. The host clicks **Next Round** to continue
7. After all rounds, the **final leaderboard** is shown — scores are saved to the global leaderboard

---

## ⚠️ Known Limitations (Honest)

- **No authentication** — usernames are just strings, there is no account system
- **Host-only controls** — only the room creator can start the game and advance rounds; if the host disconnects, the next player becomes the host automatically
- **Lobby requires 2+ players** — you cannot start a game alone (by design)
- **Render free tier cold starts** — the backend is hosted on Render's free plan, which **spins down after inactivity**. The first request after idle may take **30–50 seconds**
- **Game state is in-memory** — if the Render server restarts mid-game, all active game rooms are lost (questions, scores, etc.)
- **One guess per round** — once you click the map, you cannot change your guess
- **Score formula is exponential decay** — `5000 × e^(-distance / 2000)`. A guess within 1 km earns the full 5000 points; at ~2000 km you earn ~1839 points; beyond that, points drop off sharply
- **Difficulty filter** is set per-room in settings but the UI currently uses `mixed` (all difficulties) by default

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Dev server and bundler |
| React Router v6 | Client-side routing (`/` and `/room/:roomId`) |
| Zustand | Global game state management |
| Socket.io-client | Real-time WebSocket connection to backend |
| React-Leaflet + Leaflet | Interactive world map |
| Esri World Imagery | Satellite tile layer (photorealistic map tiles) |
| Axios | HTTP requests to REST API |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server and REST API |
| TypeScript | Type safety |
| Socket.io | Real-time bidirectional events |
| Mongoose | MongoDB ODM |
| MongoDB Atlas | Cloud-hosted database (questions, rooms, leaderboard) |
| dotenv | Environment variable management |
| cors | Cross-origin request handling |

### Infrastructure
| Service | What It Hosts |
|---|---|
| Vercel | Frontend (React app) |
| Render (free tier) | Backend (Node.js server) |
| MongoDB Atlas | Database |

---

## 📂 Project Structure

```
GeoArena/
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx           # Username input + create/join room
│   │   │   └── Game.tsx           # Main game page (lobby → question → reveal → game over)
│   │   ├── components/
│   │   │   ├── Lobby.tsx          # Waiting room, player list, start button (host only)
│   │   │   ├── MapView.tsx        # Leaflet map with click-to-guess interaction
│   │   │   ├── GuessMarker.tsx    # Pin marker for your own guess
│   │   │   ├── AnswerReveal.tsx   # Shows correct location + all guesses on map after round
│   │   │   ├── Timer.tsx          # Countdown timer during question phase
│   │   │   ├── Scoreboard.tsx     # Live scores sidebar during game
│   │   │   └── GameOver.tsx       # Final standings + global leaderboard table
│   │   ├── hooks/
│   │   │   ├── useGameStore.ts    # Zustand store — all game state lives here
│   │   │   └── useSocket.ts       # Singleton Socket.io connection
│   │   └── lib/
│   │       └── api.ts             # Axios instance pointed at backend
│   └── .env                       # VITE_SERVER_URL=https://geoarena.onrender.com
│
├── server/                        # Express + Socket.io backend
│   ├── src/
│   │   ├── index.ts               # App entry: CORS, routes, Socket.io, MongoDB connect
│   │   ├── game/
│   │   │   └── GameState.ts       # In-memory Map of active rooms and player states
│   │   ├── models/
│   │   │   ├── Room.ts            # MongoDB Room schema (code, host, settings, finalScores)
│   │   │   ├── Question.ts        # MongoDB Question schema (name, hint, difficulty, GeoJSON answer)
│   │   │   └── Leaderboard.ts     # MongoDB Leaderboard schema (username, totalScore, gamesPlayed)
│   │   ├── routes/
│   │   │   ├── rooms.ts           # POST /api/rooms (create), GET /api/rooms/:code (fetch)
│   │   │   ├── questions.ts       # GET /api/questions
│   │   │   └── leaderboard.ts     # GET /api/leaderboard
│   │   └── sockets/
│   │       ├── roomHandler.ts     # join_room, leave_room, disconnect events
│   │       ├── roundHandler.ts    # start_game, submit_guess, next_round + round lifecycle
│   │       └── scoreHandler.ts    # Haversine distance formula + points calculation
│   └── .env                       # PORT, MONGO_URI, CLIENT_ORIGIN, etc.
│
└── seed/                          # One-time DB seeding script
    ├── seed.ts                    # Reads questions.json and inserts into MongoDB
    └── questions.json             # Geography question bank (name, hint, difficulty, coordinates)
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- npm
- A MongoDB Atlas cluster (or local MongoDB)

### 1. Clone the repo

```bash
git clone https://github.com/pragatmittal/GeoArena.git
cd GeoArena
```

### 2. Seed the database

This populates the `questions` collection — **required before starting a game**.

```bash
cd seed
npm install
# Edit seed.ts to point MONGO_URI to your Atlas cluster, then:
npm run seed
cd ..
```

### 3. Start the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=4000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/GeoArena
JWT_SECRET=change_me_in_prod
CLIENT_ORIGIN=http://localhost:5173
ROUND_DURATION_DEFAULT=30
MAX_PLAYERS=8
```

```bash
npm run dev
```

Server runs at `http://localhost:4000`

### 4. Start the frontend

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_SERVER_URL=http://localhost:4000
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🔌 Socket.io Events Reference

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `join_room` | `{ roomId, username }` | Join a room's Socket.io channel |
| `leave_room` | `{ roomId }` | Leave the room gracefully |
| `start_game` | `{ roomId }` | Host-only: start the game and load questions |
| `submit_guess` | `{ roomId, lat, lng }` | Submit a map coordinate as your guess |
| `next_round` | `{ roomId }` | Host-only: advance to the next round |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `player_joined` | `{ players[], hostUsername }` | Broadcast updated player list |
| `player_left` | `{ socketId }` | A player disconnected |
| `game_started` | `{ totalRounds, roundDuration }` | Game has begun |
| `round_started` | `{ roundIndex, totalRounds, question, duration }` | New round with question and timer |
| `guess_received` | `{ socketId, username }` | Confirmation a player submitted a guess |
| `round_ended` | `{ correctLocation, guesses[], scores[] }` | Reveal phase data |
| `score_updated` | `{ scores[] }` | Live score update |
| `game_over` | `{ finalScores[], leaderboard[] }` | Game finished, top-20 global leaderboard |
| `error` | `{ message }` | Something went wrong (redirects to home) |

---

## 🧮 Scoring Formula

Points per round are calculated using **exponential decay** based on the Haversine distance (in km) between the player's guess and the correct location:

```
points = round(5000 × e^(−distance / 2000))
```

| Distance | Points |
|---|---|
| < 1 km | 5000 (max) |
| 100 km | ~4753 |
| 500 km | ~4415 |
| 1000 km | ~3894 |
| 2000 km | ~3033 |
| 5000 km | ~1353 |
| 10000 km | ~365 |

---

## 🌐 Deployment

### Backend (Render)

Environment variables to set on Render:

| Key | Value |
|---|---|
| `PORT` | `4000` |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `CLIENT_ORIGIN` | `https://geo-arena-nu.vercel.app` (your Vercel URL) |
| `JWT_SECRET` | Any secret string |
| `ROUND_DURATION_DEFAULT` | `30` |
| `MAX_PLAYERS` | `8` |

> **Note:** `CLIENT_ORIGIN` supports comma-separated values, e.g. `https://geo-arena-nu.vercel.app,http://localhost:5173`. The server auto-adds `https://` if you accidentally omit the protocol.

### Frontend (Vercel)

Environment variables to set on Vercel:

| Key | Value |
|---|---|
| `VITE_SERVER_URL` | `https://geoarena.onrender.com` |

---

## 🤝 Contributing

1. Fork the project
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push and open a Pull Request
