import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 CuraLink Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down');
  server.close(() => console.log('HTTP server closed'));
});


// const http = require('http');
// const { initializeWebSocket } = require('./services/websocketService');

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize WebSocket
// initializeWebSocket(server);

// // Start server
// server.listen(PORT, () => {
//   console.log(`🚀 CuraLink Backend running on port ${PORT}`);
//   console.log(`🔌 WebSocket server running on ws://localhost:${PORT}/ws`);
// });
export default server;
