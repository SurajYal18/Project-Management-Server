require('dotenv').config();
const { Sequelize } = require('sequelize');
const logger = require('../../utils/logger');


class DatabaseConfig {
    constructor() {
        this.config = {
            development: {
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_NAME || 'project_management',
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                dialect: 'postgres',
                logging: console.log,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            },
            test: {
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_NAME_TEST || 'project_management_test',
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                dialect: 'postgres',
                logging: false
            },
            production: {
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 5432,
                dialect: 'postgres',
                logging: false,
                pool: {
                    max: 10,
                    min: 2,
                    acquire: 30000,
                    idle: 10000
                },
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                }
            }
        };

   
        this.env = process.env.NODE_ENV || 'development';
        this.dbConfig = this.config[this.env];
       
        this.sequelize = this.createSequelizeInstance();
    }

    // Create and configure Sequelize instance
    createSequelizeInstance() {
        return new Sequelize(
            this.dbConfig.database,
            this.dbConfig.username,
            this.dbConfig.password,
            {
                host: this.dbConfig.host,
                port: this.dbConfig.port,
                dialect: this.dbConfig.dialect,
                logging: (msg) => logger.debug(msg),
                pool: this.dbConfig.pool
            }
        );
    }

    // Authenticate and establish database connection
    async connectDB() {
        try {
            await this.sequelize.authenticate();
            logger.info('Database connection has been established successfully.');
        } catch (error) {
            logger.error('Unable to connect to the database:', error);
            process.exit(1);
        }
    }

    // Get configuration object
    getConfig() {
        return this.config;
    }

    // Get Sequelize instance
    getSequelize() {
        return this.sequelize;
    }
}


const databaseConfig = new DatabaseConfig();


module.exports = databaseConfig.getConfig();
module.exports.sequelize = databaseConfig.getSequelize();
module.exports.connectDB = databaseConfig.connectDB.bind(databaseConfig);