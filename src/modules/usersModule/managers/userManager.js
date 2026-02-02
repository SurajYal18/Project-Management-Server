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

    async findUserWithPassword(userId) {
        return await User.findByPk(userId);
    }

    async updateUser(userId, data) {
        const user = await User.findByPk(userId);
        if (!user) return null;
        await user.update(data);
        return await this.findUserById(userId);
    }

    async deleteUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) return null;
        await user.destroy();
        return true;
    }

    async searchUsers(query) {
        const { Op } = require('sequelize');
        return await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { email_id: { [Op.like]: `%${query}%` } },
                    { user_name: { [Op.like]: `%${query}%` } }
                ]
            },
            attributes: { exclude: ['password', 'refresh_token'] }
        });
    }
}

module.exports = new UserManager();
