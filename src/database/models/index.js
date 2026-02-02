
const { sequelize } = require('../config/database');
const User = require('../../modules/authModule/models/user');

class DatabaseModels {
    constructor() {
        this.sequelize = sequelize;
        this.User = User;
    }

    getAllModels() {
        return {
            sequelize: this.sequelize,
            User: this.User
        };
    }
}

module.exports = new DatabaseModels().getAllModels();
