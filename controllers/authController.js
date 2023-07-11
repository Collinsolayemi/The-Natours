const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const sendEmail = require('../utilities/email');

// jwt functionality
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//creating a jwt send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  //sending cookies as a response
  //cookie opions
  const cookieOption = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  };

  if (process.env.NODE_env === 'production') cookieOption.secure = true;

  res.cookie('jwt', token, cookieOption),
    //remove password from res body
    (user.password = undefined);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//creating a sign up middleware functionality
exports.signUp = catchAsync(async (req, res, next) => {
  //check if the email is already registered
  const checkEmail = await User.findOne({ email: req.body.email });

  if (checkEmail) {
    return next(new AppError('Email already register, please sign in', 400));
  }

  const newUser = await User.create({
    userName: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  //destructuring because i dont want the password field to show in response
  const { password, ...others } = newUser._doc;
  const user = others;

  //creating a token for user when they signup
  createSendToken(newUser, 201, res);
});

//creating user login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if the email and password was provided by  the user
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
  createSendToken(existingUser, 200, res);
});

// middleware to verify if user is log in for authorisation to access protected route
exports.protect = catchAsync(async (req, res, next) => {
  //Getting the token and checking if token is there
  let token = '';
  const headersReq = req.headers.authorization;
  if (headersReq && headersReq.startsWith('Bearer')) {
    token = headersReq.split(' ')[1];
  }

  //check if token exist
  if (!token) {
    return next(
      new AppError('You are not logged in, please log in to get access', 401)
    );
  }

  //token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if the user still exist
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }

  console.log(freshUser);

  //check if user changed password after token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Password recently changed by the user, Please log in again',
        401
      )
    );
  }

  //Grant access to protected route
  req.user = freshUser;
  next();
});

//authorization controller for restricted to some action
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not permitted to perform this action', 403)
      );
    }
    next();
  };
};

//password forgotten
exports.forgetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError('please input your email', 404))
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User not found, wrong credencials', 404));
  }

  //generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send token to the user gmail
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/v1/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? submit a PATCH request with your new password and passwordConfirm to: ${resetURL}\nIf you did not forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    (user.PasswordResetToken = undefined),
      (user.passworkTokenExpires = undefined);
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was a problem sending the email, please try again later!',
        500
      )
    );
  }
});

//reset password of a current user
exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user base on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    PasswordResetToken: hashedToken,
    passworkTokenExpires: {
      $gt: Date.now(),
    },
  });

  //if token have not expire and there is a user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.PasswordResetToken = undefined;
  user.passworkTokenExpires = undefined;
  user.save();

  //log the user in , send the JWT
  createSendToken(user, 200, res);
});

//change password functionality when a user is logged in
exports.updatePassword = catchAsync(async (req, res, next) => {
  //get the user
  const user = await User.findById(req.user.id).select('+password');

  //check if password input by user is correct
  if (!(await user.comparePassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Password incrrect', 401));
  }
  //if everything is okay, update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  //login user and send jwt
  createSendToken(newUser, 201, res);
});
