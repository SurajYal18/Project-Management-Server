// Import required modules
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Logger configuration class
class Logger {
    constructor() {
        // Set log directory path
        this.logDir = path.join(__dirname, 'logs');
        // Ensure log directory exists
        this.ensureLogDirectoryExists();
        // Create Winston logger instance
        this.logger = this.createLogger();
    }

    // Create logs directory if it doesn't exist
    ensureLogDirectoryExists() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
    }

    // Create and configure Winston logger
    createLogger() {
        return winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                // Error log file transport
                new winston.transports.File({
                    filename: path.join(this.logDir, 'error.log'),
                    level: 'error'
                }),
                // Combined log file transport
                new winston.transports.File({
                    filename: path.join(this.logDir, 'info.log')
                }),
                // Console transport with colorized output
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ],
        });
    }

    // Get logger instance
    getLogger() {
        return this.logger;
    }
}

// Export singleton logger instance
module.exports = new Logger().getLogger();
