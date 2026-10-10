import { userService } from '../services/userService.js';

export const userController = {
  async getAll(req, res) {
    res.json(await userService.getAll());
  },
  async getById(req, res) {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  },
  async update(req, res) {
    const updated = await userService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(updated);
  },
  async remove(req, res) {
    await userService.remove(req.params.id);
    res.status(204).end();
  }
};
