const User = require('../../authModule/models/user');

class UserManager {
    async findAllUsers() {
        return await User.findAll({ 
            attributes: { exclude: ['password', 'refresh_token'] } 
        });
    }

    async findUserById(userId) {
        return await User.findByPk(userId, {
            attributes: { exclude: ['password', 'refresh_token'] }
        });
    }
}

module.exports = new UserManager();
