import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    year: { type: Number, required: true, min: 1888, max: 2100 },
    minutes: { type: Number, min: 1, max: 999 },
    format: { type: String, trim: true, maxlength: 40, default: '' },
    tags: { type: String, trim: true, maxlength: 100, default: '' },
    score: { type: Number, min: 0, max: 10, default: 0 },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    // La imagen vive en Atlas (el disco de Render se borra en cada despliegue).
    imageType: { type: String, default: '' },
    imageData: { type: Buffer, select: false }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = String(ret._id);
        ret.hasImage = Boolean(ret.imageType);
        delete ret._id;
        delete ret.__v;
        delete ret.imageType;
        delete ret.imageData;
        return ret;
      }
    }
  }
);

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
