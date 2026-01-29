const userService = require('../services/userService');
const successResponse = require('../../../utils/successResponse');
const errorResponse = require('../../../utils/errorResponse');
const { validateUpdateUser, validateChangePassword } = require('../validators/userValidator');

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

    // Update user profile
    async updateUser(req, res) {
        try {
            // Validate input
            const { error, value } = validateUpdateUser(req.body);
            if (error) {
                return errorResponse(res, error.details[0].message, 400);
            }

            const updatedUser = await userService.updateUser(req.params.id, value, req.user);
            return successResponse(res, 'User updated successfully', updatedUser, 200);
        } catch (error) {
            if (error.message === 'Unauthorized') {
                return errorResponse(res, 'You are not authorized to update this profile', 403);
            }
            if (error.message === 'User not found') {
                return errorResponse(res, error.message, 404);
            }
            return errorResponse(res, 'Failed to update user', 500, error.message);
        }
    }

    // Delete user
    async deleteUser(req, res) {
        try {
            await userService.deleteUser(req.params.id);
            return successResponse(res, 'User deleted successfully', null, 200);
        } catch (error) {
            if (error.message === 'User not found') {
                return errorResponse(res, error.message, 404);
            }
            return errorResponse(res, 'Failed to delete user', 500, error.message);
        }
    }

    // Change password
    async changePassword(req, res) {
        try {
            const { error, value } = validateChangePassword(req.body);
            if (error) {
                return errorResponse(res, error.details[0].message, 400);
            }

            const { old_password, new_password } = value;
            await userService.changePassword(req.params.id, old_password, new_password, req.user);
            return successResponse(res, 'Password changed successfully', null, 200);

        } catch (error) {
            if (error.message === 'Unauthorized') {
                return errorResponse(res, 'You are not authorized to change this password', 403);
            }
            if (error.message === 'User not found') {
                return errorResponse(res, error.message, 404);
            }
            if (error.message === 'Invalid old password') {
                return errorResponse(res, error.message, 400);
            }
            return errorResponse(res, 'Failed to change password', 500, error.message);
        }
    }
}

module.exports = new UserController();
