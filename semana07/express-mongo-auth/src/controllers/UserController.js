import userService from '../services/UserService.js';

class UserController {
  async updateMe(req, res, next) {
    try {
      const user = await userService.updateProfile(req.userId, req.body);
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();
      return res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await userService.getById(req.userId);
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
