// Import required modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notfound');
const { apiLimiter } = require('./middlewares/rateLimiter');

// Initialize Express app
const app = express();

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(apiLimiter);

// Configure routes
app.use('/api/v1', routes);

// Configure error handling middleware
app.use(notFound);
app.use(errorHandler);

// Export configured app
module.exports = app;
