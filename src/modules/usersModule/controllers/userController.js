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

    // Fetch user by ID
    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            return successResponse(res, 'User fetched successfully', user, 200);
        } catch (error) {
            if (error.message === 'User not found') {
                return errorResponse(res, error.message, 404);
            }
            return errorResponse(res, 'Failed to fetch user', 500, error.message);
        }
    }
}

module.exports = new UserController();
