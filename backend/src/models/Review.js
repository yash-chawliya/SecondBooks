import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  bookId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true, trim: true, maxLength: 5000 },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
