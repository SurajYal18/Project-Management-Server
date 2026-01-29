const userService = require('../services/userService');
const successResponse = require('../../../utils/successResponse');
const errorResponse = require('../../../utils/errorResponse');

class UserController {
    // Fetch all users
    async getUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return successResponse(res, 'Users fetched successfully', users, 200);
        } catch (error) {
            return errorResponse(res, 'Failed to fetch users', 500, error.message);
        }
    }
}

module.exports = new UserController();
