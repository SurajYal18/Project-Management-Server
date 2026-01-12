/**
 * System Logger Configuration
 * Configures Winston logger for error and info logging
 */
const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Logger configuration with info and error file transports
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logDir, 'info.log') }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ],
});

module.exports = logger;
