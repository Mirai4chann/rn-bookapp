const express = require('express');
const router = express.Router();
const { createReview, getReviewsByBook, getUserReviews } = require('../models/reviews');

router.post('/', async (req, res) => {
  try {
    const review = await createReview(req.body);
    res.json(review);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(400).json({ error: 'Error creating review' });
  }
});

router.get('/book/:bookId', async (req, res) => {
  try {
    const reviews = await getReviewsByBook(req.params.bookId);
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching book reviews:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await getUserReviews(req.params.userId);
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;