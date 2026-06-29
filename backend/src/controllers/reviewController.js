import Review from '../models/Review.js';

export const submitReview = async (req, res) => {
  try {
    const { orderId, bookId, rating, reviewText } = req.body;
    const userId = req.userId; // Get from auth middleware

    if (!orderId || !bookId || !rating || !reviewText) {
      return res.status(400).json({ message: 'Missing required review fields.' });
    }

    const existingReview = await Review.findOne({ orderId, userId });
    if (existingReview) {
      return res.status(409).json({ message: 'You have already submitted a review for this order.' });
    }

    const newReview = new Review({
      orderId,
      bookId,
      userId,
      rating,
      reviewText
    });

    await newReview.save();

    res.status(201).json({ message: 'Thank you! Your review has been submitted.' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error while submitting review.' });
  }
};
