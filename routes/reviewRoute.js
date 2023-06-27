const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/review-controller');
const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
