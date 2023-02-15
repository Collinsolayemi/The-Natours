const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');

//creating a function for the jwt
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//creating a sign up middleware functionality
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  //creating a token for user when they signup
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

//creating a login middlware functionality
exports.login = async (req, res, next) => {
  const { email } = req.body;

  //checking if email and password are inputed
  // if (!email || !password) {
  if (!email) {
    next(new AppError('Please provide email and password!', 400));
  }

  //check if user and password  exist
  const currentUser = await User.findById({ id: req.params.id });
  //.select('+password');

  //calling the instance method created in the user model to compare password
  // if (!user || !(await user.correctPassword(password, user.password))) {
  //   return next(new AppError('Incorrect email or password', 401));
  // }

  //send token to the client if password and email are correct
  // const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    currentUser,
  });
};
