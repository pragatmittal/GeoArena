# GeoArena 🌍

GeoArena is a real-time multiplayer geography quiz game where players compete to identify locations on a map based on specific questions. Built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for seamless real-time interaction.

## 🚀 Features

- **Real-time Multiplayer**: Join rooms and compete with others instantly using Socket.io.
- **Interactive Map**: Guess locations using a photorealistic satellite map powered by Leaflet.
- **Dynamic Questions**: A diverse set of geography questions to test your knowledge.
- **Live Leaderboard**: Track your score and see how you rank against other players.
- **Room Management**: Create or join custom game rooms for private or public sessions.

## 🛠️ Tech Stack

- **Frontend**: Vite, React, TypeScript, Leaflet (React-Leaflet), Zustand (State Management), Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, Mongoose (MongoDB ODM), TypeScript.
- **Database**: MongoDB (via Docker).
- **Environment**: Docker Compose for easy local development.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

## ⚙️ Setup Instructions

### 1. Database (MongoDB)
Start the MongoDB service using Docker Compose:
```bash
docker-compose up -d
```

### 2. Seed Data
Populate the database with initial geography questions:
```bash
cd seed
npm install
npm build # if applicable, then npm start or:
npx ts-node seed.ts
cd ..
```

### 3. Server
Configure and start the backend server:
```bash
cd server
npm install
# Create a .env file based on .env.example (if available) or use defaults:
# PORT=4000
# MONGO_URI=mongodb://localhost:27017/geoquiz
npm run dev
cd ..
```

### 4. Client
Configure and start the frontend application:
```bash
cd client
npm install
# Create a .env file:
# VITE_API_URL=http://localhost:4000
npm run dev
```
Open your browser at `http://localhost:5173` to start playing!

## 📂 Project Structure

- `client/`: Preact-based frontend application with Leaflet integration.
- `server/`: Express & Socket.io backend handling game logic and rooms.
- `seed/`: Utility scripts to populate the database with question data.
- `docker-compose.yml`: Docker configuration for local services (MongoDB).

## 🤝 Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git checkout origin feature/AmazingFeature`).
5. Open a Pull Request.

---
Built with ❤️ by the GeoArena Team.
