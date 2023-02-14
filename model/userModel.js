const mongoose = require('mongoose');
const validator = require('validator');

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

const User = mongoose.model('User', userSchema);

module.exports = User;
