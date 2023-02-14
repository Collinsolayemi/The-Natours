const Users = require('../model/userModel');
const catchAsync = require('../utilities/catchAsync');

//creating a sign up middleware functionality
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await Users.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
