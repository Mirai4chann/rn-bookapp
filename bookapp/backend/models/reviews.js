const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  bookId: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  date: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = {
  createReview: (reviewData) => Review.create(reviewData),
  getReviewsByBook: (bookId) => Review.find({ bookId }),
  getUserReviews: (userId) => Review.find({ userId }),
};