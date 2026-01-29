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

    async updateUser(userId, data, requestingUser) {
        // Authorization check: User can update their own profile, Admin can update anyone
        if (requestingUser.role !== 'admin' && requestingUser.id !== parseInt(userId)) {
            throw new Error('Unauthorized');
        }

        const updatedUser = await userManager.updateUser(userId, data);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
}

module.exports = new UserService();
