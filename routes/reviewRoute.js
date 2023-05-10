const express = require('express');

const reviewController = require('../controllers/review-controller');
const router = express.Router();

router.route('/').get(reviewController.getAllReviews);

module.exports = router;
