const Review = require('../model/review-model');
const catchAsync = require('../utilities/catch-async');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const getAll = await Review.find();
});
 

