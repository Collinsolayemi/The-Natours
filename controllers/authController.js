const User = require('../model/userModel');
const catchAsync = require('../utilities/catchAsync');

//creating a sign up middleware functionality
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    user: newUser,
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  const logInUser = await User.find({
    $and: {},
  });
});
