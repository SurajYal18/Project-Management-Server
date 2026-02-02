/**
 * Server Entry Point
 * Starts the HTTP server and handles process termination
 */
require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

const { connectDB, sequelize } = require('./src/database/config/database');
// Import models to ensure they are registered with Sequelize
require('./src/modules/authModule/models/user');

const server = http.createServer(app);

const startServer = async () => {
    try {
        await connectDB();

        // Sync database based on environment
        const env = process.env.NODE_ENV || 'development';

        if (env === 'development') {
            await sequelize.sync({ alter: true });
            logger.info('Database models synced (development mode)');
        } else {
            logger.info('Production mode - use migrations for schema changes');
        }

        server.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();


process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
