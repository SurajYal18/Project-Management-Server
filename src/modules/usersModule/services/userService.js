const userManager = require('../managers/userManager');
const { hashPassword, comparePassword } = require('../../../helpers/passwordHelper');

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

    async deleteUser(userId) {
        const deleted = await userManager.deleteUser(userId);
        if (!deleted) {
            throw new Error('User not found');
        }
        return deleted;
    }

    async changePassword(userId, oldPassword, newPassword, requestingUser) {
        if (requestingUser.id !== parseInt(userId)) {
             throw new Error('Unauthorized');
        }

        const user = await userManager.findUserWithPassword(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) {
            throw new Error('Invalid old password');
        }

        const hashedPassword = await hashPassword(newPassword);
        await userManager.updateUser(userId, { password: hashedPassword });
        
        return { message: 'Password updated successfully' };
    }
}

module.exports = new UserService();
