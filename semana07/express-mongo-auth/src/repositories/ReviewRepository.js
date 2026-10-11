import Review from '../models/Review.js';

class ReviewRepository {
  async getAll() {
    return Review.find().sort({ createdAt: 1 }).exec();
  }

  async count() {
    return Review.countDocuments().exec();
  }

  async create(data) {
    return Review.create(data);
  }

  async insertMany(items) {
    return Review.insertMany(items);
  }

  async update(id, data) {
    return Review.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async remove(id) {
    return Review.findByIdAndDelete(id).exec();
  }

  async getImage(id) {
    return Review.findById(id).select('imageType +imageData').exec();
  }
}

export default new ReviewRepository();
