const AppError = require('../utilities/appError');

//cast error handler when the id is invalid
const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

//duplicate field handler when user input duplicate fields
const handleDuplicateFields = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field: ${value} . Please input another value`;
  return new AppError(message, 400);
};

//creating a function for the validation error
const validationErrorDb = (err) => {
  //we loop through the value of the object
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 404);
};

//jwt error handler
const handleJwtError = () =>
  new AppError('Invalid token. Please login again', 401);

//error when token is expired
const handleJwtErrorExpired = () => {
  new AppError('Token expired. Please login again', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const sendErrorProd = (err, res) => {
  //operational error: send error details to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //programming or other unknown error: dont leak it to the client
  } else {
    //log error
    console.error('ERROR 👎', err);

    //send a generic mesage
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDb(error);
    if (err.code === 11000) error = handleDuplicateFields(error);
    if (err.name === 'validation error') error = handleCastErrorDb(error);
    if (err.status === 'error') error = validationErrorDb(error);
    if (err.name === 'JsonWebTokenError') error = handleJwtError(error);
    if (err.name === 'TokenExpiredError') error = handleJwtErrorExpired(error);
    sendErrorProd(error, res);
  }
};

console.log('housing')