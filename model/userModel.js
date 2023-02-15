const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//creating a model for the users
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    maxlength: [20, 'A name must have not be more than  20 characters'],
    minlength: [8, 'A tour must have at least 8 characters'],
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
  password: {
    type: String,
    required: [true, 'Please provide a  password'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

//hashing the password with bcryptjs
userSchema.pre('save', async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  //hashing the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //we only hash the password not confirm password so we dlete password confirm field
  this.confirmPassword = undefined;
  next();
});

//creating an instance method function to compare user password
userSchema.method.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
