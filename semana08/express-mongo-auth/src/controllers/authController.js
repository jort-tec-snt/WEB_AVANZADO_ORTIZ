import { authService } from '../services/authService.js';

export const authController = {
  async register(req, res) {
    res.status(201).json(await authService.register(req.body));
  },
  async login(req, res) {
    res.json(await authService.login(req.body));
  },
  async profile(req, res) {
    res.json(await authService.profile(req.user.id));
  }
};
