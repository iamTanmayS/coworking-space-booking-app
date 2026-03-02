import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import chatRoutes from './routes/chat.routes.js';
import { setupSocketHandlers } from './controllers/socket.controller.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);

// Enable CORS for API Gateway and direct WebSocket connections
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// Init Database
connectDB();

// Setup Rest API Routes — mounted at / because API Gateway strips /api/chat
app.use('/', chatRoutes);

// Setup Socket.io Server
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    path: '/socket.io' // Note: Ensure API Gateway proxies this path
});

setupSocketHandlers(io);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Chat Service is running' });
});

const PORT = 4001;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Chat Service running on port ${PORT}`);
});