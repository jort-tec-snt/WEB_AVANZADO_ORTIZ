import mongoose from 'mongoose';
import reviewRepository from '../repositories/ReviewRepository.js';
import { parseReview } from './reviewValidation.js';

const notFound = () => Object.assign(new Error('Reseña no encontrada'), { status: 404 });

class ReviewService {
  getAll() {
    return reviewRepository.getAll();
  }

  create(body) {
    const { fields, image } = parseReview(body);
    const data = image ? { ...fields, imageType: image.type, imageData: image.data } : fields;
    return reviewRepository.create(data);
  }

  // image ausente = no cambia; image null = elimina la imagen; data URL = reemplaza.
  async update(id, body) {
    if (!mongoose.isValidObjectId(id)) throw notFound();
    const { fields, image } = parseReview(body, { partial: true });
    const update = { $set: fields };
    if (image === null) {
      update.$set.imageType = '';
      update.$unset = { imageData: 1 };
    } else if (image) {
      update.$set.imageType = image.type;
      update.$set.imageData = image.data;
    }
    const review = await reviewRepository.update(id, update);
    if (!review) throw notFound();
    return review;
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) throw notFound();
    if (!(await reviewRepository.remove(id))) throw notFound();
  }

  async getImage(id) {
    if (!mongoose.isValidObjectId(id)) throw notFound();
    const review = await reviewRepository.getImage(id);
    if (!review || !review.imageType || !review.imageData) throw notFound();
    return { type: review.imageType, data: review.imageData };
  }
}

export default new ReviewService();
