/**
 * Server Entry Point
 * Starts the HTTP server and handles process termination
 */
require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});


process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
