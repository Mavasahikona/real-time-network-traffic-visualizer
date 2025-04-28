// Real-time Network Traffic Visualizer

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { networkInterfaces } = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static('public'));

// Get network interfaces
const nets = networkInterfaces();
const results = {};

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Simulate network traffic data
    setInterval(() => {
        const trafficData = {
            timestamp: new Date().toISOString(),
            interface: Object.keys(results)[0],
            bytesIn: Math.floor(Math.random() * 1000),
            bytesOut: Math.floor(Math.random() * 1000),
        };
        socket.emit('trafficUpdate', trafficData);
    }, 1000);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});