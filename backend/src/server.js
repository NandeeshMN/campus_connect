const http = require('http');
const app = require('./app');
const { initSocket } = require('./config/socket');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io (future-ready)
initSocket(server, process.env.CORS_ORIGIN);

// Start server
server.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` CampusConnect server running on port: ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=============================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
