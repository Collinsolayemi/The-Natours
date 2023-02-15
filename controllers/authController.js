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

  //destructuring because i dont want the password filed to show in response
  const { password, ...others } = newUser._doc;
  const user = others;

  //creating a token for user when they signup
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
});

//creating user login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if the email and password was provided ny the user
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  //check if the email and password exist and compare the credentials
  const existingUser = await User.findOne({ email }).select('+password');

  //check the existing input are valid
  if (
    !existingUser ||
    !(await existingUser.comparePassword(password, existingUser.password))
  ) {
    return next(new AppError('Incorrect email  or password', 401));
  }

  //if everything is okay send a token
  const token = signToken(existingUser);
  res.status(200).json({
    status: 'success',
    token,
  });
});
