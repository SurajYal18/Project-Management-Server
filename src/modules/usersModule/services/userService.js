const userManager = require('../managers/userManager');

class UserService {
    async getAllUsers() {
        return await userManager.findAllUsers();
    }

    async getUserById(userId) {
        const user = await userManager.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

module.exports = new UserService();
