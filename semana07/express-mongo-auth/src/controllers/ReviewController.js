import reviewService from '../services/ReviewService.js';

class ReviewController {
  async getAll(req, res, next) {
    try {
      return res.status(200).json(await reviewService.getAll());
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      return res.status(201).json(await reviewService.create(req.body));
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      return res.status(200).json(await reviewService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      await reviewService.remove(req.params.id);
      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  // Pública: un <img> no puede enviar el token. Las carátulas no son datos sensibles.
  async image(req, res, next) {
    try {
      const { type, data } = await reviewService.getImage(req.params.id);
      res.set({
        'Content-Type': type,
        'Cache-Control': 'public, max-age=300',
        'X-Content-Type-Options': 'nosniff'
      });
      return res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default new ReviewController();
