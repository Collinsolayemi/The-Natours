const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//creating a model for the users
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name cannot be empty'],
    maxlength: [20, 'A name must have not be more than  20 characters'],
    minlength: [5, 'A name must have at least 8 characters'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a  password'],
  },
  // confirmPassword: {
  //   type: String,
  //   required: [true, 'Please confirm your password'],
  //   validate: {
  //     validator: function (el) {
  //       return el === this.password;
  //     },
  //     message: 'Passwords are not the same',
  //   },
  // },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//implementing when password was changed exactly
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
});

//query middleware to get the active user when we make a req  to get all users
userSchema.pre(/^find/, function (next) {
  //this point to the current query
  //this.find({ active: true });
  this.find({ active: { $ne: false } });
  next();
});

//hashing the password with bcryptjs, the pre run between creating the data and saving data in db
userSchema.pre('save', async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  //hashing the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //hash the password and delete password confirm field
  //this.confirmPassword = undefined;
  next();
});

//instance method to compare user password and db hash password
userSchema.methods.comparePassword = async function (
  inputPassword,
  savedPassword
) {
  return await bcrypt.compare(inputPassword, savedPassword);
};

//creating an instance method to check if password have been changed
userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  //false means not changed
  return false;
};

//creating an instance method for password reset token
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000;

  console.log(resetToken);

  return resetToken;
};

//exporting the user model
const User = mongoose.model('User', userSchema);
module.exports = User;


