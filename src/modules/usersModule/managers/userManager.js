const User = require('../../authModule/models/user');

class UserManager {
    async findAllUsers() {
        return await User.findAll({ 
            attributes: { exclude: ['password'] } 
        });
    }
}

module.exports = new UserManager();
