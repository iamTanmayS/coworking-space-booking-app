import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(morgan('dev'));

// Service URLs
const CORE_SERVICE_URL = process.env.CORE_SERVICE_URL || 'http://localhost:3000';
const CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL || 'http://localhost:4001';

// Chat Service Proxy (HTTP)
app.use(
    '/api/chat',
    createProxyMiddleware({
        target: CHAT_SERVICE_URL,
        changeOrigin: true,
    })
);

// Core Service Proxy
app.use(
    '/api',
    createProxyMiddleware({
        target: CORE_SERVICE_URL,
        changeOrigin: true,
        on: {
            error: (err, req, res) => {
                console.error('Proxy Error:', err);
                if ('status' in res) {
                    (res as any).status(500).send('Proxy Error');
                } else {
                    const response = res as any;
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end('Proxy Error');
                }
            }
        }
    })
);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API Gateway is running' });
});

const server = app.listen(PORT as number, "0.0.0.0", () => {
    console.log(`API Gateway is running on http://0.0.0.0:${PORT} (Accessible via Network)`);
    console.log(`Routing /api/chat to ${CHAT_SERVICE_URL}`);
    console.log(`Routing /api requests to ${CORE_SERVICE_URL}`);
});

// ─── Socket.io Proxy ────────────────────────────────────────────────────────
// Socket.io uses polling first then upgrades to WebSocket.
// We must proxy BOTH the HTTP polling requests AND the WS upgrade.
const socketProxy = createProxyMiddleware({
    target: CHAT_SERVICE_URL,
    changeOrigin: true,
    ws: true, // enable ws support
    pathRewrite: (path) => path, // preserve full /socket.io/... path — don't let express strip the prefix
});

// Proxy HTTP polling requests for socket.io (EIO handshake)
app.use('/socket.io', socketProxy);

// Proxy WebSocket upgrade requests
server.on('upgrade', (req, socket, head) => {
    if (req.url && req.url.startsWith('/socket.io')) {
        (socketProxy as any).upgrade(req, socket, head);
    }
});
